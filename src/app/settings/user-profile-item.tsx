"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import delay from "delay"
import { ChevronRight, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateUser } from "./actions"
import { toast } from "@/components/ui/use-toast"

const userProfileItemSchema = z.object({
    campoGenerico: z.string()
})

type userProfileItemValues = z.infer<typeof userProfileItemSchema>

interface UserProfileItemProps {
    userId: string,
    label: string,
    value: string,
}

export default function UserProfileItem({ userId, label, value }: UserProfileItemProps) {

    const [isPendingTransition, startTransition] = useTransition();
    const [showDialog, setShowDialog] = useState(false);

    const form = useForm<userProfileItemValues>({
        resolver: zodResolver(userProfileItemSchema),
        defaultValues: {
            campoGenerico: value
        },
    })

    async function onSubmit(data: userProfileItemValues) {
        await delay(1000);
        startTransition(async () => {
            try {
                if (!form.formState.dirtyFields.campoGenerico) {
                    alert("not touched")
                    return
                };

                const formData = new FormData();
                formData.set(label, data.campoGenerico);

                await updateUser(userId, formData);

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
        <Dialog>

            <DialogTrigger asChild>
                <div className="flex items-center py-3 px-1 hover:bg-muted hover:cursor-pointer" >
                    <div className="flex align-top w-full">
                        <div className="w-1/4 flex-shrink-0 text-sm font-medium leading-none">{label}</div>
                        <div className="w-full text-sm leading-none">{value}</div>
                    </div>
                    <ChevronRight className="h-6 w-6 flex-shrink-0 me-2" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form id="this-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="campoGenerico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="this-form"
                        disabled={form.formState.isSubmitting}
                    >
                        Save changes
                        {form.formState.isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >


    )
}