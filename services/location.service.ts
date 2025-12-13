import apiClient from '@/lib/api-client';
import { CookieService } from './cookie.service';

interface BranchInfo {
    branchCode: string;
    isWithin5km: boolean;
}

interface NearestBranchResponse {
    branchCode: string;
    isWithin5km: boolean;
}

// Legacy localStorage key for migration
const LEGACY_BRANCH_INFO_KEY = 'meghana_branch_info';

/**
 * Migrate branch info from localStorage to cookies
 * This is a one-time migration for existing users
 */
const migrateBranchInfo = (): void => {
    if (typeof window === 'undefined') return;

    // Check if we already have cookie data
    if (CookieService.getBranchInfo()) {
        return; // Already migrated
    }

    // Try to get from localStorage
    try {
        const stored = localStorage.getItem(LEGACY_BRANCH_INFO_KEY);
        if (stored) {
            const info = JSON.parse(stored);
            // Migrate to cookies
            CookieService.setBranchInfo(info);
            // Remove from localStorage (optional - can keep for backward compatibility)
            // localStorage.removeItem(LEGACY_BRANCH_INFO_KEY);
        }
    } catch (e) {
        console.error("Failed to migrate branch info", e);
    }
};

export const LocationService = {
    findNearestBranch: async (latitude: number, longitude: number): Promise<BranchInfo> => {
        try {
            const response = await apiClient.post<NearestBranchResponse>('/users/customers/nearest-branch', {
                latitude,
                longitude
            });

            const info = {
                branchCode: response.data.branchCode,
                isWithin5km: response.data.isWithin5km
            };

            // Store in cookies instead of localStorage
            CookieService.setBranchInfo(info);
            return info;
        } catch (error: any) {
            console.error("Failed to find nearest branch:", error);

            // Extract meaningful message from backend response
            let errorMessage = "Failed to find nearest branch";
            if (error.response?.data?.message) {
                const msg = error.response.data.message;
                errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;

                // Attach the clean message to the error object so UI can use it
                error.message = errorMessage;
            }

            throw error;
        }
    },

    getBranchInfo: (): BranchInfo | null => {
        // Migrate from localStorage on first access
        migrateBranchInfo();
        return CookieService.getBranchInfo();
    },

    getBranchCode: (): string => {
        const info = LocationService.getBranchInfo();
        return info?.branchCode || 'HO'; // Default to HO
    },

    isWithinRange: (): boolean => {
        const info = LocationService.getBranchInfo();
        // If no info, default to true for 'HO' (fallback) so we don't block users who haven't done location flow yet
        return info ? info.isWithin5km : true;
    }
};
