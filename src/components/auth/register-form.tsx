"use client";
import { FC, useEffect, useState } from "react";
import * as z from "zod";
import { useTransition } from "react";
import CardWraper from "@/components/auth/card-wraper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";
import { register } from "@/actions/register";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import useRegisterModel from "@/hooks/useRegisterModel";

export const RegisterForm: FC = ({}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const registerModel = useRegisterModel();
  useEffect(() => {
    registerModel.onOpen();
  }, []);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  const handleChange = () => {
    if (registerModel.isOpen) {
      registerModel.onClose();
    } else {
      registerModel.onOpen();
    }
  };
  return (
    <>
      <Dialog onOpenChange={handleChange} open={registerModel.isOpen}>
        <DialogContent className="absolute z-[9999999]">
          <DialogHeader>
            <div className="relative mx-auto w-24 h-24 mb-2">
              <Image
                src={"/snake-1.png"}
                fill
                alt="snake image"
                className="object-contain"
              />
            </div>
            <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
              Register To Continue
            </DialogTitle>
            <DialogDescription className="text-base  py-2">
              <CardWraper
                headerLabel="Create an account"
                backButtonlabel="Already have an account?"
                backButtonHref="/auth/login"
                showSocial
              >
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="">Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                type="text"
                                placeholder="Abhishek Sharma"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left">Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                type="email"
                                placeholder="abhisekexample@gmail.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left">
                              Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="*********"
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      Create an account
                    </Button>
                  </form>
                </Form>
              </CardWraper>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
