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
import { NewPasswordSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-sucess";
import { reset } from "@/actions/reset";
import { FormError } from "../form-error";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import useLoginModel from "@/hooks/userLoginModel";
export const NewPasswordForm: FC = ({}) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const loginModel = useLoginModel();
  useEffect(() => {
    loginModel.onOpen();
  }, []);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
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
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    console.log(values);

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <>
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
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-base py-2">
              <CardWraper
                headerLabel="Enter a new password"
                backButtonlabel="Back to login"
                backButtonHref="/auth/login"
              >
                <div className="relative top-0">
                  <Form {...form}>
                    <form
                      className="space-y-6"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <div className="space-y-4">
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
                                  type="password"
                                  placeholder="* * * * * * * * *"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormSuccess message={success} />
                      <FormError message={error} />
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                      >
                        Reset Password
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardWraper>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
