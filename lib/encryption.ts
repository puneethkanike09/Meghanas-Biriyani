/**
 * Simple encryption/decryption utility for cookie data
 * Uses base64 encoding with a simple obfuscation (not for sensitive data)
 * For production, consider using a proper encryption library
 */

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'mb_default_key_change_in_prod';

/**
 * Simple XOR cipher for basic obfuscation
 * Note: This is NOT secure encryption - use only for non-sensitive data
 */
function xorEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function xorDecrypt(encrypted: string, key: string): string {
  return xorEncrypt(encrypted, key); // XOR is symmetric
}

/**
 * Encrypt data for storage
 */
export function encryptData(data: string): string {
  try {
    const encrypted = xorEncrypt(data, ENCRYPTION_KEY);
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error);
    return btoa(data); // Fallback to just base64
  }
}

/**
 * Decrypt data from storage
 */
export function decryptData(encrypted: string): string {
  try {
    const decoded = atob(encrypted);
    return xorDecrypt(decoded, ENCRYPTION_KEY);
  } catch (error) {
    console.error('Decryption error:', error);
    try {
      return atob(encrypted); // Fallback to just base64 decode
    } catch {
      return encrypted; // Return as-is if all fails
    }
  }
}

