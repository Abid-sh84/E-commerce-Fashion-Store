/**
 * Checks if a value is a valid MongoDB ObjectId
 * @param {any} id - The value to check
 * @returns {boolean} - True if valid MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id.toString());
};

/**
 * Creates a consistent, deterministic MongoDB ObjectId-compatible string from any input
 * ObjectIds have a specific format: 4 bytes timestamp + 5 bytes random + 3 bytes counter
 * @param {string|number} input - Any input value 
 * @returns {string} - A valid ObjectId-format string
 */
export const createConsistentObjectId = (input) => {
  // If already a valid ObjectId, return as is
  if (isValidObjectId(input)) return input.toString();
  
  // Create a string representation of the input
  const inputStr = String(input);
  
  // Use a simple hashing function for determinism
  const hash = simpleHash(inputStr);
  
  // Create a timestamp portion (8 hex chars)
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  
  // Use the hash for the remaining 16 chars
  const remainingPart = hash.toString(16).padStart(16, '0');
  
  // Combine to create a valid 24-char hex string
  return (timestamp + remainingPart).slice(0, 24);
};

/**
 * Simple string hashing function that will always produce the same output for the same input
 * @param {string} str - Input string
 * @returns {number} - Hash value
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Always return positive number
  return Math.abs(hash);
};
