import * as React from "react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"
import { Menu, Shield, QrCode, Sun, Moon, Monitor, Check } from "lucide-react"

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export interface HeaderProps {
  appName?: string
  tagline?: string
  subTagline?: string
  githubUrl?: string
  onNavigateToVerifier?: () => void
  onOpenQRScanner?: () => void
  className?: string
}

const Header: React.FC<HeaderProps> = ({
  appName = "Lightning Decoder",
  tagline = "Decode Lightning Network Requests",
  subTagline = "Lightning Address, LNURL, BOLT11, and BOLT12",
  githubUrl = "https://github.com/andrerfneves/lightning-decoder",
  onNavigateToVerifier,
  onOpenQRScanner,
  className,
}) => {
  const { theme, setTheme } = useTheme()

  return (
    <header className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">{appName}</h1>
          <p className="text-md text-[hsl(var(--secondary-foreground))]">{tagline}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{subTagline}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-3 gap-2"
            >
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]"
          >
            <DropdownMenuLabel>Tools</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={onNavigateToVerifier}
              className="gap-2 whitespace-nowrap"
            >
              <Shield className="h-4 w-4" />
              Payment Hash Verifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenQRScanner}
              className="gap-2 whitespace-nowrap"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Code
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="gap-2"
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="gap-2"
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Resources</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2 w-full cursor-pointer"
              >
                <GithubIcon />
                GitHub
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export { Header }
