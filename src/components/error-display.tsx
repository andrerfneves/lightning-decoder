import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "../lib/utils"

export interface ErrorDisplayProps {
  message: string
  title?: string
  className?: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title = "Error",
  className,
}) => {
  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export { ErrorDisplay }
