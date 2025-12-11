"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";
import { deleteFcmToken } from "@/lib/firebase";

export default function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [originalPhone, setOriginalPhone] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch customer name and phone from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await UserService.getNamePhone();
                setName(data.name || "");
                setPhone(data.phone || "");
                setOriginalName(data.name || "");
                setOriginalPhone(data.phone || "");
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        // Store current values as original when entering edit mode
        setOriginalName(name);
        setOriginalPhone(phone);
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Restore original values
        setName(originalName);
        setPhone(originalPhone);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (isSaving) return;

        // Validate inputs
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        if (!phone.trim()) {
            toast.error("Phone is required");
            return;
        }

        setIsSaving(true);

        try {
            const response = await UserService.updateNamePhone({
                name: name.trim(),
                phone: phone.trim(),
            });

            // Update with response data
            setName(response.name);
            setPhone(response.phone);
            setOriginalName(response.name);
            setOriginalPhone(response.phone);
            setIsEditing(false);

            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Failed to update profile:", error);

            let errorMessage = "Failed to update profile";
            if (error.response?.data?.message) {
                const msg = error.response.data.message;
                errorMessage = Array.isArray(msg) ? msg.join(", ") : msg;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await deleteFcmToken(); // Delete client-side FCM token
            await AuthService.logout();
            window.location.href = '/signin';
        } catch (error) {
            console.error("Logout failed", error);
            window.location.href = '/signin';
        }
    };

    return (
        <div className="flex flex-col gap-6 py-6 tablet:py-6 desktop:py-0">
            {/* Header */}
            <header className="flex items-start justify-between py-3 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-midnight">
                    Profile
                </h1>
                {!isEditing && (
                    <Button
                        variant="neutral"
                        onClick={handleEdit}
                        icon={
                            <Image
                                src="/assets/profile/icons/Edit.svg"
                                alt="Edit"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                            />
                        }
                    >
                        Edit Profile
                    </Button>
                )}
            </header>

            {/* Form */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader message="Loading profile..." />
                </div>
            ) : (
                <div className="flex flex-col tablet:flex-row gap-4">
                    {/* Name Field */}
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditing}
                            startIcon={
                                <Image
                                    src="/assets/profile/icons/Person.svg"
                                    alt="User"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 text-gray-500"
                                />
                            }
                            className={cn(
                                isEditing
                                    ? "bg-white text-midnight"
                                    : "bg-gray-50 text-gray-500"
                            )}
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700"
                        >
                            Phone
                        </label>
                        <Input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            readOnly={!isEditing}
                            startIcon={
                                <Image
                                    src="/assets/profile/icons/Phone.svg"
                                    alt="Phone"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 text-gray-500"
                                />
                            }
                            className={cn(
                                isEditing
                                    ? "bg-white text-midnight"
                                    : "bg-gray-50 text-gray-500"
                            )}
                        />
                    </div>
                </div>
            )}

            {/* Save Button (only shown when editing) */}
            {isEditing && (
                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        variant="neutral"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                    variant="neutral"
                    className="w-full tablet:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </div>
        </div>
    );
}
