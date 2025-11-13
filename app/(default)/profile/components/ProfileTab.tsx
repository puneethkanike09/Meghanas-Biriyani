"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Abhijith R");
    const [phone, setPhone] = useState("00000 00000");

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
                    <div className="relative">
                        <Image
                            src="/assets/profile/icons/Person.svg"
                            alt="User"
                            width={20}
                            height={20}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full pl-10 px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm text-base ${isEditing
                                ? "bg-white text-midnight"
                                : "bg-gray-50 text-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-tango focus:border-transparent`}
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="flex-1 flex flex-col gap-1.5">
                    <label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                    >
                        Phone
                    </label>
                    <div className="relative">
                        <Image
                            src="/assets/profile/icons/Phone.svg"
                            alt="Phone"
                            width={20}
                            height={20}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                        />
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full pl-10 px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm text-base ${isEditing
                                ? "bg-white text-midnight"
                                : "bg-gray-50 text-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-tango focus:border-transparent`}
                        />
                    </div>
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
        </div>
    );
}

