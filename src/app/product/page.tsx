import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";
import { auth } from "@/auth";
import ListingCard from "./ListingCard";

const Page = async () => {
  const session = await auth();
  const user = session?.user;
  const ADMIN_EMAIL = "sharma312006@gmail.com";

  if (!session?.user || session?.user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  const orders = await db.order.findMany({
    where: {
      userId: user?.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      configuration: true,
      shippingAddress: true,
    },
  });
  console.log(orders);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div
        className="
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          "
      >
        {/* {orders.map((listing: any) => (
          <ListingCard
            key={listing.id}
            userData={listing.user}
            orderData={listing}
            configData={listing.config}
          />
        ))} */}
        <h1>hello</h1>
      </div>
    </div>
  );
};

export default Page;
