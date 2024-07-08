"use client";
import { FC, useState } from "react";
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
import { ResetSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-sucess";
import { reset } from "@/actions/reset";
import { FormError } from "../form-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
export const ResetForm: FC = ({}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    console.log(values);

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <Dialog open={true}>
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
            Reset Your Password Using Email
          </DialogTitle>
          <DialogDescription className="text-base py-2">
            <CardWraper
              headerLabel="Forgot your password?"
              backButtonlabel="Back to login"
              backButtonHref="/auth/login"
            >
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-4">
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
                  </div>

                  <FormSuccess message={success} />
                  <FormError message={error} />
                  <Button type="submit" disabled={isPending} className="w-full">
                    Send Reset Email
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
