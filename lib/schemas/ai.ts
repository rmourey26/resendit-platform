import { z } from "zod"

export const createAgentSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  system_prompt: z.string().min(3),
  model_id: z.string().uuid(),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
})

export const updateAgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  system_prompt: z.string().min(3),
  model_id: z.string().uuid(),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
})

export type CreateAIAgent = z.infer<typeof createAgentSchema>
export type UpdateAIAgent = z.infer<typeof updateAgentSchema>
