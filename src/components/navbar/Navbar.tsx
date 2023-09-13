import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCart } from "@/lib/db/cart";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MainNav } from "../homepage/main-nav";
import { Search } from "../homepage/search";
import TeamSwitcher from "../homepage/team-switcher";
import { UserNav } from "../homepage/user-nav";
import { CartNav } from "../homepage/cart-nav";

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

        <div className="hidden flex-col md:flex">

            {/* This is the Navbar */}
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <TeamSwitcher />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        <CartNav cart={cart} />
                        <UserNav session={session} />
                    </div>
                </div>
            </div>


        </div>


    )
}