/**
 * Slug Utility Functions
 * Generate URL-friendly slugs from strings
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - Input text (name, title, etc.)
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()                          // Convert to lowercase
    .trim()                                 // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '')              // Remove special characters
    .replace(/[\s_-]+/g, '-')              // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');               // Remove leading/trailing hyphens
}

/**
 * Generate unique slug by checking database
 * @param {string} baseText - Base text for slug
 * @param {Function} checkExists - Async function to check if slug exists
 * @param {string} separator - Separator for counter (default: '-')
 * @returns {Promise<string>} - Unique slug
 */
export async function generateUniqueSlug(baseText, checkExists, separator = '-') {
  const baseSlug = generateSlug(baseText);
  
  if (!baseSlug) {
    throw new Error('Cannot generate slug from empty text');
  }
  
  let slug = baseSlug;
  let counter = 1;
  
  // Keep checking until we find a unique slug
  while (await checkExists(slug)) {
    slug = `${baseSlug}${separator}${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Generate slug for categories with validation
 * @param {string} name - Category name
 * @param {string} existingSlug - Optional existing slug to use
 * @returns {string} - Validated slug
 */
export function generateCategorySlug(name, existingSlug = null) {
  // Use provided slug if valid
  if (existingSlug && existingSlug.trim()) {
    return generateSlug(existingSlug);
  }
  
  // Generate from name
  return generateSlug(name);
}

/**
 * Generate slug for events
 * Events often need more uniqueness handling
 * @param {string} title - Event title
 * @param {string} existingSlug - Optional existing slug
 * @returns {string} - Validated slug
 */
export function generateEventSlug(title, existingSlug = null) {
  if (existingSlug && existingSlug.trim()) {
    return generateSlug(existingSlug);
  }
  
  // Add date to event slugs for better uniqueness
  const baseSlug = generateSlug(title);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `${baseSlug}-${date}`;
}

/**
 * Validate if a string is a valid slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} - True if valid slug format
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Valid slug: lowercase letters, numbers, hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitize slug for safe database storage
 * @param {string} slug - Raw slug input
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} - Sanitized slug
 */
export function sanitizeSlug(slug, maxLength = 100) {
  if (!slug) return '';
  
  let sanitized = generateSlug(slug);
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    // Remove trailing hyphen if truncated
    sanitized = sanitized.replace(/-+$/, '');
  }
  
  return sanitized;
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

/**
 * Check if slug exists in database (PostgreSQL/MySQL compatible)
 * Usage in controllers:
 * 
 * const checkSlug = async (slug) => {
 *   const result = await query(
 *     'SELECT 1 FROM categories WHERE slug = $1 LIMIT 1',
 *     [slug]
 *   );
 *   return result.rowCount > 0; // PostgreSQL
 *   // or return result.length > 0; // MySQL
 * };
 * 
 * const uniqueSlug = await generateUniqueSlug('My Category', checkSlug);
 */

export default {
  generateSlug,
  generateUniqueSlug,
  generateCategorySlug,
  generateEventSlug,
  isValidSlug,
  sanitizeSlug,
};
