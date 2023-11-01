"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import delay from "delay"
import { ChevronRight, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateUser } from "../actions"

const userProfileSelectItemSchema = z.object({
    userField: z.string()
})

type userProfileSelectItemValues = z.infer<typeof userProfileSelectItemSchema>

interface UserProfileSelectItemProps {
    userId: string,
    fieldName: string,
    label: string,
    possibileValues: { label: string, value: string }[],
    currentValue: string | null,
    className?: string,
}

export default function UserProfileSelectItem({ userId, fieldName, label, possibileValues, currentValue, className }: UserProfileSelectItemProps) {

    currentValue = possibileValues.find((item) => item.value === currentValue) ? currentValue : null

    const [isPendingTransition, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const form = useForm<userProfileSelectItemValues>({
        resolver: zodResolver(userProfileSelectItemSchema),
        defaultValues: {
            userField: currentValue || undefined
        },
    });

    useEffect(() => {
        form.reset({
            userField: currentValue || undefined
        });
    }, [form, currentValue]);

    async function onSubmit(data: userProfileSelectItemValues) {
        //await delay(500);
        startTransition(async () => {
            try {
                if (!form.formState.dirtyFields.userField) {
                    setOpen(false);
                    return;
                };

                const formData = new FormData();
                formData.set(fieldName, data.userField);

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
                        <div className="w-full pe-4 text-sm leading-none">{possibileValues.find((item) => item.value === currentValue)?.label || "<No gender provided>"}</div>
                    </div>
                    <ChevronRight className="h-6 w-6 flex-shrink-0 me-2" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
                </DialogHeader>

                <Form {...form} >
                    <form id="this-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
                        <FormField
                            control={form.control}
                            name="userField"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Select defaultValue={field.value || undefined} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={`Select a ${label.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="f">Female</SelectItem>
                                                    <SelectItem value="m">Male</SelectItem>
                                                    <SelectItem value="n">Rather not say</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

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