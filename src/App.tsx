import { useState, useEffect, useRef } from "react"
import { Header } from "./components/header"
import { SearchInput } from "./components/search-input"
import { QRScanner } from "./components/qr-scanner"
import { InvoiceDetails } from "./components/invoice-details"
import { ErrorDisplay } from "./components/error-display"
import { PaymentHashVerifier } from "./components/payment-hash-verifier"
import { parseInvoice } from "./utils/invoices"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"

function App() {
  const [inputValue, setInputValue] = useState("")
  const [invoiceData, setInvoiceData] = useState<Record<string, any> | null>(null)
  const [invoiceType, setInvoiceType] = useState<"bolt11" | "lnurl" | "bolt12" | "lightning-address" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [qrScannerOpen, setQrScannerOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "payment-hash-verifier">("home")
  const [shouldLiftContent, setShouldLiftContent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const queryInvoice = urlParams.get("q")
    const pathInvoice = window.location.pathname.slice(1)

    const invoiceToLoad = queryInvoice || pathInvoice

    if (invoiceToLoad) {
      setInputValue(invoiceToLoad)
      setShouldLiftContent(true)
      handleDecode(invoiceToLoad)
    }
  }, [])

  useEffect(() => {
    if (currentView !== "home") {
      setShouldLiftContent(false)
    }
  }, [currentView])

  const handleDecode = async (value?: string) => {
    const invoiceToDecode = value || inputValue
    if (!invoiceToDecode.trim()) {
      setShouldLiftContent(true)
      setError("Please enter a Lightning invoice, LNURL, or Lightning address")
      return
    }

    setShouldLiftContent(true)
    setIsLoading(true)
    setError(null)
    setInvoiceData(null)
    setInvoiceType(null)

    try {
      const result = await parseInvoice(invoiceToDecode)

      if (result.error) {
        setError(result.error)
        return
      }

      if (!result.data) {
        setError("Could not decode this invoice")
        return
      }

      if (result.isBOLT12) {
        setInvoiceType("bolt12")
      } else if (result.isLNURL) {
        setInvoiceType(result.isLNAddress ? "lightning-address" : "lnurl")
      } else {
        setInvoiceType("bolt11")
      }

      setInvoiceData(result.data)
      window.history.pushState({}, "", `/?q=${encodeURIComponent(invoiceToDecode)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while decoding")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputValue("")
    setInvoiceData(null)
    setInvoiceType(null)
    setError(null)
    window.history.pushState({}, "", "/")
    inputRef.current?.focus()
  }

  const handleQRScan = (data: string) => {
    setInputValue(data)
    setQrScannerOpen(false)
    handleDecode(data)
  }

  const handleNavigateToVerifier = () => {
    setCurrentView("payment-hash-verifier")
    window.history.pushState({}, "", "/verify-payment-hash")
  }

  const handleNavigateHome = () => {
    setCurrentView("home")
    window.history.pushState({}, "", "/")
  }

  const handleOpenQRScanner = () => {
    setQrScannerOpen(true)
  }

  const hasActiveContent = isLoading || !!error || !!invoiceData
  const errorTone = error?.toLowerCase().includes("please enter") ? "warning" : "error"

  return (
    <div className="min-h-screen bg-background">
      <LayoutGroup>
        {currentView === "home" ? (
          <motion.main
            className="container mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: shouldLiftContent ? "-4vh" : "0px",
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Header
              onNavigateToVerifier={handleNavigateToVerifier}
              onOpenQRScanner={handleOpenQRScanner}
            />

            <div className="mt-6 space-y-6">
              <SearchInput
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (error) {
                    setError(null)
                  }
                }}
                onSubmit={invoiceData ? handleClear : () => handleDecode()}
                isLoading={isLoading}
                hasResult={!!invoiceData}
                placeholder="Enter invoice or address"
                className="w-full"
                autoFocus
              />

              <AnimatePresence
                mode="popLayout"
                initial={false}
                onExitComplete={() => {
                  if (!hasActiveContent) {
                    setShouldLiftContent(false)
                  }
                }}
              >
                {error && (
                  <motion.div
                    key="error"
                    layout
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <ErrorDisplay message={error} tone={errorTone} />
                  </motion.div>
                )}

                {invoiceData && invoiceType && (
                  <motion.div
                    key="invoice"
                    layout
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <InvoiceDetails type={invoiceType} data={invoiceData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        ) : (
          <div className="container mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-8">
            <PaymentHashVerifier onNavigateHome={handleNavigateHome} />
          </div>
        )}
      </LayoutGroup>

      <QRScanner
        open={qrScannerOpen}
        onOpenChange={setQrScannerOpen}
        onScan={handleQRScan}
      />
    </div>
  )
}

export default App
