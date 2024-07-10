"use client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import * as z from "zod";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import CardWraper from "@/components/auth/card-wraper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";
import { login } from "@/actions/login";
import Link from "next/link";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import useLoginModel from "@/hooks/userLoginModel";
export const LoginForm: FC = ({}: {}) => {
  const loginModel = useLoginModel();
  useEffect(() => {
    loginModel.onOpen();
  }, []);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  const callbackUrl = searchParams.get("callbackUrl");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleChange = () => {
    if (loginModel.isOpen) {
      loginModel.onClose();
    } else {
      loginModel.onClose();
    }
  };
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something Went Wrong"));
    });
  };
  return (
    <Dialog onOpenChange={handleChange} open={loginModel.isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            <Image
              src={"/snake-1.jpg"}
              fill
              alt="Phone image"
              className="object-contain rounded-full "
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="text-base py-2">
            <CardWraper
              headerLabel="Welcome back"
              backButtonlabel="Don't have an account?"
              backButtonHref="/auth/register"
              showSocial
            >
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col space-y-4">
                    {showTwoFactor && (
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Two Factor Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="123456"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {!showTwoFactor && (
                      <div className="flex flex-col gap-6 divide-x divide-gray-100">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
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
                        {
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="*********"
                                    type="password"
                                  />
                                </FormControl>
                                <Button
                                  size={"sm"}
                                  variant={"link"}
                                  asChild
                                  className="px-0 font-normal"
                                >
                                  <Link href={"/auth/reset"}>
                                    Forgot Password?
                                  </Link>
                                </Button>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        }
                      </div>
                    )}
                  </div>
                  <FormError message={error || urlError} />
                  <FormSuccess message={success} />
                  <Button type="submit" disabled={isPending} className="w-full">
                    {showTwoFactor ? "Confirm" : "Login"}
                  </Button>
                </form>
              </Form>
            </CardWraper>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
