"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function LoginModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            <Image
              src={"/snake-1.jpg"}
              fill
              alt="snake image"
              className="object-contain rounded-lg"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Link
            href={"/auth/login"}
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
          <Link
            href={"/auth/register"}
            className={buttonVariants({ variant: "default" })}
          >
            Sign Up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
