"use server"

import { prisma } from "@/lib/db/prisma-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";

export async function updateUser(userId: string, data: FormData) {

    const username: string | null = data.get("username") as string;
    const bio: string | null = data.get("bio") as string;
    const profilePic: File | null = data.get("file") as unknown as File;

    console.log("userId: " + userId);
    console.log("username: " + username);
    console.log("bio:" + bio);
    console.log("profilePic: " + profilePic);

    if ((username === null) && (bio === null) && (profilePic === null)) return;

    let profilePicDestinationPath: string | undefined = undefined;
    if (profilePic) {
        const bytes = await profilePic.arrayBuffer();
        const buffer = Buffer.from(bytes);
        profilePicDestinationPath = "/uploads/profile-pictures/" + userId + ".png";
        await sharp(buffer)
            .resize(500, 500, { withoutEnlargement: true })
            .toFile("./public" + profilePicDestinationPath);
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            username: (username === null) ? undefined : username,
            bio: (bio === null) ? undefined : bio,
            // bio: "a",
            image: (profilePic === null)
                ? undefined
                : process.env.SERVER_URL! + profilePicDestinationPath! + "?lastupdated=" + Date.now(),
        }
    })

    revalidatePath("/settings");
    //redirect("/settings");

}