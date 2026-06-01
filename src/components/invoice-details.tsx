import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Separator } from "./ui/separator"
import { formatDetailsKey } from "../utils/keys"

export interface InvoiceDetailsProps {
  type: "bolt11" | "lnurl" | "bolt12" | "lightning-address"
  data: Record<string, any>
  className?: string
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  type,
  data,
  className,
}) => {
  const getTypeLabel = () => {
    switch (type) {
      case "bolt11":
        return "BOLT11"
      case "lnurl":
        return "LNURL"
      case "bolt12":
        return "BOLT12"
      case "lightning-address":
        return "Lightning Address"
      default:
        return "Invoice"
    }
  }

  const getTypeVariant = () => {
    switch (type) {
      case "bolt11":
        return "default" as const
      case "lnurl":
        return "secondary" as const
      case "bolt12":
        return "outline" as const
      case "lightning-address":
        return "default" as const
      default:
        return "default" as const
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "bolt11":
        return "bg-blue-500 hover:bg-blue-600"
      case "lnurl":
        return "bg-purple-500 hover:bg-purple-600"
      case "bolt12":
        return "bg-green-500 hover:bg-green-600"
      case "lightning-address":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return ""
    }
  }

  const truncateValue = (value: string, maxLength: number = 50) => {
    if (value.length <= maxLength) return value
    return value.substring(0, maxLength) + "..."
  }

  const renderValue = (value: any, key: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">N/A</span>
    }

    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      )
    }

    if (typeof value === "number") {
      // Special formatting for amounts
      if (key.toLowerCase().includes("amount") || key.toLowerCase().includes("sat")) {
        const btc = (value / 100000000).toFixed(8)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="font-mono">{value.toLocaleString()} sats</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btc} BTC</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      return <span className="font-mono">{value.toLocaleString()}</span>
    }

    if (typeof value === "string") {
      // Special handling for timestamps
      if (key.toLowerCase().includes("timestamp") || key.toLowerCase().includes("time")) {
        const date = new Date(value)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        let relative = ""
        if (diffMins < 60) relative = `${diffMins}m ago`
        else if (diffHours < 24) relative = `${diffHours}h ago`
        else relative = `${diffDays}d ago`

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span>{relative}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{date.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }

      // Truncate long strings with tooltip
      if (value.length > 50) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all font-mono">
                  {truncateValue(value)}
                </code>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <code className="text-xs break-all">{value}</code>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }

      return <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{value}</code>
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="array">
              <AccordionTrigger className="text-sm">
                {value.length} item{value.length !== 1 ? "s" : ""}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
                  {value.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {typeof item === "object" ? (
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      ) : (
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {String(item)}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      }
      return (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="object">
            <AccordionTrigger className="text-sm">
              {Object.keys(value).length} field{Object.keys(value).length !== 1 ? "s" : ""}
            </AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Decoded Invoice</CardTitle>
            <CardDescription>
              Lightning Network payment request details
            </CardDescription>
          </div>
          <Badge variant={getTypeVariant()} className={`${getTypeColor()} text-white`}>
            {getTypeLabel()}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="space-y-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-shrink-0">
                  <div className="text-sm font-medium text-muted-foreground">
                    {formatDetailsKey(key)}
                  </div>
                </div>
                <div className="flex-1 text-right">
                  {renderValue(value, key)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { InvoiceDetails }
