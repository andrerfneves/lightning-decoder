import * as React from "react"
import {
  Card,
  CardContent,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { formatDetailsKey } from "../utils/keys"
import { Check, Copy, ExternalLink, Info } from "lucide-react"

export interface InvoiceDetailsProps {
  type: "bolt11" | "lnurl" | "bolt12" | "lightning-address"
  data: Record<string, any>
  className?: string
}

const INFO_DETAILS: Record<string, { title: string; description: string }> = {
  minSendable: {
    title: "Min Sendable (millisats)",
    description:
      "The minimum amount, in millisats, that this Lightning Address or payment destination supports.",
  },
  maxSendable: {
    title: "Max Sendable (millisats)",
    description:
      "The maximum amount, in millisats, that this Lightning Address or payment destination supports.",
  },
  commentAllowed: {
    title: "Comment Allowed (# of chars)",
    description:
      "If this is zero, comments are not accepted. If it is greater than zero, it is the maximum number of comment characters the destination accepts.",
  },
  tag: {
    title: "LNURL Type",
    description:
      "LNURL supports multiple request types. This value identifies which kind of LNURL response was returned, such as a pay request.",
  },
  disposable: {
    title: "Disposable",
    description:
      "Indicates whether the returned payment destination is intended for one-time use rather than repeated payments.",
  },
  allowsNostr: {
    title: "Allows Nostr",
    description:
      "Indicates whether the service supports Nostr-related payer data or metadata for this payment flow.",
  },
  amount: {
    title: "Amount",
    description:
      "The requested invoice amount shown in both millisats and sats. One sat equals 1,000 millisats.",
  },
  payeeNodeKey: {
    title: "Payee Pub Key",
    description:
      "The public key of the Lightning node that created or receives this invoice. The value links to Amboss for node lookup.",
  },
  "tag.payment_hash": {
    title: "Payment Hash",
    description:
      "The hash of the payment preimage. A payer settles the invoice by revealing the matching preimage through the Lightning payment flow.",
  },
  timeExpireDateString: {
    title: "Expiration Date/Time",
    description:
      "The date and time when this invoice stops being payable.",
  },
  expire_time: {
    title: "Expire Time (Seconds)",
    description:
      "The invoice lifetime in seconds, measured from the creation time.",
  },
  "tag.min_final_cltv_expiry": {
    title: "Minimum Final CLTV Expiry",
    description:
      "The minimum final CLTV delta the receiver requires. It gives the final hop enough block-time margin to settle safely.",
  },
  "tag.unknownTag": {
    title: "Unknown Tag",
    description:
      "The decoder found a BOLT11 tag it does not recognize. The value is preserved so the raw invoice data can still be inspected.",
  },
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  type,
  data,
  className,
}) => {
  const [selectedInfoKey, setSelectedInfoKey] = React.useState<string | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null)
  const [rawCopied, setRawCopied] = React.useState(false)
  const [copiedValueKey, setCopiedValueKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener("change", updateIsMobile)

    return () => mediaQuery.removeEventListener("change", updateIsMobile)
  }, [])

  const selectedInfo = selectedInfoKey ? INFO_DETAILS[selectedInfoKey] : null
  const rawJson = JSON.stringify(data, null, 2)

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
        return "Request"
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

  const humanizeNestedKey = (key: string) => key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1))

  const getDisplayKey = (key: string) => {
    if (key.startsWith("payerData.")) {
      return `Payer Data ${humanizeNestedKey(key.replace("payerData.", ""))}`
    }

    if (key === "amount") {
      return "Amount"
    }

    if (key === "timeExpireDate" || key === "timeExpireDateString") {
      return "Expiration Date/Time"
    }

    if (key === "timestamp" || key === "timestampString") {
      return "Creation Date/Time"
    }

    if (key.startsWith("tag.")) {
      const tagKey = key.replace("tag.", "")

      if (tagKey.startsWith("unknownTag.")) {
        return `Unknown Tag ${tagKey.replace("unknownTag.", "")}`
      }

      return formatDetailsKey(tagKey)
    }

    return formatDetailsKey(key)
  }

  const rawDetailRows = Object.entries(data).flatMap(([key, value]) => {
    if (key === "millisatoshis") {
      return [[
        "amount",
        {
          millisatoshis: value,
          satoshis: data.satoshis,
        },
      ] as [string, any]]
    }

    if (key === "satoshis" && "millisatoshis" in data) {
      return []
    }

    if (key === "satoshis") {
      return [[
        "amount",
        {
          millisatoshis: data.millisatoshis,
          satoshis: value,
        },
      ] as [string, any]]
    }

    if (key === "timeExpireDate" && "timeExpireDateString" in data) {
      return []
    }

    if (key === "timestamp" && "timestampString" in data) {
      return []
    }

    if (key === "payerData" && value && typeof value === "object" && !Array.isArray(value)) {
      return Object.entries(value).map(([payerKey, payerValue]) => [
        `payerData.${payerKey}`,
        payerValue,
      ] as [string, any])
    }

    if (key === "tags" && Array.isArray(value)) {
      return value.flatMap((tag, index) => {
        if (!tag || typeof tag !== "object" || !("tagName" in tag)) {
          return []
        }

        const tagName = String(tag.tagName)

        if (tagName === "unknownTag" && tag.data && typeof tag.data === "object") {
          const tagCode = "tagCode" in tag.data ? String(tag.data.tagCode) : String(index + 1)
          const words = "words" in tag.data ? tag.data.words : tag.data
          return [[`tag.unknownTag.${tagCode}`, words] as [string, any]]
        }

        return [[`tag.${tagName}`, tag.data] as [string, any]]
      })
    }

    return [[key, value] as [string, any]]
  })

  const getRowSortWeight = (key: string) => {
    if (key.startsWith("tag.unknownTag.")) {
      return 2
    }

    if (key === "wordsTemp") {
      return 3
    }

    return 1
  }

  const detailRows = rawDetailRows
    .map((row, index) => ({ index, row }))
    .sort((a, b) => {
      const weightDifference = getRowSortWeight(a.row[0]) - getRowSortWeight(b.row[0])
      return weightDifference || a.index - b.index
    })
    .map(({ row }) => row)

  const renderKeyLabel = (key: string) => {
    const label = getDisplayKey(key)
    const match = label.match(/^(.*) \((.*)\)$/)

    if (!match) {
      return <span>{label}</span>
    }

    return (
      <span>
        <span>{match[1]}</span>
        <span className="hidden sm:inline"> ({match[2]})</span>
        <span className="block sm:hidden">({match[2]})</span>
      </span>
    )
  }

  const isExternalUrl = (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch (_) {
      return false
    }
  }

  const renderTypeBadge = () => (
    <Badge variant={getTypeVariant()} className={`${getTypeColor()} text-white whitespace-nowrap`}>
      {getTypeLabel()}
    </Badge>
  )

  const renderTagBadge = (value: string) => (
    <Badge variant="default" className="whitespace-nowrap bg-purple-500 text-white hover:bg-purple-600">
      {value}
    </Badge>
  )

  const renderCoinTypeBadge = (value: string) => (
    <Badge variant="default" className="whitespace-nowrap bg-orange-500 text-white hover:bg-orange-600">
      {value.toLowerCase() === "bitcoin" ? "Bitcoin" : value}
    </Badge>
  )

  const renderUrlValue = (value: string, displayValue = value): React.ReactNode => {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="group ml-auto inline-flex max-w-full items-start justify-end gap-1 rounded bg-muted px-2 py-1 text-right font-mono text-xs text-foreground underline-offset-4 sm:max-w-md"
      >
        <span className="break-all text-right group-hover:underline">{displayValue}</span>
        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
      </a>
    )
  }

  const handleCopyValue = async (copyKey: string, value: string) => {
    if (!navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(value)
    setCopiedValueKey(copyKey)
    window.setTimeout(() => setCopiedValueKey(null), 2000)
  }

  const renderCopyableStringValue = (value: string, key: string): React.ReactNode => {
    const copied = copiedValueKey === key

    return (
      <button
        type="button"
        className="group ml-auto inline-flex max-w-full items-start justify-end gap-1 rounded bg-muted px-2 py-1 text-right font-mono text-xs text-foreground underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:max-w-md"
        onClick={() => handleCopyValue(key, value)}
        aria-label={`Copy ${getDisplayKey(key)}`}
      >
        <span className="break-all text-right group-hover:underline">{value}</span>
        {copied ? (
          <Check className="mt-0.5 h-3 w-3 shrink-0" />
        ) : (
          <Copy className="mt-0.5 h-3 w-3 shrink-0" />
        )}
      </button>
    )
  }

  const renderPayerDataFieldValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">N/A</span>
    }

    if (typeof value === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
    }

    if (typeof value === "string") {
      if (isExternalUrl(value)) {
        return renderUrlValue(value)
      }

      return <code className="rounded bg-muted px-2 py-1 font-mono text-xs break-all">{value}</code>
    }

    if (typeof value === "number") {
      return <span className="font-mono">{value.toLocaleString()}</span>
    }

    if (typeof value === "object" && typeof value.mandatory === "boolean") {
      return (
        <Badge variant={value.mandatory ? "default" : "secondary"}>
          {value.mandatory ? "Required" : "Optional"}
        </Badge>
      )
    }

    if (typeof value === "object") {
      return (
        <div className="space-y-1">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <div key={nestedKey} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{humanizeNestedKey(nestedKey)}</span>
              <span className="text-right">{renderPayerDataFieldValue(nestedValue)}</span>
            </div>
          ))}
        </div>
      )
    }

    return <span>{String(value)}</span>
  }

  const renderMetadataValue = (value: string): React.ReactNode => {
    try {
      const metadata = JSON.parse(value)

      if (!Array.isArray(metadata)) {
        throw new Error("Invalid metadata shape")
      }

      return (
        <div className="ml-auto max-w-xl space-y-3 text-right">
          {metadata.map((entry, index) => {
            if (!Array.isArray(entry) || entry.length < 2) {
              return null
            }

            const [mimeType, content] = entry

            if (typeof mimeType !== "string" || typeof content !== "string") {
              return null
            }

            const isImage = mimeType.startsWith("image/")
            const imageSrc = isImage ? `data:${mimeType};base64,${content}` : null

            return (
              <div key={`${mimeType}-${index}`} className="space-y-1">
                {imageSrc && (
                  <button
                    type="button"
                    className="ml-auto block rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => setLightboxImage(imageSrc)}
                  >
                    <img
                      src={imageSrc}
                      alt="LNURL metadata"
                      className="max-h-24 max-w-24 rounded-md object-cover"
                    />
                  </button>
                )}
                <div>
                  <Badge variant="secondary" className="whitespace-nowrap bg-muted text-muted-foreground hover:bg-muted">
                    {mimeType}
                  </Badge>
                </div>
                {!isImage && <div className="text-sm break-words">{content}</div>}
              </div>
            )
          })}
        </div>
      )
    } catch (_) {
      return renderStringValue(value)
    }
  }

  const renderStringValue = (value: string, key = "value"): React.ReactNode => {
    if (value.length > 50) {
      return renderCopyableStringValue(value, key)
    }

    return <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{value}</code>
  }

  const renderDateTimeValue = (value: string | number): React.ReactNode => {
    const date = typeof value === "number"
      ? new Date(value * 1000)
      : new Date(value)

    if (Number.isNaN(date.getTime())) {
      return renderStringValue(String(value))
    }

    return <span>{date.toLocaleString()}</span>
  }

  const renderValue = (value: any, key: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">N/A</span>
    }

    if (key === "amount" && typeof value === "object") {
      return (
        <div className="ml-auto space-y-1 text-right font-mono">
          {value.millisatoshis !== undefined && value.millisatoshis !== null && (
            <div>{Number(value.millisatoshis).toLocaleString()} millisats</div>
          )}
          {value.satoshis !== undefined && value.satoshis !== null && (
            <div>{Number(value.satoshis).toLocaleString()} sats</div>
          )}
        </div>
      )
    }

    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      )
    }

    if (typeof value === "number") {
      if (key === "timeExpireDate" || key === "timestamp") {
        return renderDateTimeValue(value)
      }

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
      if (key === "coinType" && value.toLowerCase() === "bitcoin") {
        return renderCoinTypeBadge(value)
      }

      if (key === "timeExpireDateString" || key === "timestampString") {
        return renderDateTimeValue(value)
      }

      if (key === "payeeNodeKey") {
        return renderUrlValue(`https://amboss.space/${value}`, value)
      }

      if (key === "paymentRequest") {
        return renderCopyableStringValue(value, key)
      }

      if (key === "tag") {
        return renderTagBadge(value)
      }

      if (isExternalUrl(value)) {
        return renderUrlValue(value)
      }

      if (key === "domain") {
        return renderUrlValue(`https://${value}`, value)
      }

      if (key === "metadata") {
        return renderMetadataValue(value)
      }

      return value.length > 50
        ? renderCopyableStringValue(value, key)
        : renderStringValue(value, key)
    }

    if (typeof value === "object") {
      if (key.startsWith("payerData.")) {
        return renderPayerDataFieldValue(value)
      }

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

  const renderInfoButton = (key: string) => {
    const infoKey = key.startsWith("tag.unknownTag.") ? "tag.unknownTag" : key

    if (!INFO_DETAILS[infoKey]) {
      return null
    }

    return (
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setSelectedInfoKey(infoKey)}
        aria-label={`More information about ${getDisplayKey(key)}`}
      >
        <Info className="h-3.5 w-3.5" />
      </button>
    )
  }

  const shouldTopAlignRow = (key: string, value: any) => {
    if (key === "metadata") {
      return true
    }

    if (Array.isArray(value) || (value && typeof value === "object")) {
      return true
    }

    return typeof value === "string" && (
      isExternalUrl(value)
      || key === "domain"
      || key === "payeeNodeKey"
      || value.length > 50
    )
  }

  const handleCopyRawDetails = async () => {
    if (!navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(rawJson)
    setRawCopied(true)
    window.setTimeout(() => setRawCopied(false), 2000)
  }

  const renderLightbox = () => (
    <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
      <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none sm:max-w-2xl">
        {lightboxImage && (
          <img
            src={lightboxImage}
            alt="LNURL metadata"
            className="max-h-[85vh] w-full rounded-lg object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  )

  const renderInfoContent = () => {
    if (!selectedInfo) {
      return null
    }

    if (isMobile) {
      return (
        <Sheet open={!!selectedInfo} onOpenChange={(open) => !open && setSelectedInfoKey(null)}>
          <SheetContent
            side="bottom"
            className="rounded-t-lg bg-[hsl(var(--popover))] pb-8 text-[hsl(var(--popover-foreground))]"
          >
            <SheetHeader>
              <SheetTitle>{selectedInfo.title}</SheetTitle>
              <SheetDescription>{selectedInfo.description}</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Dialog open={!!selectedInfo} onOpenChange={(open) => !open && setSelectedInfoKey(null)}>
        <DialogContent className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedInfo.title}</DialogTitle>
            <DialogDescription>{selectedInfo.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-6">
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-border py-3 first:pt-0">
              <div className="flex-shrink-0">
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Type
                </div>
              </div>
              <div className="flex-1 text-right">
                {renderTypeBadge()}
              </div>
            </div>
            {detailRows.map(([key, value]) => {
              const rowAlignmentClass = shouldTopAlignRow(key, value)
                ? "items-start"
                : "items-start sm:items-center"

              return (
                <div key={key} className="border-b border-border py-3 last:border-b-0 last:pb-0">
                  <div className={`flex ${rowAlignmentClass} justify-between gap-4`}>
                    <div className="flex-shrink-0">
                      <div className="flex items-start gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        <div>{renderKeyLabel(key)}</div>
                        <div className="mt-[-3px] shrink-0">{renderInfoButton(key)}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      {renderValue(value, key)}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="raw-details" className="border-b-0">
                  <AccordionTrigger className="w-full border border-border bg-white px-3 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:no-underline dark:bg-black">
                    View Raw Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-3 rounded-md border border-border bg-muted/60">
                      <div className="flex items-center justify-end border-b border-border p-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={handleCopyRawDetails}
                        >
                          {rawCopied ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {rawCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="max-h-96 overflow-auto p-3 text-left text-xs leading-relaxed">
                        <code>{rawJson}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
      {renderInfoContent()}
      {renderLightbox()}
    </>
  )
}

export { InvoiceDetails }
