import * as React from "react"
import { Button } from "./ui/button"
import { ArrowRight, X } from "lucide-react"
import { cn } from "../lib/utils"

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  hasResult?: boolean
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, isLoading, hasResult, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn("h-12 w-12", className)}
        disabled={isLoading}
        {...props}
      >
        {hasResult ? (
          <X className="h-5 w-5" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </Button>
    )
  }
)
SubmitButton.displayName = "SubmitButton"

export { SubmitButton }
