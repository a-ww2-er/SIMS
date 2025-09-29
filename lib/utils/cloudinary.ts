// Cloudinary upload utility
export interface CloudinaryUploadResult {
  public_id: string
  url: string
  secure_url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export class CloudinaryService {
  private cloudName: string
  private uploadPreset: string
  private apiKey?: string
  private apiSecret?: string

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
    // For signed uploads (more secure, requires server-side)
    this.apiKey = process.env.CLOUDINARY_API_KEY
    this.apiSecret = process.env.CLOUDINARY_API_SECRET
  }

  // Method 1: Unsigned upload (current implementation - simpler but less secure)
  async uploadFile(file: File, options: {
    folder?: string
    public_id?: string
    resource_type?: 'auto' | 'image' | 'video' | 'raw'
  } = {}): Promise<CloudinaryUploadResult> {
    const {
      folder = 'student-documents',
      public_id,
      resource_type = 'auto'
    } = options

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    formData.append('folder', folder)

    if (public_id) {
      formData.append('public_id', public_id)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/${resource_type}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`)
    }

    const result: CloudinaryUploadResult = await response.json()
    return result
  }

  // Method 2: Signed upload (more secure - requires API key and secret)
  // Note: This should typically be done server-side for security
  async uploadFileSigned(file: File, options: {
    folder?: string
    public_id?: string
    resource_type?: 'auto' | 'image' | 'video' | 'raw'
  } = {}): Promise<CloudinaryUploadResult> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API key and secret required for signed uploads')
    }

    const {
      folder = 'student-documents',
      public_id,
      resource_type = 'auto'
    } = options

    // Generate signature (this is typically done server-side)
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = this.generateSignature({
      timestamp,
      upload_preset: this.uploadPreset,
      folder,
      ...(public_id && { public_id })
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    formData.append('folder', folder)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('api_key', this.apiKey)

    if (public_id) {
      formData.append('public_id', public_id)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/${resource_type}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`)
    }

    const result: CloudinaryUploadResult = await response.json()
    return result
  }

  private generateSignature(params: Record<string, any>): string {
    // Sort parameters alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {} as Record<string, any>)

    // Create signature string
    const signatureString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + this.apiSecret

    // Generate SHA-1 hash (you'd need a crypto library for this)
    // For now, this is just a placeholder - in production, use a proper crypto library
    return btoa(signatureString).slice(0, 27) // Simplified for demo
  }

  getDownloadUrl(publicId: string, options: {
    format?: string
    quality?: string | number
    flags?: string
  } = {}): string {
    const { format, quality, flags } = options
    let url = `https://res.cloudinary.com/${this.cloudName}/image/upload/`

    if (flags) url += `fl_${flags}/`
    if (quality) url += `q_${quality}/`

    url += publicId

    if (format) url += `.${format}`

    return url
  }

  async deleteFile(publicId: string): Promise<void> {
    // Note: Deleting files requires server-side implementation with API key
    // For now, we'll just return - files can be managed in Cloudinary dashboard
    console.log(`File deletion requested for: ${publicId}`)
    // In a production app, you'd make a server-side API call to delete
  }
}

export const cloudinaryService = new CloudinaryService()