import { ReactElement } from "react";

const informationCollectionData = [
    {
        type: "intro",
        text: "We may collect the following types of information:",
    },
    {
        type: "subsection",
        text: "1.1 Personal Information",
    },
    {
        type: "item",
        text: "Name",
    },
    {
        type: "item",
        text: "Phone number",
    },
    {
        type: "item",
        text: "Email address",
    },
    {
        type: "item",
        text: "Delivery address",
    },
    {
        type: "item",
        text: "Payment details (processed securely by payment gateways)",
    },
    {
        type: "subsection",
        text: "1.2 Usage Data",
    },
    {
        type: "item",
        text: "Device information",
    },
    {
        type: "item",
        text: "IP address",
    },
    {
        type: "item",
        text: "Browsing behavior on our Platform",
    },
    {
        type: "subsection",
        text: "1.3 Location Data",
    },
    {
        type: "item",
        text: "With your permission, we may collect location information to provide accurate delivery services.",
    },
];

const usageItems = [
    "Process and deliver your orders",
    "Communicate order updates",
    "Improve our website/app performance",
    "Personalize your user experience",
    "Prevent fraud and ensure platform security",
    "Provide customer support",
    "Send offers, promotions, and important notifications (you may opt-out anytime)",
];

const sharingPartners = [
    "Delivery partners",
    "Payment gateway providers",
    "Customer support partners",
    "Legal authorities (only when required by law)",
];

const cookieUsageItems = [
    "Remember your preferences",
    "Improve website experience",
    "Track analytics for performance improvements",
];

const retentionItems = [
    "Fulfill your orders",
    "Comply with legal obligations",
    "Improve our services",
];

const rightsItems = [
    "Request access to your personal data",
    "Request correction or deletion",
    "Opt-out of marketing communication",
    "Withdraw consent for location access",
];

//mx-auto flex w-full max-w-[648px] flex-col gap-8
//section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36

export default function PrivacyPolicyPage() {
    return (
        <section className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36">
            <div className="flex flex-col max-w-[1090px] mx-auto items-start gap-12">
                <section className="flex flex-col items-start gap-2 w-full">
                    <p className="w-full font-normal text-midnight text-base tracking-[0] leading-normal">
                        Your privacy is important to us. This Privacy Policy explains how
                        Meghana Foods collects, uses, and protects your personal information
                        when you use our website or mobile app (&quot;Platform&quot;).
                    </p>
                </section>

                {/* Section 1: Information We Collect */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="self-stretch font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        1. Information We Collect
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        {(() => {
                            const elements: ReactElement[] = [];
                            let currentBulletGroup: typeof informationCollectionData = [];

                            informationCollectionData.forEach((item, index) => {
                                if (item.type === "intro" || item.type === "subsection") {
                                    // If we have accumulated bullet items, render them as a list
                                    if (currentBulletGroup.length > 0) {
                                        elements.push(
                                            <ul key={`bullets-${index}`} className="flex flex-col items-start gap-0 list-none pl-0">
                                                {currentBulletGroup.map((bulletItem, bulletIndex) => (
                                                    <li
                                                        key={bulletIndex}
                                                        className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                                    >
                                                        {bulletItem.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                        currentBulletGroup = [];
                                    }
                                    // Render subsection/intro
                                    elements.push(
                                        <p
                                            key={index}
                                            className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal"
                                        >
                                            {item.text}
                                        </p>
                                    );
                                } else if (item.type === "item") {
                                    // Accumulate bullet items
                                    currentBulletGroup.push(item);
                                }
                            });

                            // Render any remaining bullet items
                            if (currentBulletGroup.length > 0) {
                                elements.push(
                                    <ul key="bullets-final" className="flex flex-col items-start gap-0 list-none pl-0">
                                        {currentBulletGroup.map((bulletItem, bulletIndex) => (
                                            <li
                                                key={bulletIndex}
                                                className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                            >
                                                {bulletItem.text}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }

                            return elements;
                        })()}
                    </div>
                </section>

                {/* Section 2: How We Use Your Information */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        2. How We Use Your Information
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            We use your information to:
                        </p>
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            {usageItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Section 3: How We Share Your Information */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        3. How We Share Your Information
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            We may share your information only with:
                        </p>
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            {sharingPartners.map((partner, index) => (
                                <li
                                    key={index}
                                    className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                >
                                    {partner}
                                </li>
                            ))}
                        </ul>
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            We do not sell or rent your personal information to third parties.
                        </p>
                    </div>
                </section>

                {/* Section 4: Cookies & Tracking Technologies */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="self-stretch font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        4. Cookies &amp; Tracking Technologies
                    </h2>
                    <div className="flex flex-col items-start gap-2 w-full">
                        <p className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal">
                            We use cookies to:
                        </p>
                        <ul className="flex flex-col items-start gap-0 w-full list-none pl-0">
                            {cookieUsageItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal">
                            You can disable cookies in your browser settings, but some features
                            may not function properly.
                        </p>
                    </div>
                </section>

                {/* Section 5: Data Security */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        5. Data Security
                    </h2>
                    <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                        We use industry-standard encryption and security practices to protect
                        your information. However, no system is completely secure, and you use
                        the Platform at your own risk.
                    </p>
                </section>

                {/* Section 6: Data Retention */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="self-stretch font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        6. Data Retention
                    </h2>
                    <div className="flex flex-col items-start gap-2 w-full">
                        <p className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal">
                            We retain your information only as long as necessary to:
                        </p>
                        <ul className="flex flex-col items-start gap-0 w-full list-none pl-0">
                            {retentionItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Section 7: Third-Party Links */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        7. Third-Party Links
                    </h2>
                    <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                        The Platform may contain links to third-party websites. We are not
                        responsible for their privacy practices or content.
                    </p>
                </section>

                {/* Section 8: Your Rights */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="self-stretch font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        8. Your Rights
                    </h2>
                    <div className="flex flex-col items-start gap-2 w-full">
                        <p className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal">
                            You may:
                        </p>
                        <ul className="flex flex-col items-start gap-0 w-full list-none pl-0">
                            {rightsItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="self-stretch font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Section 9: Updates to This Privacy Policy */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        9. Updates to This Privacy Policy
                    </h2>
                    <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                        We may update this policy occasionally. Continued use of our Platform
                        after updates indicates acceptance of the revised policy.
                    </p>
                </section>

                {/* Section 10: Contact Us */}
                <section className="flex flex-col items-start gap-1 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        10. Contact Us
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            For questions or concerns, please contact:
                        </p>
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            Email: hello@meghanafoods.org
                        </p>
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            Phone: +91 00000 00000
                        </p>
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            Address: 119, 12TH B CROSS, 19TH MAIN, JP NAGAR 2ND PHASE, BANGALORE, KARNATAKA - 560078
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
}

