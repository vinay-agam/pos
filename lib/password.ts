// Password management - passwords stored in JavaScript (visible in dev tools)

/**
 * Shop passwords stored as JavaScript constants
 * These are visible in browser dev tools as requested
 * Format: SHOP_PASSWORDS[shopId] = "password"
 * 
 * Note: Passwords are also stored in localStorage for immediate use after creation.
 * For permanent storage, manually add passwords to this file.
 */
export const SHOP_PASSWORDS: Record<string, string> = {
  // Example shop passwords
  // Add passwords here manually for each shop
  // 'shop1': 'password123',
  // 'shop2': 'mypassword456',
};

/**
 * Get password for a shop
 * Checks both JavaScript constants and localStorage
 */
export function getShopPassword(shopId: string): string | undefined {
  // First check JavaScript constants
  if (SHOP_PASSWORDS[shopId]) {
    return SHOP_PASSWORDS[shopId];
  }
  
  // Fallback to localStorage (for newly created shops)
  if (typeof window !== 'undefined') {
    const passwordKey = `pos_password_${shopId}`;
    const storedPassword = localStorage.getItem(passwordKey);
    if (storedPassword) {
      return storedPassword;
    }
  }
  
  return undefined;
}

/**
 * Set password for a shop (manually add to this file)
 */
export function setShopPassword(shopId: string, password: string): void {
  SHOP_PASSWORDS[shopId] = password;
}

/**
 * Verify password for a shop
 */
export function verifyShopPassword(shopId: string, password: string): boolean {
  const storedPassword = getShopPassword(shopId);
  return storedPassword !== undefined && storedPassword === password;
}

/**
 * Check if shop has password configured
 */
export function hasShopPassword(shopId: string): boolean {
  return getShopPassword(shopId) !== undefined;
}

