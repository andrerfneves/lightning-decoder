import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Badge } from "./ui/badge"
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
        return "BOLT11 Invoice"
      case "lnurl":
        return "LNURL"
      case "bolt12":
        return "BOLT12 Offer"
      case "lightning-address":
        return "Lightning Address"
      default:
        return "Lightning Invoice"
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

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">N/A</span>
    }

    if (typeof value === "boolean") {
      return <span>{value ? "Yes" : "No"}</span>
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <div className="space-y-1">
            {value.map((item, idx) => (
              <div key={idx} className="text-sm">
                {typeof item === "object" ? (
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                ) : (
                  String(item)
                )}
              </div>
            ))}
          </div>
        )
      }
      return (
        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      )
    }

    if (typeof value === "string" && value.length > 100) {
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded break-all">
          {value}
        </code>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Decoded Invoice</CardTitle>
          <Badge variant={getTypeVariant()}>{getTypeLabel()}</Badge>
        </div>
        <CardDescription>
          Lightning Network payment request details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDetailsKey(key)}
              </div>
              <div className="text-sm">{renderValue(value)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { InvoiceDetails }
