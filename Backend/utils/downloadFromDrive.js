import { google } from 'googleapis';
import fs from "fs";


export const downloadFromDrive = async (auth, fileId, desPath) => {
    const drive = google.drive({ version: "v3", auth })
    const dest = fs.createWriteStream(desPath)


    await new Promise((resolve, reject) => {
        drive.files.get(
            { fileId, alt: "media" },
            { responseType: "stream" },
            (err, res) => {
                if (err) return reject(err);
                res.data
                    .on("end", resolve)
                    .on("error", reject)
                    .pipe(dest);
            }
        );
    });
}