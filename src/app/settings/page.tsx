import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db/prisma-client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UserProfileForm from "./profile-form";

export default async function SettingsProfilePage() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/settings");
    }

    const authenticatedUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!authenticatedUser) {
        redirect("/api/auth/signin?callbackUrl=/settings");
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">This is how others will see you on the site</p>
            </div>
            <Separator />
            <UserProfileForm user={authenticatedUser} />
        </div>
    )
}