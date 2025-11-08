
import { log } from "console";
import cloudinary from "./cloudinary.js";


// Utility to delete Cloudinary file safely
export const deleteLocalFile = async (cloudinaryURL, fileData) => {
    try {
        // Detect file resource type
        let resourceType = "raw";
        if (fileData.type.startsWith("image/")) resourceType = "image";
        else if (fileData.type.startsWith("video/")) resourceType = "video";
        else if (fileData.type.startsWith("audio/")) resourceType = "audio";

        // Extract public_id safely
        const afterUploadPath = cloudinaryURL.split("/upload/")[1];
        if (!afterUploadPath) throw new Error("Invalid Cloudinary URL");

        const pathWithoutVersion = afterUploadPath.replace(/^v\d+\//, "");

        const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
        const publicId =
            lastDotIndex !== -1
                ? pathWithoutVersion.substring(0, lastDotIndex)
                : pathWithoutVersion;

        // Delete file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Failed to delete Cloudinary file: ${result.result}`);
        }

        console.log("Deleted from Cloudinary:", publicId);
        return true;
    } catch (err) {
        console.error("Cloudinary Delete Error:", err.message);
        return false;
    }
};

// rename URL in cloudinary
export const renameLocalFile = async (oldCloudinaryURL, newFileName, fileData) => {
    try {
        // Detect file resource type
        let resourceType = "raw";
        if (fileData.type.startsWith("image/")) resourceType = "image";
        else if (fileData.type.startsWith("video/")) resourceType = "video";
        else if (fileData.type.startsWith("audio/")) resourceType = "audio";

        // Extract and decode public_id
        const afterUploadPath = oldCloudinaryURL.split("/upload/")[1];
        if (!afterUploadPath) throw new Error("Invalid Cloudinary URL");

        const decodedPath = decodeURIComponent(afterUploadPath);
        const pathWithoutVersion = decodedPath.replace(/^v\d+\//, "");
        const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
        const publicId =
            lastDotIndex !== -1
                ? pathWithoutVersion.substring(0, lastDotIndex)
                : pathWithoutVersion;

        // Folder + clean new name
        const folderPath = publicId.substring(0, publicId.lastIndexOf("/"));
        const newfileWithoutExtension = newFileName.split(".")[0];
        const newPublicId = `${folderPath}/${newfileWithoutExtension}`;

        // Rename on Cloudinary
        const result = await cloudinary.uploader.rename(publicId, newPublicId, {
            resource_type: resourceType,
            overwrite: true,
        });

        // Construct new full URL
        const versionPart = result.version ? `v${result.version}/` : "";

        const newUrl = `https://res.cloudinary.com/${cloudinary.config().cloud_name}/${resourceType}/upload/${versionPart}${result.public_id}.${fileData.extension.replace(".", "")}`;

        return newUrl;

    } catch (err) {
        console.error("❌ Cloudinary Rename Error:", err.message);
        return false;
    }
};
