/**
 * Utility functions for checking user permissions
 */

/**
 * Checks if a user has permission to seed embeddings
 * @param userId The user ID to check
 * @returns boolean indicating if the user has seeding permissions
 */
export function canSeedEmbeddings(userId: string): boolean {
  // Get the authorized user IDs from environment variables
  const primarySeedUserId = process.env.SEED_USER_ID || ""
  const secondarySeedUserId = process.env.SECONDARY_SEED_USER_ID || ""

  // Check if the user ID matches either of the authorized user IDs
  return userId === primarySeedUserId || userId === secondarySeedUserId
}