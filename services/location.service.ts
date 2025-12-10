import apiClient from '@/lib/api-client';

const BRANCH_INFO_KEY = 'meghana_branch_info';

interface BranchInfo {
    branchCode: string;
    isWithin5km: boolean;
}

interface NearestBranchResponse {
    branchCode: string;
    isWithin5km: boolean;
}

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

            LocationService.setBranchInfo(info);
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

    setBranchInfo: (info: BranchInfo) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(BRANCH_INFO_KEY, JSON.stringify(info));
        }
    },

    getBranchInfo: (): BranchInfo | null => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(BRANCH_INFO_KEY);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse branch info", e);
                }
            }
        }
        return null;
    },

    getBranchCode: (): string => {
        const info = LocationService.getBranchInfo();
        return info?.branchCode || 'HO'; // Default to HO
    },

    isWithinRange: (): boolean => {
        const info = LocationService.getBranchInfo();
        // If no info, assume false or true? 
        // If user hasn't selected location, maybe we shouldn't allow adding?
        // Let's assume false to be safe, or true if we want to be permissive until checkout.
        // Requirement: "else if isWithin5km: false then we disable"
        // So default should probably be true for HO?
        // Actually, if 'HO' is default, we might not have isWithin5km.
        // Let's default to true for 'HO' (fallback) so we don't block users who haven't done location flow yet?
        // Or default to false?
        // User scenario: Register -> Select Delivery.
        // So flow forces selection.
        return info ? info.isWithin5km : true;
    }
};
