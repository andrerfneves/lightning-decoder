import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { cn } from "../lib/utils"

export interface ErrorDisplayProps {
  message: string
  title?: string
  tone?: "error" | "warning"
  className?: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title,
  tone = "error",
  className,
}) => {
  const isWarning = tone === "warning"

  return (
    <Alert
      variant="default"
      className={cn(
        isWarning
          ? "border-amber-500/40 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/25 dark:text-amber-100 [&>svg]:text-amber-500"
          : "border-red-500/40 bg-red-50 text-red-950 dark:border-red-500/40 dark:bg-red-950/25 dark:text-red-100 [&>svg]:text-red-500",
        className
      )}
    >
      {isWarning ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>{title ?? (isWarning ? "Warning" : "Error")}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export { ErrorDisplay }
