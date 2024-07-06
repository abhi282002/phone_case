"use client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { LoginForm } from "./login-form";
import { useState } from "react";
import useLoginModel from "@/hooks/userLoginModel";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  mode = "redirect",
  asChild,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const loginModel = useLoginModel();
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
    loginModel.onOpen();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
