import * as React from "react"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Textarea } from "./ui/textarea"

export function UIExamples() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-10 p-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Form Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField name="name" error="">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="bio" error="">
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself" />
                </FormControl>
                <FormDescription>Brief description for your profile.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Progress</h2>
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-sm text-muted-foreground">
            Progress: {progress}%
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Aspect Ratio</h2>
        <div className="w-1/2">
          <AspectRatio ratio={16 / 9}>
            <div className="flex items-center justify-center h-full bg-muted rounded-md">
              16:9 Aspect Ratio
            </div>
          </AspectRatio>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Tabs</h2>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <Input />
                </div>
                <div className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <Input />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>Current password</FormLabel>
                  <Input type="password" />
                </div>
                <div className="space-y-1">
                  <FormLabel>New password</FormLabel>
                  <Input type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormLabel>Language</FormLabel>
                  <Input value="English" />
                </div>
                <div className="space-y-1">
                  <FormLabel>Theme</FormLabel>
                  <Input value="Light" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Table</h2>
        <Table>
          <TableCaption>A list of recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV003</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$750.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
