import cloudinary from './cloudinary'

export const deleteCloudinaryAssets = async (publicIds : string[], resource_type: 'image' | 'video') => {
    for (const publicId of publicIds) {
        await cloudinary.uploader.destroy(publicId, {resource_type: resource_type})
    }
}