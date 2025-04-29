/**
 * Parses and formats product image URLs from various sources including Supabase
 * @param {string|null} imageUrl - The raw image URL from the API
 * @returns {string|null} - A valid image URL or a placeholder
 */
export const parseProductImage = (imageUrl) => {
  console.log("Parsing image URL:", imageUrl);

  // If no image is provided, return a placeholder
  if (!imageUrl || imageUrl === "") {
    console.log("No image URL provided, using placeholder");
    return "/images/product-placeholder.png"
  }

  // Handle Supabase storage URLs
  if (typeof imageUrl === "string" && imageUrl.includes("supabase.co/storage")) {
    console.log("Detected Supabase storage URL:", imageUrl);
    return imageUrl
  }

  // If the image is already a full URL, return it
  if (typeof imageUrl === "string" && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
    console.log("Detected full URL:", imageUrl);
    return imageUrl
  }

  // If it's a relative path, make sure it's properly formatted
  if (typeof imageUrl === "string" && imageUrl.startsWith("/")) {
    console.log("Detected relative path:", imageUrl);
    return imageUrl
  }

  // If it's a base64 string, return it as is
  if (typeof imageUrl === "string" && imageUrl.startsWith("data:image")) {
    console.log("Detected base64 image");
    return imageUrl
  }

  // Otherwise, assume it's a relative path and add the leading slash
  console.log("Using default path handling");
  return typeof imageUrl === "string" ? `/${imageUrl}` : "/images/product-placeholder.png"
}

/**
 * Formats currency values
 * @param {number|string} price - The price to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = "USD") => {
  // Convert string to number if needed
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  if (typeof numericPrice !== "number" || isNaN(numericPrice)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(numericPrice)
}

/**
 * Creates a product image URL for Supabase storage
 * @param {string} bucketName - The Supabase storage bucket name
 * @param {string} fileName - The file name
 * @returns {string} - The complete Supabase storage URL
 */
export const createSupabaseImageUrl = (bucketName, fileName) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !bucketName || !fileName) {
    return null
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`
}

/**
 * Prepares an image for upload by validating and optimizing it
 * @param {File} file - The image file to prepare
 * @returns {Promise<{file: File, error: string|null}>} - The prepared file or error
 */
export const prepareImageForUpload = async (file) => {
  // Check if file exists
  if (!file) {
    return { file: null, error: "No file provided" }
  }

  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!validTypes.includes(file.type)) {
    return { file: null, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are supported." }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { file: null, error: "File size exceeds 5MB limit." }
  }

  // File is valid
  return { file, error: null }
}
