"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { packagingMaterials, standardPackagingDimensions } from "@/lib/schemas/packaging"
import { ColorPickerModal } from "@/components/color-picker-modal"
import { FileUpload } from "./file-upload"
import { PackagingPreview } from "./packaging-preview"

interface PackagingDesignerProps {
  userId: string
  profileData: any
  onSubmit: (designData: any) => void
}

export function PackagingDesigner({ userId, profileData, onSubmit }: PackagingDesignerProps) {
  const [activeTab, setActiveTab] = useState("type")
  const [orderType, setOrderType] = useState<"standard" | "custom">("standard")
  const [materialType, setMaterialType] = useState("pp_woven")
  const [quantity, setQuantity] = useState(100)
  const [hasIotSensors, setHasIotSensors] = useState(false)
  const [iotSensorCount, setIotSensorCount] = useState(0)
  const [dimensions, setDimensions] = useState(standardPackagingDimensions.mailer)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [designData, setDesignData] = useState({
    brandColor: profileData?.company_logo_url ? "#0070f3" : "#000000",
    secondaryColor: "#ffffff",
    logo: profileData?.company_logo_url || "",
    logoPosition: "center",
    textColor: "#000000",
    font: "Inter",
    additionalText: profileData?.company || "",
    useCompanyLogo: !!profileData?.company_logo_url,
  })
  const [designFiles, setDesignFiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate price whenever relevant fields change
  useEffect(() => {
    let basePrice = 0
    if (orderType === "standard") {
      basePrice = 25.99 * quantity
    } else {
      basePrice = 39.99 * quantity
    }

    // Add material price multiplier
    let materialMultiplier = 1.0
    switch (materialType) {
      case "pp_woven":
        materialMultiplier = 1.0
        break
      case "pp_nonwoven":
        materialMultiplier = 1.2
        break
      case "laminated_rubber":
        materialMultiplier = 1.5
        break
      default:
        materialMultiplier = 1.0
    }

    // Add IoT sensor costs
    const iotSensorCost = hasIotSensors ? iotSensorCount * 12.99 : 0

    // Calculate total price
    const calculatedPrice = basePrice * materialMultiplier + iotSensorCost
    setTotalPrice(calculatedPrice)
  }, [orderType, materialType, quantity, hasIotSensors, iotSensorCount])

  const handleLogoUpload = (url: string) => {
    setDesignData((prev) => ({ ...prev, logo: url }))
  }

  const handleFileUpload = (files: any[]) => {
    setDesignFiles([...designFiles, ...files])
  }

  const handleColorChange = (color: string, type: "brandColor" | "secondaryColor" | "textColor") => {
    setDesignData((prev) => ({ ...prev, [type]: color }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    try {
      // Prepare the order data
      const orderData = {
        order_type: orderType,
        material_type: materialType,
        dimensions: orderType === "custom" ? dimensions : standardPackagingDimensions.mailer,
        quantity,
        has_iot_sensors: hasIotSensors,
        iot_sensor_count: iotSensorCount,
        special_instructions: specialInstructions,
        design_data: designData,
        design_files: designFiles.map((file) => ({
          fileUrl: file.url,
          fileName: file.name,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        })),
      }

      // Submit the order
      onSubmit(orderData)
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error",
        description: "Failed to submit your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (activeTab === "type") setActiveTab("material")
    else if (activeTab === "material") setActiveTab("design")
    else if (activeTab === "design") setActiveTab("review")
  }

  const handleBack = () => {
    if (activeTab === "material") setActiveTab("type")
    else if (activeTab === "design") setActiveTab("material")
    else if (activeTab === "review") setActiveTab("design")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Design Your Branded Packaging</CardTitle>
          <CardDescription>Create sustainable, reusable packaging with your brand identity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="type">Package Type</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="review">Review & Order</TabsTrigger>
            </TabsList>

            {/* Package Type Tab */}
            <TabsContent value="type" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Package Type</h3>
                <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as "standard" | "custom")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div>
                        <Label htmlFor="standard" className="text-base font-medium">
                          Standard Mailer
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {standardPackagingDimensions.mailer.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {standardPackagingDimensions.maxSize.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="custom" id="custom" className="mt-1" />
                      <div>
                        <Label htmlFor="custom" className="text-base font-medium">
                          Custom Size
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Design your own custom-sized packaging to fit your specific needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {orderType === "custom" && (
                  <div className="space-y-4 mt-6 p-4 border rounded-md">
                    <h4 className="font-medium">Custom Dimensions</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (inches)</Label>
                        <Input
                          id="width"
                          type="number"
                          min="1"
                          step="0.125"
                          value={dimensions.width}
                          onChange={(e) => setDimensions({ ...dimensions, width: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (inches)</Label>
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          step="0.125"
                          value={dimensions.height}
                          onChange={(e) => setDimensions({ ...dimensions, height: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depth">Depth (inches)</Label>
                        <Input
                          id="depth"
                          type="number"
                          min="0.125"
                          step="0.125"
                          value={dimensions.depth}
                          onChange={(e) => setDimensions({ ...dimensions, depth: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-6">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="quantity"
                      type="number"
                      min="50"
                      step="50"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">Minimum order: 50 units</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Material Tab */}
            <TabsContent value="material" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Material</h3>
                <RadioGroup value={materialType} onValueChange={setMaterialType}>
                  <div className="grid grid-cols-1 gap-4">
                    {packagingMaterials.map((material) => (
                      <div key={material.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={material.id} id={material.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={material.id} className="text-base font-medium">
                            {material.name}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">IoT Smart Sensors (Optional)</h4>
                      <p className="text-sm text-muted-foreground">
                        Track location, temperature, humidity, and shock in real-time
                      </p>
                    </div>
                    <Switch checked={hasIotSensors} onCheckedChange={setHasIotSensors} />
                  </div>

                  {hasIotSensors && (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="sensorCount">Number of Sensors</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="sensorCount"
                          type="number"
                          min="1"
                          max="10"
                          value={iotSensorCount}
                          onChange={(e) => setIotSensorCount(Number.parseInt(e.target.value))}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">$12.99 per sensor</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Brand Design</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useCompanyLogo">Use Company Logo</Label>
                      <Switch
                        id="useCompanyLogo"
                        checked={designData.useCompanyLogo}
                        onCheckedChange={(checked) => setDesignData({ ...designData, useCompanyLogo: checked })}
                      />
                    </div>

                    {designData.useCompanyLogo && (
                      <div className="space-y-2">
                        <Label>Company Logo</Label>
                        <ImageUpload
                          value={designData.logo}
                          onChange={handleLogoUpload}
                          bucket="company-logos"
                          userId={userId}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="logoPosition">Logo Position</Label>
                      <RadioGroup
                        value={designData.logoPosition}
                        onValueChange={(value) => setDesignData({ ...designData, logoPosition: value })}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="left" id="logo-left" />
                          <Label htmlFor="logo-left">Left</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="center" id="logo-center" />
                          <Label htmlFor="logo-center">Center</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="right" id="logo-right" />
                          <Label htmlFor="logo-right">Right</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Brand Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: designData.brandColor }}
                        />
                        <ColorPickerModal
                          color={designData.brandColor}
                          onChange={(color) => handleColorChange(color, "brandColor")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: designData.secondaryColor }}
                        />
                        <ColorPickerModal
                          color={designData.secondaryColor}
                          onChange={(color) => handleColorChange(color, "secondaryColor")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: designData.textColor }}
                        />
                        <ColorPickerModal
                          color={designData.textColor}
                          onChange={(color) => handleColorChange(color, "textColor")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalText">Additional Text</Label>
                      <Input
                        id="additionalText"
                        value={designData.additionalText}
                        onChange={(e) => setDesignData({ ...designData, additionalText: e.target.value })}
                        placeholder="Company name or slogan"
                      />
                    </div>
                  </div>

                  {orderType === "custom" && (
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Custom Design Files</h3>
                      <FileUpload onUpload={handleFileUpload} />

                      {designFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
                          <ul className="space-y-1">
                            {designFiles.map((file, index) => (
                              <li key={index} className="text-sm">
                                {file.name}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-6 w-6 p-0"
                                  onClick={() => setDesignFiles(designFiles.filter((_, i) => i !== index))}
                                >
                                  ×
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special requirements or instructions for your packaging"
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <PackagingPreview
                    orderType={orderType}
                    materialType={materialType}
                    dimensions={dimensions}
                    designData={designData}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Package Type:</div>
                      <div className="text-sm">{orderType === "standard" ? "Standard Mailer" : "Custom Size"}</div>

                      <div className="text-sm font-medium">Material:</div>
                      <div className="text-sm">
                        {packagingMaterials.find((m) => m.id === materialType)?.name || materialType}
                      </div>

                      <div className="text-sm font-medium">Quantity:</div>
                      <div className="text-sm">{quantity} units</div>

                      {orderType === "custom" && (
                        <>
                          <div className="text-sm font-medium">Dimensions:</div>
                          <div className="text-sm">
                            {dimensions.width}" × {dimensions.height}" × {dimensions.depth}"
                          </div>
                        </>
                      )}

                      <div className="text-sm font-medium">IoT Sensors:</div>
                      <div className="text-sm">{hasIotSensors ? `Yes (${iotSensorCount} sensors)` : "No"}</div>

                      {designFiles.length > 0 && (
                        <>
                          <div className="text-sm font-medium">Design Files:</div>
                          <div className="text-sm">{designFiles.length} files uploaded</div>
                        </>
                      )}

                      <div className="text-sm font-medium">Total Price:</div>
                      <div className="text-sm font-bold">${totalPrice.toFixed(2)}</div>
                    </div>

                    {specialInstructions && (
                      <div className="mt-4">
                        <div className="text-sm font-medium">Special Instructions:</div>
                        <div className="text-sm mt-1 p-2 bg-muted rounded-md">{specialInstructions}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Design Preview</h3>
                  <PackagingPreview
                    orderType={orderType}
                    materialType={materialType}
                    dimensions={dimensions}
                    designData={designData}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={activeTab === "type"}>
            Back
          </Button>

          {activeTab === "review" ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Submitting..." : "Place Order"}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
