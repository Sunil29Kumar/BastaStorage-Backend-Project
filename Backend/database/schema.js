import connectDB from "./db.js";
import {client} from "./db.js";

const db = await connectDB();
const command = "collMod";

try {
  // users schema validation
  await db.command({
    [command]: "users",
    validator: {
      $jsonSchema: {
        required: ["_id", "rootDirId", "name", "email", "password"],
        properties: {
          _id: {
            bsonType: "objectId",
            description: "Must be an ObjectId and is required",
          },
          rootDirId: {
            bsonType: "objectId",
            description: "Must be an ObjectId and is required",
          },
          name: {
            bsonType: "string",
            minLength: 3,
            maxLength: 255,
            description: "Name Must contain minimun 3 character",
          },
          email: {
            bsonType: "string",
            pattern: "^[\\w\\.-]+@([\\w\\-]+\\.)+[\\w]{2,4}$",
            description: "Must be a valid email address",
          },
          password: {
            bsonType: "string",
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&]).{6,}$",
            description:
              "Password must have 6+ characters with uppercase, lowercase, number and special character",
          },
          userTimeStamp: {
            bsonType: "object",
            required: ["userCreatedAt", "userLoginAt", "userLogoutAt"],
            properties: {
              userCreatedAt: {
                bsonType: "date",
              },
              userLoginAt: {
                bsonType: "array",
                items: {
                  bsonType: "date",
                },
              },
              userLogoutAt: {
                bsonType: "array",
                items: {
                  bsonType: "date",
                },
              },
            },
          },
        },
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  // directores schema validation
  await db.command({
    [command]: "directories",
    validator: {
      $jsonSchema: {
        required: ["_id", "parentDirId", "userId", "name", "folderTimeStamp"],
        properties: {
          _id: {
            bsonType: "objectId",
            description: "Unique identifier for the folder document",
          },
          parentDirId: {
            bsonType: ["null", "objectId"],
            description:
              "ObjectId of the parent directory (null or root if top-level)",
          },
          userId: {
            bsonType: "objectId",
            description: "ObjectId of the user who owns this folder",
          },
          name: {
            bsonType: "string",
            minLength: 1,
            maxLength: 255,
            description: "Name of the folder (must be a non-empty string)",
          },
          folderTimeStamp: {
            bsonType: "object",
            required: [
              "folderCreatedAt",
              "opened",
              "lastModified",
              "lastDownload",
            ],
            properties: {
              folderCreatedAt: {
                bsonType: "date",
                description: "Date and time when the folder was created",
              },
              opened: {
                bsonType: "array",
                items: {
                  bsonType: "date",
                },
                description: "Array of dates when the folder was opened",
              },
              lastModified: {
                bsonType: "array",
                items: {
                  bsonType: "date",
                },
                description: "Array of dates when the folder was modified",
              },
              lastDownload: {
                bsonType: "array",
                items: {
                  bsonType: "date",
                },
                description:
                  "Array of dates when the folder's contents were downloaded",
              },
            },
          },
        },
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  // files scheam validation
  await db.command({
    [command]: "files",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "_id",
          "parentDirId",
          "userId",
          "name",
          "extension",
          "size",
          "timeStamp",
        ],
        properties: {
          _id: {
            bsonType: "objectId",
            description: "Must be an ObjectId and is required",
          },
          parentDirId: {
            bsonType: "objectId",
            description: "Must be an ObjectId and is required",
          },
          userId: {
            bsonType: "objectId",
            description: "Must be an ObjectId",
          },
          name: {
            bsonType: "string",
            minLength: 3,
            maxLength: 255,
            description: "Must be a string and is required",
          },
          extension: {
            bsonType: "string",
            description: "Must be a string like .pdf and is required",
          },
          size: {
            bsonType: ["int", "long"],
            description: "Must be an integer size",
          },
          timeStamp: {
            bsonType: "object",
            required: [
              "fileCreatedAt",
              "opened",
              "lastModified",
              "lastDownload",
            ],
            properties: {
              fileCreatedAt: {
                bsonType: "date",
                description: "ISO string format date",
              },
              opened: {
                bsonType: "array",
                description: "Opened event history",
                items: {
                  bsonType: "date",
                },
              },
              lastModified: {
                bsonType: "array",
                description: "Modification event history",
                items: {
                  bsonType: "date",
                },
              },
              lastDownload: {
                bsonType: "array",
                description: "Download event history",
                items: {
                  bsonType: "date",
                },
              },
            },
          },
        },
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });
} catch (error) {
  console.log("scena error", error);
} finally {
  client.close();
}
