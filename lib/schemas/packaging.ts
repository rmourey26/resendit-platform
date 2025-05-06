import { z } from "zod"

// Define the schema for packaging dimensions
const dimensionsSchema = z.object({
  width: z.coerce.number().min(0, { message: "Width must be positive" }),
  height: z.coerce.number().min(0, { message: "Height must be positive" }),
  depth: z.coerce.number().min(0, { message: "Depth must be positive" }),
  unit: z.string().default("inches"),
})

// Define the schema for design data
const designDataSchema = z.object({
  brandColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  logo: z.string().optional(),
  logoPosition: z.string().optional(),
  textColor: z.string().optional(),
  font: z.string().optional(),
  additionalText: z.string().optional(),
  useCompanyLogo: z.boolean().default(true),
})

// Define the schema for design files
const designFileSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileType: z.string(),
  uploadedAt: z.string().optional(),
})

// Define the schema for packaging orders
export const packagingOrderSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  profile_id: z.string().uuid().optional(),
  order_type: z.enum(["standard", "custom"]),
  material_type: z.enum(["pp_woven", "pp_nonwoven", "laminated_rubber", "other"]),
  dimensions: dimensionsSchema.optional(),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1" }),
  has_iot_sensors: z.boolean().default(false),
  iot_sensor_count: z.coerce.number().int().min(0).default(0),
  special_instructions: z.string().optional(),
  design_data: designDataSchema.optional(),
  design_files: z.array(designFileSchema).optional(),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  total_price: z.coerce.number().min(0).optional(),
})

export type PackagingOrder = z.infer<typeof packagingOrderSchema>

// Define the schema for packaging order items
export const packagingOrderItemSchema = z.object({
  id: z.string().uuid().optional(),
  order_id: z.string().uuid(),
  package_type: z.string(),
  material_type: z.enum(["pp_woven", "pp_nonwoven", "laminated_rubber", "other"]),
  dimensions: dimensionsSchema.optional(),
  quantity: z.coerce.number().int().min(1),
  unit_price: z.coerce.number().min(0).optional(),
  has_iot_sensors: z.boolean().default(false),
  iot_sensor_count: z.coerce.number().int().min(0).default(0),
})

export type PackagingOrderItem = z.infer<typeof packagingOrderItemSchema>

// Define the schema for standard packaging dimensions
export const standardPackagingDimensions = {
  mailer: {
    width: 10.25,
    height: 5,
    depth: 0.25,
    unit: "inches",
    description:
      'Collapsed Dimensions: mailers measure 5" tall x 10.25" wide x less than 0.25" in depth, making them compliant with USPS BRM/QBRM requirements.',
  },
  maxSize: {
    width: 11.5,
    height: 6.125,
    depth: 0.25,
    unit: "inches",
    description:
      'USPS Maximum Size: To qualify for BRM/QBRM, the mailer can be up to 6.125" tall x 11.5" wide x 0.25" in depth.',
  },
}

// Define material information
export const packagingMaterials = [
  {
    id: "pp_woven",
    name: "PP Woven Fabric",
    description: "Tear-resistant and lightweight • 200+ handling cycles • 30% less mass than cardboard",
    priceMultiplier: 1.0,
    imageUrl: "/images/materials/pp-woven.jpg",
  },
  {
    id: "pp_nonwoven",
    name: "PP NonWoven Fabric",
    description: "Reduces damage claims by 43% • Fully recyclable composite • 18-month minimum lifecycle",
    priceMultiplier: 1.2,
    imageUrl: "/images/materials/pp-nonwoven.jpg",
  },
  {
    id: "laminated_rubber",
    name: "Laminated Rubber Substrate",
    description:
      "Reduces damage claims by 43% • Fully recyclable composite • 18-month minimum lifecycle • Waterproof in extreme conditions • Superior durability in transit",
    priceMultiplier: 1.5,
    imageUrl: "/images/materials/laminated-rubber.jpg",
  },
]

// IoT sensor information
export const iotSensorInfo = {
  name: "IoT Smart Sensors",
  description: "Track location, temperature, humidity, and shock in real-time",
  pricePerSensor: 12.99,
  imageUrl: "/images/materials/iot-sensor.jpg",
}
