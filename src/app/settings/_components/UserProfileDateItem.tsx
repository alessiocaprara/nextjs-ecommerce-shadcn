"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn, isValidDate } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parse } from "date-fns"
import delay from "delay"
import { CalendarIcon, ChevronRight, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateUser } from "../actions"

const userProfileDateItemSchema = z.object({
    userField: z.string().refine((value) => isValidDate(value), {
        message: 'Date must be in dd/mm/yyyy format and represent a valid date',
    })
})

type userProfileTextItemValues = z.infer<typeof userProfileDateItemSchema>

interface UserProfileDateItemProps {
    userId: string,
    fieldName: string,
    label: string,
    value: Date | null,
    className?: string,
}

export default function UserProfileDateItem({ userId, fieldName, label, value, className }: UserProfileDateItemProps) {

    const [isPendingTransition, startTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<userProfileTextItemValues>({
        resolver: zodResolver(userProfileDateItemSchema),
        defaultValues: {
            userField: value ? format(value, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')
        },
    });

    useEffect(() => {
        form.reset({
            userField: value ? format(value, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')
        });
    }, [form, value]);

    async function onSubmit(data: userProfileTextItemValues) {
        //await delay(500);
        startTransition(async () => {
            try {
                if (!form.formState.dirtyFields.userField) {
                    setDialogOpen(false);
                    return
                };

                const formData = new FormData();
                formData.set(fieldName, parse(data.userField, "dd/MM/yyyy", new Date()).toISOString());

                await updateUser(userId, formData);

                setDialogOpen(false);

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
            open={dialogOpen}
            onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) form.reset();
            }}
        >

            <DialogTrigger asChild>
                <div className={cn("flex items-center py-4 px-4 hover:bg-muted hover:cursor-pointer", className)} >
                    <div className="flex align-top w-full">
                        <div className="w-40 flex-shrink-0 text-sm font-medium leading-none">{label}</div>
                        <div className="w-full pe-4 text-sm leading-none">{value ? format(value, "PPP") : "<No date provided>"}</div>
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
                    <form id="this-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
                        <FormField
                            control={form.control}
                            name="userField"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{label}</FormLabel>
                                    <Popover>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Input
                                                    {...field}
                                                    placeholder='dd/mm/yyyy'
                                                    className="w-2/3"
                                                />
                                                <PopoverTrigger asChild>
                                                    <Button variant={"ghost"} className="hover:bg-transparent -m-10">
                                                        <CalendarIcon className="h-4 w-4 opacity-50 hover:cursor-pointer" />
                                                    </Button>
                                                </PopoverTrigger>
                                            </div>
                                        </FormControl>
                                        <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={isValidDate(field.value) ? parse(field.value, "dd/MM/yyyy", new Date()) : new Date()}
                                                onSelect={(date) => field.onChange(date ? format(date, "dd/MM/yyyy") : undefined)}
                                                defaultMonth={isValidDate(field.value) ? parse(field.value, "dd/MM/yyyy", new Date()) : new Date()}
                                                required
                                                disabled={(date: Date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                        disabled={form.formState.isSubmitting || !form.formState.dirtyFields.userField}
                    >
                        Save changes
                        {form.formState.isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog >
    )
}