/**
 * Check if a string contains Arabic characters
 * @param text - The text to check
 * @returns true if the text contains Arabic characters, false otherwise
 */
export function containsArabic(text: string): boolean {
  // Arabic Unicode range: U+0600 to U+06FF
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

/**
 * Validate that category name is in English only
 * @param category - The category name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateCategoryEnglish(category: string): string | undefined {
  if (!category || category.trim() === "") {
    return undefined; // Empty category is allowed (optional field)
  }

  if (containsArabic(category)) {
    return "Category must be in English only. Arabic characters are not allowed.";
  }

  return undefined;
}

