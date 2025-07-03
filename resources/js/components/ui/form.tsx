import * as React from "react"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface FormFieldContextValue<TFieldValues> {
  name: string
  id: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error?: string
}

const FormFieldContext = React.createContext<FormFieldContextValue<any> | undefined>(undefined)

function FormField<TFieldValues>({
  name,
  id,
  error,
  children,
}: {
  name: string
  id?: string
  error?: string
  children: React.ReactNode
}) {
  const fieldId = id || name
  const formItemId = `${fieldId}-form-item`
  const formDescriptionId = `${fieldId}-form-item-description`
  const formMessageId = `${fieldId}-form-item-message`

  const value = React.useMemo(
    () => ({
      name,
      id: fieldId,
      formItemId,
      formDescriptionId,
      formMessageId,
      error,
    }),
    [name, fieldId, formItemId, formDescriptionId, formMessageId, error]
  )

  return (
    <FormFieldContext.Provider value={value}>
      {children}
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField must be used within a FormField")
  }
  return context
}

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { formItemId } = useFormField()

  return (
    <div
      id={formItemId}
      data-slot="form-item"
      className={cn("space-y-2", className)}
      {...props}
    />
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { id } = useFormField()

  return (
    <Label
      htmlFor={id}
      data-slot="form-label"
      className={cn(className)}
      {...props}
    />
  )
}

function FormControl<TElement extends HTMLElement = HTMLInputElement>({
  className,
  ...props
}: React.HTMLAttributes<TElement>) {
  const { id, formDescriptionId, formMessageId, error } = useFormField()

  return (
    <div
      data-slot="form-control"
      className={cn("mt-1", className)}
      aria-describedby={
        !error
          ? formDescriptionId
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formMessageId, error } = useFormField()
  const body = error || children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
