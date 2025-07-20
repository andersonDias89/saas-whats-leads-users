import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  showToggle?: boolean
  onToggleVisibility?: (visible: boolean) => void
  isVisible?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  success?: boolean
  size?: "sm" | "default" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    showToggle = false, 
    onToggleVisibility, 
    isVisible = false,
    leftIcon,
    rightIcon,
    error,
    success,
    size = "default",
    ...props 
  }, ref) => {

    const [internalVisible, setInternalVisible] = React.useState(isVisible)

    const isPassword = type === "password"
    const shouldShowToggle = showToggle || isPassword
    const isVisibleState = onToggleVisibility ? isVisible : internalVisible

    const handleToggleVisibility = () => {
      const newState = !isVisibleState
      if (onToggleVisibility) {
        onToggleVisibility(newState)
      } else {
        setInternalVisible(newState)
      }
    }

    const inputType = isPassword && isVisibleState ? "text" : type

    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      default: "h-10 px-3 py-2 text-sm",
      lg: "h-12 px-4 py-3 text-base"
    }

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          data-slot="input"
          className={cn(
            "flex w-full rounded-lg border border-input bg-input text-input-foreground placeholder:text-muted-foreground transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary hover:border-border-secondary disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
            sizeClasses[size],
            leftIcon && "pl-10",
            (shouldShowToggle || rightIcon) && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-success focus-visible:ring-success",
            className
          )}
          {...props}
        />

        {(shouldShowToggle || rightIcon) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {rightIcon}
            {shouldShowToggle && (
              <button
                type="button"
                onClick={handleToggleVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isVisibleState ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
