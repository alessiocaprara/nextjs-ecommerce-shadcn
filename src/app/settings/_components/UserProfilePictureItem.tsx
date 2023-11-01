"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateRemoveUser, updateUser } from "../actions"

const userProfileTextItemSchema = z.object({
    userField: z.string()
})

type userProfileTextItemValues = z.infer<typeof userProfileTextItemSchema>

interface UserProfileTextItemProps {
    userId: string,
    fieldName: string,
    label: string,
    value: string | null,
    onClose: () => void,
    className?: string,
}

export default function UserProfilePictureItem({ userId, fieldName, value, onClose, className }: UserProfileTextItemProps) {

    const [isPendingTransition1, startTransition1] = useTransition();
    const [isPendingTransition2, startTransition2] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<userProfileTextItemValues>({
        resolver: zodResolver(userProfileTextItemSchema),
        defaultValues: {
            userField: (value === null) ? "" : value
        },
    });

    useEffect(() => {
        form.reset({
            userField: (value === null) ? "" : value
        });
    }, [form, value]);

    async function onSubmit(data: userProfileTextItemValues) {
        startTransition1(async () => {
            try {
                if (!form.formState.dirtyFields.userField) return;
                const formData = new FormData();
                formData.set(fieldName, data.userField.trim());
                await updateUser(userId, formData);
                onClose();
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
        <div className="px-4 space-y-8">
            <div className="flex pb-4">
                <div className="w-full flex flex-col">
                    <div className="flex items-center text-lg font-medium -ms-2">
                        <ArrowLeft className="opacity-80 hover:cursor-pointer hover:bg-muted rounded-full p-1" size={30} onClick={() => onClose()} />
                        Edit profile
                    </div>
                    <div className="text-sm text-muted-foreground">Make changes to your profile here. Click save when you are done.</div>
                </div>
            </div>



        </div >
    )
}