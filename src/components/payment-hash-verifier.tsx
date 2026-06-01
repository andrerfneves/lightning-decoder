import * as React from "react"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { parseInvoice } from "../utils/invoices"
import { ArrowLeft, CheckCircle2, XCircle, Shield, Copy, Zap } from "lucide-react"

export interface PaymentHashVerifierProps {
  onNavigateHome?: () => void
  className?: string
}

// Helper to hash a preimage using SHA-256
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Helper to extract payment hash from decoded invoice data
function extractPaymentHash(data: Record<string, any>): string | null {
  if (!data) return null

  // BOLT11: check top-level payment_hash
  if (data.payment_hash) {
    const ph = data.payment_hash
    if (typeof ph === "string") return ph
    if (ph && typeof ph.toString === "function") return ph.toString("hex")
    return String(ph)
  }

  // BOLT11: check tags array
  if (data.tags && Array.isArray(data.tags)) {
    const paymentHashTag = data.tags.find(
      (tag: any) => tag.tagName === "payment_hash" || tag.tagName === "paymentHash"
    )
    if (paymentHashTag && paymentHashTag.data) {
      const ph = paymentHashTag.data
      if (typeof ph === "string") return ph
      if (ph && typeof ph.toString === "function") return ph.toString("hex")
      return String(ph)
    }
  }

  // BOLT12: check top-level paymentHash
  if (data.paymentHash) {
    const ph = data.paymentHash
    if (typeof ph === "string") return ph
    if (ph && typeof ph.toString === "function") return ph.toString("hex")
    return String(ph)
  }

  return null
}

const PaymentHashVerifier: React.FC<PaymentHashVerifierProps> = ({
  onNavigateHome,
  className,
}) => {
  const [invoiceInput, setInvoiceInput] = useState("")
  const [paymentHash, setPaymentHash] = useState<string | null>(null)
  const [preimageInput, setPreimageInput] = useState("")
  const [verificationResult, setVerificationResult] = useState<"match" | "no-match" | null>(null)
  const [computedHash, setComputedHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const preimageRef = useRef<HTMLInputElement>(null)

  const handleDecodeInvoice = async () => {
    if (!invoiceInput.trim()) {
      setError("Please enter a Lightning invoice")
      return
    }

    setIsLoading(true)
    setError(null)
    setPaymentHash(null)
    setVerificationResult(null)
    setComputedHash(null)

    try {
      const result = await parseInvoice(invoiceInput)

      if (result?.error) {
        setError(result.error)
        return
      }

      if (!result?.data) {
        setError("Could not decode this invoice")
        return
      }

      const hash = extractPaymentHash(result.data)
      if (!hash) {
        setError("No payment hash found in this invoice. Make sure it is a BOLT11 or BOLT12 invoice.")
        return
      }

      setPaymentHash(hash)
      // Focus on preimage input after successful decode
      setTimeout(() => preimageRef.current?.focus(), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode invoice")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!preimageInput.trim()) {
      setError("Please enter a preimage")
      return
    }

    if (!paymentHash) {
      setError("Please decode an invoice first")
      return
    }

    setIsVerifying(true)
    setError(null)
    setVerificationResult(null)
    setComputedHash(null)

    try {
      const hash = await sha256(preimageInput)
      setComputedHash(hash)

      // Normalize payment hash for comparison (remove spaces, lowercase)
      const normalizedPaymentHash = paymentHash.replace(/\s/g, "").toLowerCase()
      const normalizedComputedHash = hash.toLowerCase()

      if (normalizedComputedHash === normalizedPaymentHash) {
        setVerificationResult("match")
      } else {
        setVerificationResult("no-match")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compute hash")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCopyHash = () => {
    if (paymentHash) {
      navigator.clipboard.writeText(paymentHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setInvoiceInput("")
    setPaymentHash(null)
    setPreimageInput("")
    setVerificationResult(null)
    setComputedHash(null)
    setError(null)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Payment Hash Verifier
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verify that a preimage hashes to a payment hash
          </p>
        </div>
        <Button variant="ghost" onClick={onNavigateHome} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Decoder
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Decode Invoice */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 1</Badge>
              <CardTitle className="text-lg">Enter Invoice</CardTitle>
            </div>
            <CardDescription>
              Paste a BOLT11 or BOLT12 invoice to extract its payment hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={invoiceInput}
                onChange={(e) => setInvoiceInput(e.target.value)}
                placeholder="Paste a Lightning invoice (BOLT11 or BOLT12)"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleDecodeInvoice()}
              />
              <Button
                onClick={handleDecodeInvoice}
                disabled={isLoading || !invoiceInput.trim()}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                {isLoading ? "Decoding..." : "Decode"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {paymentHash && (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Payment Hash</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyHash}
                          className="gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy payment hash to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <code className="block text-xs bg-muted p-3 rounded font-mono break-all">
                  {paymentHash}
                </code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Verify Preimage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 2</Badge>
              <CardTitle className="text-lg">Enter Preimage</CardTitle>
            </div>
            <CardDescription>
              Enter the preimage to verify it matches the payment hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                ref={preimageRef}
                value={preimageInput}
                onChange={(e) => setPreimageInput(e.target.value)}
                placeholder="Paste the preimage (hex or plain text)"
                className="flex-1"
                disabled={!paymentHash}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !paymentHash || !preimageInput.trim()}
                variant={verificationResult === "match" ? "default" : "secondary"}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>

            {/* Result Display */}
            {verificationResult && (
              <div className="space-y-3">
                <Separator />
                <div className="flex items-center gap-3">
                  {verificationResult === "match" ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium text-green-600">Preimage is valid!</p>
                        <p className="text-sm text-muted-foreground">
                          The SHA-256 hash of the preimage matches the payment hash.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <div>
                        <p className="font-medium text-red-600">Preimage does not match</p>
                        <p className="text-sm text-muted-foreground">
                          The SHA-256 hash of the preimage does not match the payment hash.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Invoice Payment Hash</span>
                    <code className="text-xs font-mono">{paymentHash}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Computed SHA-256 Hash</span>
                    <code className="text-xs font-mono">{computedHash}</code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}

export { PaymentHashVerifier }
