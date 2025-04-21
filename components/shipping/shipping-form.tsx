"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createShippingRecord } from "@/app/actions/shipping"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ShippingQRModal } from "./shipping-qr-modal"

// Define the form schema
const formSchema = z.object({
  tracking_number: z.string().min(1, "Tracking number is required"),
  carrier: z.string().min(1, "Carrier is required"),
  service_level: z.string().min(1, "Service level is required"),
  origin_address: z.object({
    name: z.string().min(1, "Name is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  destination_address: z.object({
    name: z.string().min(1, "Name is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  shipping_date: z.string().optional(),
  estimated_delivery: z.string().optional(),
  package_ids: z.array(z.string()).optional(),
  weight: z.coerce.number().min(0).optional(),
  dimensions: z
    .object({
      length: z.coerce.number().min(0),
      width: z.coerce.number().min(0),
      height: z.coerce.number().min(0),
      unit: z.string().default("cm"),
    })
    .optional(),
  shipping_cost: z.coerce.number().min(0).optional(),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ShippingFormProps {
  availablePackages: any[]
  onSubmit?: (values: FormValues) => void
  isLoading?: boolean
}

export function ShippingForm({ availablePackages, onSubmit, isLoading = false }: ShippingFormProps) {
  const router = useRouter()
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [newShipment, setNewShipment] = useState<{
    trackingNumber: string
    publicId: string
  } | null>(null)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tracking_number: "",
      carrier: "",
      service_level: "",
      origin_address: {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      destination_address: {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      shipping_date: "",
      estimated_delivery: "",
      package_ids: [],
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
      shipping_cost: 0,
      currency: "USD",
      notes: "",
    },
  })

  const handlePackageSelection = (packageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages([...selectedPackages, packageId])
    } else {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId))
    }
  }

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      // Add selected packages to the form values
      values.package_ids = selectedPackages

      if (onSubmit) {
        onSubmit(values)
      } else {
        // Use the server action to create the shipping record
        const result = await createShippingRecord({
          ...values,
          status: "pending", // Default status for new shipments
        })

        if (result.success) {
          toast({
            title: "Shipping record created",
            description: "The shipping record has been created successfully",
          })

          // Open QR code modal for the new shipment
          setNewShipment({
            trackingNumber: values.tracking_number,
            publicId: result.data.public_id,
          })
          setQrModalOpen(true)

          // Reset the form
          form.reset()
          setSelectedPackages([])
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create shipping record",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Shipment</CardTitle>
          <CardDescription>Enter the details for a new shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipment Information</h3>

                  <FormField
                    control={form.control}
                    name="tracking_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tracking number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="carrier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carrier</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select carrier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fedex">FedEx</SelectItem>
                              <SelectItem value="ups">UPS</SelectItem>
                              <SelectItem value="usps">USPS</SelectItem>
                              <SelectItem value="dhl">DHL</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="overnight">Overnight</SelectItem>
                              <SelectItem value="two_day">Two-Day</SelectItem>
                              <SelectItem value="ground">Ground</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shipping_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimated_delivery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Delivery</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Cost</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Add any special instructions or notes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Addresses</h3>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Origin Address</h4>

                    <FormField
                      control={form.control}
                      name="origin_address.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origin_address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin_address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="origin_address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin_address.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="origin_address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium text-sm">Destination Address</h4>

                    <FormField
                      control={form.control}
                      name="destination_address.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destination_address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="destination_address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destination_address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="destination_address.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destination_address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Packages */}
              {availablePackages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Packages</h3>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availablePackages
                        .filter((pkg) => pkg.status === "available")
                        .map((pkg) => (
                          <div key={pkg.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={`package-${pkg.id}`}
                              checked={selectedPackages.includes(pkg.id)}
                              onCheckedChange={(checked) => handlePackageSelection(pkg.id, checked === true)}
                            />
                            <div className="grid gap-1.5">
                              <label
                                htmlFor={`package-${pkg.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {pkg.name}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {pkg.type} - {pkg.dimensions.length}x{pkg.dimensions.width}x{pkg.dimensions.height}{" "}
                                {pkg.dimensions.unit}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <CardFooter className="px-0 pt-4">
                <Button type="submit" disabled={submitting || isLoading} className="w-full md:w-auto">
                  {submitting || isLoading ? "Creating..." : "Create Shipment"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {newShipment && (
        <ShippingQRModal
          trackingNumber={newShipment.trackingNumber}
          publicId={newShipment.publicId}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </>
  )
}
