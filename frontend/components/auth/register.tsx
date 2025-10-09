"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { registerSchema } from "@/schema/Auth";
import GlassyCard from "../GlassyCard";
import UserSvg from "../svgs/user";

export default function RegisterForm() {
  const { register, loading, error, message, initialize, isInitialized } =
    useAuthStore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await register(values.fname, values.lname, values.email, values.phone);
    form.reset();
  }

  return (
    <Card className="w-full h-fit rounded-lg shadow-sm border-gray-200 bg-white pb-0 gap-0">
      <CardHeader className="pb-4">
        <GlassyCard
          className="bg-transparent shadow-none w-full max-w-full py-0 px-0"
          icon={<UserSvg fill="white" />}
          title="GUEST REGISTRATION"
          subtitle="Add new guests and register them in activities"
          subColor="text-gray-600"
          titleColor="text-gray-900"
          iconBgColor="bg-gray-800"
        />
        <hr className="border-gray-200" />
      </CardHeader>
      <CardContent className="pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        disabled={loading}
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        disabled={loading}
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      {...field}
                      disabled={loading}
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      type="tel"
                      {...field}
                      disabled={loading}
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gray-800 text-white hover:bg-gray-900 transition-colors rounded-lg"
              disabled={loading}
            >
              {loading ? "Registering guest..." : "Register Guest"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
