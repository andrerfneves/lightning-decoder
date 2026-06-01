import * as React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ArrowRight, Loader2, X } from "lucide-react"
import { cn } from "../lib/utils"

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onDecode?: () => void
  onSubmit?: () => void
  isLoading?: boolean
  hasResult?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onDecode, onSubmit, isLoading, hasResult, onKeyPress, ...props }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (onSubmit) {
          onSubmit()
        } else if (onDecode) {
          onDecode()
        }
      }
      onKeyPress?.(e)
    }

    const handleClick = () => {
      if (isLoading) {
        return
      }

      if (onSubmit) {
        onSubmit()
      } else if (onDecode) {
        onDecode()
      }
    }

    return (
      <div className={cn("relative flex items-center", className)}>
        <Input
          ref={ref}
          className="pr-14"
          onKeyPress={handleKeyPress}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-2 h-8 w-8"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasResult ? (
            <X className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
