import { useState, useEffect, useRef } from "react"
import { Header } from "./components/header"
import { SearchInput } from "./components/search-input"
import { QRScanner } from "./components/qr-scanner"
import { InvoiceDetails } from "./components/invoice-details"
import { ErrorDisplay } from "./components/error-display"
import { PaymentHashVerifier } from "./components/payment-hash-verifier"
import { parseInvoice } from "./utils/invoices"
import { AnimatePresence, motion } from "framer-motion"

function App() {
  const [inputValue, setInputValue] = useState("")
  const [invoiceData, setInvoiceData] = useState<Record<string, any> | null>(null)
  const [invoiceType, setInvoiceType] = useState<"bolt11" | "lnurl" | "bolt12" | "lightning-address" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [qrScannerOpen, setQrScannerOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "payment-hash-verifier">("home")
  const inputRef = useRef<HTMLInputElement>(null)

  // Check URL for invoice on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const queryInvoice = urlParams.get('q')
    const pathInvoice = window.location.pathname.slice(1) // Remove leading slash
    
    const invoiceToLoad = queryInvoice || pathInvoice
    
    if (invoiceToLoad) {
      setInputValue(invoiceToLoad)
      handleDecode(invoiceToLoad)
    }
  }, [])

  const handleDecode = async (value?: string) => {
    const invoiceToDecode = value || inputValue
    if (!invoiceToDecode.trim()) {
      setError("Please enter a Lightning invoice, LNURL, or Lightning address")
      return
    }

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

      // Determine invoice type
      if (result.isBOLT12) {
        setInvoiceType("bolt12")
      } else if (result.isLNURL) {
        if (result.isLNAddress) {
          setInvoiceType("lightning-address")
        } else {
          setInvoiceType("lnurl")
        }
      } else {
        setInvoiceType("bolt11")
      }

      setInvoiceData(result.data)
      
      // Update URL - prefer ?q= parameter, but also support / path for backwards compatibility
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

  const shouldShiftUp = isLoading || !!error || !!invoiceData

  return (
    <div className="min-h-screen bg-background flex items-center overflow-hidden">
      <motion.div
        className="container mx-auto px-4 pb-8 max-w-4xl w-full"
        initial={false}
        animate={{
          y: shouldShiftUp ? "-20vh" : "0px",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 30,
        }}
      >
        <motion.div layout className="space-y-4">
          <Header
            onNavigateToVerifier={handleNavigateToVerifier}
            onOpenQRScanner={handleOpenQRScanner}
          />
        </motion.div>

        {currentView === "home" ? (
          <motion.div layout className="space-y-6">
            <SearchInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={invoiceData ? handleClear : () => handleDecode()}
              isLoading={isLoading}
              hasResult={!!invoiceData}
              placeholder="Enter invoice or address"
              className="w-full"
              autoFocus
            />

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <ErrorDisplay message={error} />
                </motion.div>
              )}

              {invoiceData && invoiceType && (
                <motion.div
                  key="invoice"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <InvoiceDetails type={invoiceType} data={invoiceData} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <PaymentHashVerifier onNavigateHome={handleNavigateHome} />
        )}

        <QRScanner
          open={qrScannerOpen}
          onOpenChange={setQrScannerOpen}
          onScan={handleQRScan}
        />
      </motion.div>
    </div>
  )
}

export default App
