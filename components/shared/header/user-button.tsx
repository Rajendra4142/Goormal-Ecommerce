import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";
import { UserIcon } from "lucide-react";
import Link from "next/link";
const UserButton = async () => {
    const session = await auth()
    if (!session) {
        return (<Button asChild>
            <Link href="/sign-in">
                <UserIcon />Sign In
            </Link>
        </Button>)
    }
    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? ''

    return <div className="flex gap-2 items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                    <Button className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200" variant='ghost' >
                        {firstInitial}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium">
                            {session.user?.name}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm text-muted-foreground">
                            {session.user?.email}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem className="p-0 mb-1">
                    <form action={signOutUser} className="w-full">
                        <Button className="w-full py-4 h-4 justify-start" variant='ghost'>Sign Out</Button>
                    </form>

                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    </div>;
}

export default UserButton;