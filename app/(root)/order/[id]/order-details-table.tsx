'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { createPayPalOrder, approvePaypalOrder, updateOrderToPaidCOD, deliverOrder } from "@/lib/actions/order.actions";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";


const OrderDetailsTable = ({ order, paypalClientId, isAdmin }: { order: Omit<Order, 'paymentResult'>, paypalClientId: string, isAdmin: boolean }) => {
    const {
        id,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        orderItem


    } = order

    const { fullName, city, streetAddress, postalCode, country } = shippingAddress
    const { toast } = useToast()

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer()
        let status = ''
        if (isPending) {
            status = 'Loading PayPal...'
        } else if (isRejected) {
            status = 'Error Loading PayPal'
        }
        return status
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order.id)
        console.log("PayPal Order Response:", res);
        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message
            })
        }
        return res.data
    }

    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePaypalOrder(order.id, data)
        toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message
        })
    }

    // button to mark order to paid
    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition()
        const { toast } = useToast()
        return (
            <Button
                type='button'
                disabled={isPending}
                onClick={() => startTransition(async () => {
                    const res = await updateOrderToPaidCOD(order.id)
                    toast({
                        variant: res.success ? 'default' : 'destructive',
                        description: res.message
                    })
                })}>{isPending ? 'processing...' : 'Mark as Paid'}
            </Button>
        )

    }
    // button to mark order as delivered
    const MarkAsDeliveredButton = () => {
        const [isPending, startTransition] = useTransition()
        const { toast } = useToast()
        return (
            <Button
                type='button'
                disabled={isPending}
                onClick={() => startTransition(async () => {
                    const res = await deliverOrder(order.id)
                    toast({
                        variant: res.success ? 'default' : 'destructive',
                        description: res.message
                    })
                })}>{isPending ? 'processing...' : 'Mark as Delivered'}
            </Button>
        )
    }
    return (<>
        <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
            <div className="col-span-2 space-y-4 overflow-x-auto">
                <Card className="my-2">
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Payment Method</h2>
                        <p className="mb-2">{paymentMethod}</p>
                        {isPaid ? (
                            <Badge variant='secondary' >
                                Paid at {formatDateTime(paidAt!).dateTime}
                            </Badge>
                        ) : (<Badge variant='destructive' >Not Paid</Badge>)}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Shipping Address</h2>
                        <p>{fullName}</p>
                        <p className="mb-2">{streetAddress}, {city}
                            {postalCode}, {country}
                        </p>
                        {isDelivered ? (
                            <Badge variant='secondary' >
                                Delivered at {formatDateTime(paidAt!).dateTime}
                            </Badge>
                        ) : (<Badge variant='destructive' >Not Delivered</Badge>)}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Order Items</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderItem.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/product/{item.slug}`} className="flex items-center">
                                                <Image src={item.image} height={50} width={50} alt={item.name}></Image>
                                                <span className="px-2">{item.name}</span>
                                            </Link>

                                        </TableCell>
                                        <TableCell>
                                            <p>{item.qty}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{item.price}</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Items</div>
                            <div>{formatCurrency(itemsPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Tax</div>
                            <div>{formatCurrency(taxPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Shipping Price</div>
                            <div>{formatCurrency(shippingPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Total</div>
                            <div>{formatCurrency(totalPrice)}</div>
                        </div>
                        {/* {paypalpayment} */}
                        {!isPaid && paymentMethod == 'Paypal' && (
                            <div>
                                <PayPalScriptProvider options={{
                                    clientId: paypalClientId
                                }}
                                >
                                    <PrintLoadingState />
                                    <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                                </PayPalScriptProvider>
                            </div>
                        )}
                        {/* cash on delivery */}
                        {
                            isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                                < MarkAsPaidButton />
                            )
                        }
                        {
                            isAdmin && isPaid && !isDelivered && (
                                <MarkAsDeliveredButton />
                            )
                        }
                    </CardContent>
                </Card>

            </div>

        </div>

    </>);
}

export default OrderDetailsTable;