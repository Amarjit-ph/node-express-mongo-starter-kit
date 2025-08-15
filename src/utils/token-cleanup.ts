import { BlacklistedToken } from '../models/blacklisted-token.model';

/**
 * Clean up expired blacklisted tokens
 * This function can be called periodically (e.g., daily) to remove expired tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
    try {
        const now = new Date();
        const result = await BlacklistedToken.deleteMany({
            expiresAt: { $lt: now }
        });
        
        console.log(`Cleaned up ${result.deletedCount} expired blacklisted tokens`);
        return result.deletedCount || 0;
    } catch (error) {
        console.error('Error cleaning up expired tokens:', error);
        return 0;
    }
}

/**
 * Get statistics about blacklisted tokens
 */
export async function getBlacklistedTokenStats() {
    try {
        const total = await BlacklistedToken.countDocuments();
        const expired = await BlacklistedToken.countDocuments({
            expiresAt: { $lt: new Date() }
        });
        const active = total - expired;
        
        return {
            total,
            expired,
            active
        };
    } catch (error) {
        console.error('Error getting blacklisted token stats:', error);
        return { total: 0, expired: 0, active: 0 };
    }
}
