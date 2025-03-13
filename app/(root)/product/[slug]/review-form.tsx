// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ReviewFormDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ReviewForm = ({ userId, productId, onReviewSubmitted }: {
    userId: string;
    productId: string;
    onReviewSubmitted?: () => void
}) => {

    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: ReviewFormDefaultValues
    })
    const handleOpenForm = () => {
        setOpen(true)
    }

    return (<Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={handleOpenForm} variant='default'>
            Write a review
        </Button>
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <form method="POST">
                    <DialogHeader>
                        <DialogTitle>Write a review</DialogTitle>
                        <DialogDescription>Share your thoughts with other customers</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter Title' {...field} />
                                    </FormControl>
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Enter Description' {...field} />
                                    </FormControl>
                                </FormItem>

                            )}

                        />
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? field.value.toString() : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a rating">
                                                    {field.value ? (
                                                        <div className="flex items-center gap-2">
                                                            <span>{field.value}</span>
                                                            {Array.from({ length: field.value }).map((_, i) => (
                                                                <StarIcon key={i} className="w-4 h-4 text-yellow-500" />
                                                            ))}
                                                        </div>
                                                    ) : "Select a rating"}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const stars = Array(index + 1).fill(0); // Creates array based on rating

                                                return (
                                                    <SelectItem key={index} value={(index + 1).toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{index + 1}</span>
                                                            {stars.map((_, starIndex) => (
                                                                <StarIcon key={starIndex} className="w-4 h-4 text-yellow-500" />
                                                            ))}
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                    </div>
                    <DialogFooter>
                        <Button type="submit" size='lg' className='w-full'
                            disabled={form.formState.isSubmitting}
                        >
                            {
                                form.formState.isSubmitting ? 'Submitting...' : 'Submit'
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog >);
}

export default ReviewForm;