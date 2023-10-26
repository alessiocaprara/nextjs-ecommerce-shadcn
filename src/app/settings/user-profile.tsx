import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png"
import { Separator } from "@/components/ui/separator"
import { User } from "@prisma/client"
import Image from "next/image"
import UserProfileItem from "./user-profile-item"

export default function UserProfile({ user }: { user: User }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center py-3 px-1 hover:bg-muted hover:cursor-pointer rounded-t-lg">
                <div className="w-1/4 flex-shrink-0 text-sm font-medium leading-none">Profile picture</div>
                <div className="w-full text-sm">A profile picture helps personalize your account</div>
                <Image
                    src={user.image || profilePicPlaceholder}
                    style={{ objectFit: "cover" }}
                    width={80}
                    height={80}
                    alt="preview image"
                    className="rounded-full h-16 w-16"
                />
            </div>
            <Separator />
            <UserProfileItem userId={user.id} label="Name" value={user.username || ""} />
            <Separator />
            <UserProfileItem userId={user.id} label="Birthday" value={user.bio || ""} />
            <Separator />
            <UserProfileItem userId={user.id} label="Gender" value={"Dummy Gender" || ""} />
        </div>
    )
}