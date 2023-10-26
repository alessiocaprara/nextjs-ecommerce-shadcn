import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCart } from "@/lib/db/cart";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserNav } from "./UserNav";
import { CartNav } from "./CartNav";
import { MainNav } from "./MainNav";
import { Search } from "./homepage/search";
import TeamSwitcher from "./homepage/team-switcher";

async function searchProducts(formData: FormData) {
    "use server";
    const searchQuery = formData.get("searchQuery")?.toString();
    if (searchQuery) {
        redirect("/search?query=" + searchQuery)
    }
}

export default async function Navbar() {

    const session = await getServerSession(authOptions);
    const cart = await getCart();

    return (

        <div className="hidden flex-col md:flex"> {/* hidden until "md" (todo: implement mobile responsiveness) */}

            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <TeamSwitcher /> {/* This component will be removed, here only as example */}
                    <MainNav className="mx-6" /> {/* Main nav links */}
                    <div className="ml-auto flex items-center space-x-4">
                        <Search /> {/* This component could be removed, here only as example */}
                        <CartNav cart={cart} />
                        <UserNav user={session?.user as User} />
                    </div>
                </div>
            </div>

        </div>

    )
}