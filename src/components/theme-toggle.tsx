"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg bg-background border border-border/30 hover:bg-muted/50 transition-all duration-200"
      >
        <div className="h-3 w-3" />
      </Button>
    )
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-8 w-8 rounded-lg bg-background border border-border/30 hover:bg-muted/50 transition-all duration-200 group"
    >
      <Sun className="h-3 w-3 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0 text-turquoise group-hover:text-turquoise-dark" />
      <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-turquoise group-hover:text-turquoise-dark" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
