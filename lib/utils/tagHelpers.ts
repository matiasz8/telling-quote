/**
 * Utility functions for tag processing and styling
 */

/**
 * Normalizes tag input string to array of valid tags
 * @param input - Comma-separated tag string
 * @returns Array of normalized tag strings
 */
export function normalizeTags(input: string): string[] {
  if (!input || typeof input !== "string") {
    return [];
  }

  return input
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => {
      // Filter empty and validate
      if (tag.length === 0 || tag.length > 20) {
        return false;
      }
      // Only alphanumeric + spaces
      return /^[a-zA-Z0-9\s]+$/.test(tag);
    })
    .slice(0, 5); // Max 5 tags
}

/**
 * Generates consistent color for a tag based on its name
 * @param tagName - Normalized tag name
 * @param isDark - Current theme mode
 * @returns Tailwind CSS class string
 */
export function getTagColor(tagName: string, isDark: boolean): string {
  // Simple hash function for consistent color assignment
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Color palettes for light and dark themes
  const lightColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  const darkColors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-yellow-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-orange-600",
  ];

  const colors = isDark ? darkColors : lightColors;
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Validates a single tag name
 * @param tag - Tag string to validate
 * @returns true if valid
 */
export function validateTag(tag: string): boolean {
  if (!tag || typeof tag !== "string") {
    return false;
  }

  const trimmed = tag.trim();
  if (trimmed.length === 0 || trimmed.length > 20) {
    return false;
  }

  // Only alphanumeric + spaces
  return /^[a-zA-Z0-9\s]+$/.test(trimmed);
}
