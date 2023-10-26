"use client"

import profilePicPlaceholder from "@/assets/profile-pic-placeholder.png"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import delay from "delay"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateUser } from "./actions"

const userProfileFormSchema = z.object({
    username: z
        .union([
            z.string().length(0, { message: "Username must be longer than 4 characters and less than 30" }),
            z.string().min(4).max(30),
        ]),
    bio: z
        .union([
            z.string().length(0, { message: "Bio must be longer than 4 characters and less than 160" }),
            z.string().min(4).max(160),
        ]),
    image: z
        .any()
        .optional(),
})

type UserProfileFormValues = z.infer<typeof userProfileFormSchema>

export default function UserProfileForm({ user }: { user: User }) {

    const [isPendingTransition, startTransition] = useTransition();
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
    const [imagePreviewIsDirty, setImagePreviewIsDirty] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = new FileReader;
        file.onload = function () {
            setImagePreview(file.result);
            setImagePreviewIsDirty(true);
        }
        file.readAsDataURL(acceptedFiles[0])
    }, [])
    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const form = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileFormSchema),
        defaultValues: {
            username: user.username || "",
            bio: user.bio || "",
        },
        mode: "onSubmit",
    })

    useEffect(() => {
        form.reset({
            username: user.username || "",
            bio: user.bio || "",
        });
        setImagePreview(null);
        setImagePreviewIsDirty(false);
    }, [form, user]);

    async function onSubmit(data: UserProfileFormValues) {
        //await delay(1000); // server latency simulation
        startTransition(async () => {
            try {
                if (!form.formState.dirtyFields.username &&
                    !form.formState.dirtyFields.bio &&
                    !(imagePreviewIsDirty)) return;

                const formData = new FormData();
                if (form.formState.dirtyFields.username) formData.set("username", data.username);
                if (form.formState.dirtyFields.bio) formData.set("bio", data.bio);
                if (imagePreviewIsDirty && acceptedFiles.length > 0) formData.set("file", acceptedFiles[0]);

                await updateUser(user.id, formData);

                toast({
                    variant: "confirmation",
                    description: "Profile successfully updated."
                })
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: (error as Error).message
                })
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile picture</FormLabel>
                            <FormControl>
                                <div className="flex gap-3 items-end">
                                    <div {...getRootProps()}>
                                        <Input
                                            {...getInputProps()}
                                            {...field}
                                        />
                                        <Image
                                            src={imagePreview?.toString() || user.image || profilePicPlaceholder}
                                            style={{ objectFit: "cover" }}
                                            width={80}
                                            height={80}
                                            alt="preview image"
                                            className="rounded-md h-20 w-20"
                                        />
                                    </div>
                                    {isDragActive ?
                                        <p className="text-xs text-muted-foreground">Drop the files!</p> :
                                        <p className="text-xs text-muted-foreground">Drag and drop or click to select.</p>
                                    }
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Username</FormLabel>
                            <FormControl className={form.getFieldState("username").isDirty ? "bg-muted" : ""}>
                                <Input {...field} />
                            </FormControl>
                            {/* <FormDescription>This is your...</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl className={form.getFieldState("bio").isDirty ? "bg-muted" : ""}>
                                <Textarea className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting} >
                    Update profile
                    {form.formState.isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
                </Button>

            </form>
        </Form>
    )
}