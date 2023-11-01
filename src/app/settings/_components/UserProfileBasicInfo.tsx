import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png"
import { User } from "@prisma/client"
import Image from "next/image"
import UserProfileDateItem from "./UserProfileDateItem"
import UserProfileSelectItem from "./UserProfileSelectItem"
import UserProfileTextItem from "./UserProfileTextItem"

const genders = [
    { label: "Female", value: "f" },
    { label: "Male", value: "m" },
    { label: "Rather not say", value: "n" },
]

export default function UserProfileBasicInfo({ user }: { user: User }) {
    return (
        <div className="flex flex-col border rounded-xl">

            <div className="px-4 pt-4 pb-6">
                <div className="text-lg font-medium">Basic info</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>

            <div className="flex items-center py-3 px-4 hover:bg-muted hover:cursor-pointer">
                <div className="flex align-top w-full">
                    <div className="w-40 flex-shrink-0 text-sm font-medium leading-none">Profile picture</div>
                    <div className="w-full pe-4 text-sm leading-none">A profile picture helps personalize your account</div>
                </div>
                <Image
                    src={user.image || profilePicPlaceholder}
                    style={{ objectFit: "cover" }}
                    width={80}
                    height={80}
                    alt="preview image"
                    className="rounded-full h-16 w-16 flex-shrink-0 border border-black"
                />
            </div>

            <UserProfileTextItem userId={user.id} label="Username" fieldName="username" value={user.username} />
            <UserProfileDateItem userId={user.id} label="Date of birth" fieldName="dob" value={user.dob} />
            <UserProfileSelectItem userId={user.id} label="Gender" fieldName="gender" possibileValues={genders} currentValue={user.gender} className="rounded-b-xl" />

        </div>
    )
}