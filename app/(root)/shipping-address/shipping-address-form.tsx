'use client'

import { useToast } from "@/hooks/use-toast";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter()
    const { toast } = useToast()
    // 1. Define your form.
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    })

    const [isPending, startTrasition] = useTransition()
    return (<>Form</>);
}

export default ShippingAddressForm;