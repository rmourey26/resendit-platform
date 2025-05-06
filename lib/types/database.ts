export interface AIModel {
  id: string
  name: string
  provider: string
  model_id: string
  description: string | null
  capabilities: string[]
  parameters: Record<string, any>
  cost_per_1k_tokens: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIAgent {
  id: string
  name: string
  description: string | null
  system_prompt: string | null
  model_id: string
  user_id: string
  parameters: Record<string, any>
  tools: any[]
  is_active: boolean
  created_at: string
  updated_at: string
  max_tokens: number
}

export interface DataEmbedding {
  id: string
  name: string
  description: string | null
  source_type: string
  source_id: string | null
  embedding_model: string
  vector_data: number[]
  metadata: Record<string, any>
  user_id: string
  created_at: string
  updated_at: string
}

export interface EmbeddingFile {
  id: string
  file_name: string
  file_type: string
  file_size: number
  file_path: string
  embedding_id: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface EmbeddingJob {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  job_type: string
  embedding_id: string | null
  file_ids: string[] | null
  parameters: Record<string, any>
  result: Record<string, any> | null
  error: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface EmbeddingUsage {
  id: string
  embedding_id: string
  agent_id: string | null
  query: string | null
  tokens_used: number | null
  similarity_score: number | null
  user_id: string
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  settings_type: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AIAgentSettings {
  id: string
  user_id: string
  agent_id: string
  settings_type: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SupplyChainData {
  id: string
  name: string
  description: string | null
  data_type: string
  data: Record<string, any>
  metadata: Record<string, any>
  user_id: string
  created_at: string
  updated_at: string
}

export interface ReusablePackage {
  id: string
  package_id: string
  name: string
  description: string | null
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  }
  weight_capacity: number
  material: string | null
  reuse_count: number
  status: "available" | "in_use" | "damaged" | "retired"
  location_id: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Shipping {
  id: string
  user_id: string
  tracking_number: string
  status: string
  origin_address: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  destination_address: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  shipping_date: string | null
  estimated_delivery: string | null
  actual_delivery: string | null
  carrier: string
  service_level: string
  package_ids: string[] | null
  weight: number | null
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  } | null
  shipping_cost: number | null
  currency: string
  notes: string | null
  created_at: string
  updated_at: string
  public_id: string
  iot_data?: IoTData | null
}

export interface IoTData {
  device_id: string
  sensor_type: string
  is_refrigerated: boolean
  location_tracking: LocationPoint[]
  sensor_readings: SensorReading[]
  alerts: SensorAlert[]
}

export interface LocationPoint {
  timestamp: string
  latitude: number
  longitude: number
  accuracy: number
  facility_type: string
}

export interface SensorReading {
  timestamp: string
  temperature: {
    value: number
    unit: string
  }
  humidity: {
    value: number
    unit: string
  }
  pressure: {
    value: number
    unit: string
  }
  shock: {
    value: number
    unit: string
  }
  light: {
    value: number
    unit: string
  }
  battery: {
    value: number
    unit: string
  }
}

export interface SensorAlert {
  type: string
  severity: string
  timestamp: string
  message: string
  threshold: number
}

export interface AIAnalysisResult {
  id: string
  analysis_type: string
  source_type: string
  source_id: string
  agent_id: string | null
  results: Record<string, any>
  metadata: Record<string, any>
  user_id: string
  created_at: string
  updated_at: string
}

export interface AIWorkflow {
  id: string
  name: string
  description: string | null
  steps: any[]
  trigger_type: string | null
  trigger_config: Record<string, any>
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface AIWorkflowRun {
  id: string
  workflow_id: string
  status: "pending" | "running" | "completed" | "failed"
  start_time: string
  end_time: string | null
  results: Record<string, any>
  error: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface DeveloperTool {
  id: string
  name: string
  tool_type: string
  configuration: Record<string, any>
  description: string | null
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface ShippingAnalytics {
  shipping_day: string
  total_shipments: number
  avg_estimated_delivery_days: number
  avg_actual_delivery_days: number
  total_cost: number
  avg_cost: number
  total_weight: number
  avg_weight: number
  delivered_count: number
  in_transit_count: number
  delayed_count: number
}

export interface PackageUtilization {
  id: string
  package_id: string
  name: string
  reuse_count: number
  status: string
  shipment_count: number
  last_used_date: string | null
  created_at: string
  days_since_creation: number
  reuses_per_day: number
}
