import { z } from "zod/v4"

export const createFileSchema = z.object({
    params: z.object({
        parentDirId: z.string().optional(),
    }),
    headers: z.object({
        filename: z.string().min(3, "Filename is required"),
        size: z.string().min(1, "File size is required"),
        type: z.string().min(3, "File type is required"),
    }),
});



export const getFileSchema = z.object({
    params: z.object({
        id: z.string().min(1, "File ID is required"),
    })
})


export const renameFileSchema = z.object({
    params: z.object({
        id: z.string().optional(),
    }),
    body:z.object({
        newFilename:z.string()
    })
})