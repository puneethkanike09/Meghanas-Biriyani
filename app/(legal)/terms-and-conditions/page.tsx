export default function TermsAndConditionsPage() {
    return (
        <section className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36">
            <div className="flex flex-col max-w-[1090px] mx-auto items-start gap-12">
                <section className="flex flex-col items-start gap-2 w-full">
                    <p className="w-full font-normal text-midnight text-base tracking-[0] leading-normal">
                        Welcome to Meghana Foods. By accessing or using our website, mobile application, or any online services (&quot;Platform&quot;), you agree to the following Terms &amp; Conditions. Please read them carefully.
                    </p>
                </section>

                {/* Section 1: Introduction */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        1. Introduction
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            Meghana Foods (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides online ordering, delivery, and pickup services. These Terms govern your use of our Platform and any orders placed through it.
                        </p>

                    </div>
                </section>

                {/* Section 2: Eligibility */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        2. Eligibility
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            You must be at least 18 years old to place an order on our Platform. By using our services, you confirm that the information you provide is accurate and complete.
                        </p>

                    </div>
                </section>

                {/* Section 3: Ordering & Payments */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        3. Ordering &amp; Payments
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Orders once placed cannot be modified after confirmation.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                You are responsible for ensuring your delivery address and contact details are accurate.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Payments must be made using the payment methods available on the Platform.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                In case of payment failure, the order will not be processed.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 4: Delivery & Pickup */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        4. Delivery &amp; Pickup
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Delivery timelines are estimates and may vary due to traffic, weather, or operational constraints.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                If the delivery address is incorrect or unreachable, the order may be cancelled or marked as delivered.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Pickup orders must be collected from the selected outlet during the given time slot.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 5: Cancellation & Refunds */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        5. Cancellation &amp; Refunds
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Cancellations are only allowed before the restaurant confirms the order.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Refunds, if applicable, will be processed as per our refund policy and may take 5-7 business days.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                No refunds will be issued for orders cancelled due to incorrect address, unreachable customer, or non-availability at the delivery location.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 6: Menu & Pricing */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        6. Menu &amp; Pricing
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Prices, menu items, and offers may vary across outlets and may change without prior notice.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                All prices are inclusive/exclusive of taxes as mentioned on the Platform.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 7: User Responsibilities */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        7. User Responsibilities
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            You agree not to:
                        </p>
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Misuse the Platform or attempt unauthorized access.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Use the Platform for fraudulent transactions.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Copy, distribute, or modify any content without permission.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 8: Intellectual Property */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        8. Intellectual Property
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            All content on the Platform—including logos, images, menus, and software—is owned by Meghana Foods. No part may be reproduced without written permission.
                        </p>
                    </div>
                </section>

                {/* Section 9: Limitation of Liability */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        9. Limitation of Liability
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            Meghana Foods is not liable for:
                        </p>
                        <ul className="flex flex-col items-start gap-0 list-none pl-0">
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Delays in delivery due to unforeseen circumstances.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Service interruptions caused by technical issues.
                            </li>
                            <li className="font-normal text-midnight text-base tracking-[0] leading-normal pl-6 relative before:content-['•'] before:absolute before:left-2">
                                Any loss, damage, or injury arising from misuse of our services.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 10: Changes to Terms */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        10. Changes to Terms
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <p className="font-normal text-midnight text-base tracking-[0] leading-normal">
                            We may update these Terms from time to time. Continued use of the Platform after changes means you accept the updated Terms.
                        </p>

                    </div>
                </section>

                {/* Section 11: Contact Us */}
                <section className="flex flex-col items-start gap-2 w-full">
                    <h2 className="font-semibold text-midnight text-xl tracking-[0] leading-normal">
                        11. Contact Us
                    </h2>
                    <div className="flex flex-col items-start gap-1">
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
                            Address: 119, 12TH B CROSS, 19TH MAIN, J P NAGAR 2ND PHASE, BANGALORE, KARNATAKA - 560078
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
}

