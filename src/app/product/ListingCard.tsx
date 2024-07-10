"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Configuration, Order, User } from "@prisma/client";
import { UserArgs } from "@prisma/client/runtime/library";

interface ListingCardProps {
  orderData: Order;
  userData:User;
  configData:Configuration

  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}
const ListingCard: React.FC<ListingCardProps> = ({
  orderData,
  onAction,
  disabled,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.}
            alt="Listing"
          />
          <div className="absolute top-3 right-3"></div>
        </div>
        <div className="font-semibold text-lg"></div>
        <div className="font-light text-neutral-500"></div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$</div>
        </div>
        {/* {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )} */}
      </div>
    </div>
  );
};

export default ListingCard;
