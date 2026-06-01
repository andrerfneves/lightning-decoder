import * as React from "react"
import { Input } from "./ui/input"
import { Zap } from "lucide-react"
import { cn } from "../lib/utils"

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onDecode?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onDecode, onKeyPress, ...props }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onDecode) {
        onDecode()
      }
      onKeyPress?.(e)
    }

    return (
      <div className={cn("relative flex items-center", className)}>
        <Zap className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          ref={ref}
          className="pl-10 pr-4"
          onKeyPress={handleKeyPress}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
