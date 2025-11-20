import { Suspense } from "react";
import OTPForm from "./OTPForm";

export default function OTPPage() {
    return (
        <Suspense
            fallback={
                <section className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36">
                    <div className="text-center text-gray-500">Loading...</div>
                </section>
            }
        >
            <section className="section-container flex items-center justify-center py-12 tablet:py-16 desktop:py-20 bg-white pt-24  tablet:pt-28  desktop:pt-36">
                <OTPForm />
            </section>
        </Suspense>
    );
}
