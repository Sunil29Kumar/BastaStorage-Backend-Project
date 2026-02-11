import { z } from "zod/v4"


export const sendGoogleDriveFileSchema = z.object({
    token: z.string()

}) 