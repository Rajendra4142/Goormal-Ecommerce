import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CredentialsSignInForm from "./credentials-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Sign In'

}


const SignInPage = async () => {
    const session = await auth()
    if (session) {
        return redirect('/')
    }

    return (<div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-10">
                <Link href='/' className="flex-center">
                    <Image src='/images/logo.svg' width={100} height={100} alt="logo" priority={true} />
                </Link>
                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">Sign in to your Account</CardDescription>

            </CardHeader>
            <CardContent>
                <CredentialsSignInForm></CredentialsSignInForm>
            </CardContent>

        </Card>
    </div>);

}

export default SignInPage;