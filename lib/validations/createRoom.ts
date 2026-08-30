import * as z from 'zod'

export const createRoomSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must contain at least 2 characters')
    .max(50, 'Username must not contain more than 50 characters'),
  timePerDraw: z.number().min(30).max(180).default(90),
  roundCount: z.number().min(1).max(10).default(2),
})
