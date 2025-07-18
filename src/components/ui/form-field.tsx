"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  labelVariant?: "default" | "subtle" | "required"
  labelSize?: "sm" | "default" | "lg"
  error?: string
  helperText?: string
  as?: "input" | "textarea"
  rows?: number
}

const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    type = "text", 
    placeholder, 
    required = false, 
    disabled = false,
    className,
    labelVariant = "default",
    labelSize = "default",
    error,
    helperText,
    as = "input",
    rows = 3,
    ...props 
  }, ref) => {
    const inputId = React.useId()
    
    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={inputId}
          variant={required ? "required" : labelVariant}
          size={labelSize}
          className="block"
        >
          {label}
        </Label>
        
        {as === "input" ? (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive"
            )}
            {...props}
          />
        ) : (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive"
            )}
            {...props}
          />
        )}
        
        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField } 