"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import delay from "delay"
import { ChevronRight, Loader2 } from "lucide-react"
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
    className?: string,
}

export default function UserProfileTextItem({ userId, fieldName, label, value, className }: UserProfileTextItemProps) {

    const [isPendingTransition1, startTransition1] = useTransition();
    const [isPendingTransition2, startTransition2] = useTransition();
    const [open, setOpen] = useState(false);

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
        await delay(500);
        startTransition1(async () => {
            try {
                if (!form.formState.dirtyFields.userField) {
                    setOpen(false);
                    return
                };

                const formData = new FormData();
                formData.set(fieldName, data.userField.trim());

                await updateUser(userId, formData);

                setOpen(false);

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
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) form.reset();
            }}
        >
            <DialogTrigger asChild>
                <div className={cn("flex items-center py-4 px-4 hover:bg-muted hover:cursor-pointer", className)} >
                    <div className="flex align-top w-full">
                        <div className="w-40 flex-shrink-0 text-sm font-medium leading-none">{label}</div>
                        <div className="w-full pe-4 text-sm leading-none">{value ? value : ""}</div>
                    </div>
                    <ChevronRight className="h-6 w-6 flex-shrink-0 me-2" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="this-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4" autoComplete="off">
                        <FormField
                            control={form.control}
                            name="userField"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={(value === null) || isPendingTransition2}
                        onClick={() => {




                            startTransition2(async () => {
                                try {
                                    await delay(500);
                                    await updateRemoveUser(userId, fieldName);
                                    setOpen(false);
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
                        }}
                    >
                        Remove
                        {isPendingTransition2 && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
                    </Button>
                    <Button
                        type="submit"
                        form="this-form"
                        disabled={form.formState.isSubmitting || !form.formState.dirtyFields.userField || !form.watch("userField")}
                    >
                        Save changes
                        {form.formState.isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}