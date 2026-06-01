import * as React from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { QrCode } from "lucide-react"
import { Scanner } from "@yudiel/react-qr-scanner"

export interface QRScannerProps {
  onScan?: (data: string) => void
  onError?: (error: Error) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  open,
  onOpenChange,
}) => {
  const handleScan = (result: any) => {
    if (result && result[0] && result[0].rawValue) {
      const scannedValue = result[0].rawValue
      onScan?.(scannedValue)
      onOpenChange?.(false)
    }
  }

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error)
    onError?.(error)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <QrCode className="h-5 w-5" />
          <span className="sr-only">Scan QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Point your camera at a Lightning invoice, LNURL, or BOLT12 offer
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-2">
          {open ? (
            <div className="aspect-square w-full max-w-sm rounded-lg overflow-hidden border border-border">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                styles={{
                  container: {
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1/1",
                  },
                }}
              />
            </div>
          ) : (
            <div className="aspect-square w-full max-w-sm rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Camera preview will appear here
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { QRScanner }
