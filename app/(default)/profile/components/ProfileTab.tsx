"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { deleteFcmToken } from "@/lib/firebase";

export default function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Abhijith R");
    const [phone, setPhone] = useState("00000 00000");

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
                <Button
                    variant="neutral"
                    onClick={() => setIsEditing(!isEditing)}
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
            </header>

            {/* Form */}
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

            {/* Save Button (only shown when editing) */}
            {isEditing && (
                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        onClick={() => setIsEditing(false)}
                    >
                        Save Changes
                    </Button>
                    <Button
                        variant="neutral"
                        onClick={() => setIsEditing(false)}
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
