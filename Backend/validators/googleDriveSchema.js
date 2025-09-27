import { z } from "zod/v4"


export const sendGoogleDriveFileSchema = z.object({
    file: z.object({
        id: z.string(),
        createdTime: z.string(),
        mimeType: z.string(),
        name: z.string(),
        size: z.string(),
        thumbnailLink: z.string(),
        webViewLink: z.string()
    })

}) 