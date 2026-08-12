import { v2 as cloudinary } from "cloudinary"

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "thay-art"

export function assertCloudinaryConfigured() {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("Falta configurar CLOUDINARY_URL.")
  }
}

export function uploadImageBuffer(buffer, { publicId, folder = "admin" } = {}) {
  assertCloudinaryConfigured()

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: `${CLOUDINARY_FOLDER}/${folder}`,
        public_id: publicId,
        overwrite: true,
        use_filename: false,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )

    upload.end(buffer)
  })
}
