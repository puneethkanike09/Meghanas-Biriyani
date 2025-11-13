import type { ReactNode } from "react";
import ProfileLayoutClient from "./components/ProfileLayoutClient";

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return <ProfileLayoutClient>{children}</ProfileLayoutClient>;
}

