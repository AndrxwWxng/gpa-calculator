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
        className="h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/40 hover:bg-muted/50 transition-all duration-200 shadow-lg"
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/40 hover:border-turquoise/60 hover:bg-turquoise/10 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-110 ring-2 ring-transparent hover:ring-turquoise/20"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-turquoise group-hover:text-turquoise-dark drop-shadow-sm" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-turquoise group-hover:text-turquoise-dark drop-shadow-sm" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
