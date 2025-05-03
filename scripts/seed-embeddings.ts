import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to generate a random embedding vector with 1536 dimensions
function generateRandomEmbedding(dimensions = 1536): number[] {
  const embedding = []
  for (let i = 0; i < dimensions; i++) {
    // Generate values between -1 and 1, which is typical for normalized embeddings
    embedding.push(Math.random() * 2 - 1)
  }
  return embedding
}

// Function to generate a random date within the last year
function randomDate(start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), end = new Date()): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

// Function to generate random shipping data
function generateShippingData() {
  const carriers = ["FedEx", "UPS", "USPS", "DHL", "Amazon Logistics"]
  const statuses = ["delivered", "in_transit", "processing", "delayed", "returned"]
  const countries = ["US", "CA", "UK", "DE", "FR", "JP", "AU"]

  const carrier = carriers[Math.floor(Math.random() * carriers.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const originCountry = countries[Math.floor(Math.random() * countries.length)]
  const destinationCountry = countries[Math.floor(Math.random() * countries.length)]

  const trackingNumber = `${carrier.substring(0, 2)}${Math.floor(Math.random() * 10000000000)}`
  const weight = Math.round((Math.random() * 50 + 0.5) * 100) / 100 // 0.5 to 50.5 kg
  const shippingCost = Math.round((Math.random() * 200 + 5) * 100) / 100 // $5 to $205

  const dimensions = {
    length: Math.round(Math.random() * 100 + 5), // 5 to 105 cm
    width: Math.round(Math.random() * 50 + 5), // 5 to 55 cm
    height: Math.round(Math.random() * 50 + 5), // 5 to 55 cm
    unit: "cm",
  }

  const shippingDate = randomDate()
  const estimatedDelivery = new Date(
    new Date(shippingDate).getTime() + (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000,
  ).toISOString()
  const actualDelivery =
    status === "delivered"
      ? new Date(new Date(estimatedDelivery).getTime() + (Math.random() * 4 - 2) * 24 * 60 * 60 * 1000).toISOString()
      : null

  return {
    tracking_number: trackingNumber,
    status,
    carrier,
    weight,
    dimensions,
    shipping_cost: shippingCost,
    currency: "USD",
    shipping_date: shippingDate,
    estimated_delivery: estimatedDelivery,
    actual_delivery: actualDelivery,
    origin_address: {
      name: `Sender in ${originCountry}`,
      street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      city: `City in ${originCountry}`,
      state: `State in ${originCountry}`,
      zip: `${Math.floor(Math.random() * 99999) + 10000}`,
      country: originCountry,
    },
    destination_address: {
      name: `Recipient in ${destinationCountry}`,
      street: `${Math.floor(Math.random() * 9999) + 1} Delivery Ave`,
      city: `City in ${destinationCountry}`,
      state: `State in ${destinationCountry}`,
      zip: `${Math.floor(Math.random() * 99999) + 10000}`,
      country: destinationCountry,
    },
  }
}

// Function to create a text description of the shipping data for embedding
function createShippingDescription(shippingData: any): string {
  return `
    Tracking Number: ${shippingData.tracking_number}
    Status: ${shippingData.status}
    Carrier: ${shippingData.carrier}
    Origin: ${shippingData.origin_address.street}, ${shippingData.origin_address.city}, ${shippingData.origin_address.state}, ${shippingData.origin_address.country}
    Destination: ${shippingData.destination_address.street}, ${shippingData.destination_address.city}, ${shippingData.destination_address.state}, ${shippingData.destination_address.country}
    Weight: ${shippingData.weight} kg
    Dimensions: ${shippingData.dimensions.length}x${shippingData.dimensions.width}x${shippingData.dimensions.height} ${shippingData.dimensions.unit}
    Shipping Cost: $${shippingData.shipping_cost} ${shippingData.currency}
    Shipping Date: ${shippingData.shipping_date}
    Estimated Delivery: ${shippingData.estimated_delivery}
    ${shippingData.actual_delivery ? `Actual Delivery: ${shippingData.actual_delivery}` : ""}
  `.trim()
}

// Main function to seed the database
async function seedEmbeddings(count = 50) {
  console.log(`Starting to seed ${count} shipment embeddings...`)

  const userId = process.env.SEED_USER_ID || "00000000-0000-0000-0000-000000000000" // Default user ID if not provided

  for (let i = 0; i < count; i++) {
    const shippingData = generateShippingData()
    const shippingText = createShippingDescription(shippingData)
    const embedding = generateRandomEmbedding(1536)

    const embeddingRecord = {
      id: uuidv4(),
      name: `Shipment ${shippingData.tracking_number}`,
      description: `Shipment from ${shippingData.origin_address.country} to ${shippingData.destination_address.country}`,
      source_type: "shipping",
      source_id: shippingData.tracking_number,
      embedding_model: "text-embedding-ada-002",
      vector_data: embedding,
      metadata: {
        content: shippingText,
        shipping_data: shippingData,
      },
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("data_embeddings").insert(embeddingRecord)

    if (error) {
      console.error(`Error inserting record ${i + 1}:`, error)
    } else {
      console.log(`Inserted record ${i + 1}: Shipment ${shippingData.tracking_number}`)
    }
  }

  console.log("Seeding completed!")
}

// Execute the seeding function
seedEmbeddings(50)
