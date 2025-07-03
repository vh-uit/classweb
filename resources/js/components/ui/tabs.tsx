import * as React from "react"

import { cn } from "@/lib/utils"

interface TabsContextValue {
  selectedTab: string
  setSelectedTab: (id: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within a Tabs component")
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  onValueChange?: (value: string) => void
}

function Tabs({
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue)

  const handleTabChange = React.useCallback(
    (value: string) => {
      setSelectedTab(value)
      onValueChange?.(value)
    },
    [onValueChange]
  )

  const value = React.useMemo(
    () => ({
      selectedTab,
      setSelectedTab: handleTabChange,
    }),
    [selectedTab, handleTabChange]
  )

  return (
    <TabsContext.Provider value={value}>
      <div
        data-slot="tabs"
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const { selectedTab, setSelectedTab } = useTabs()
  const isSelected = selectedTab === value

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      data-state={isSelected ? "active" : "inactive"}
      role="tab"
      aria-selected={isSelected}
      onClick={() => setSelectedTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-background text-foreground shadow"
          : "hover:bg-background/50 hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ className, value, ...props }: TabsContentProps) {
  const { selectedTab } = useTabs()
  const isSelected = selectedTab === value

  if (!isSelected) return null

  return (
    <div
      data-slot="tabs-content"
      data-state={isSelected ? "active" : "inactive"}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
