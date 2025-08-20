"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { fetchWithThrow } from "@/lib/fetcher";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const route = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetchWithThrow("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("admin-profile", JSON.stringify(result));
        toast.success("Login successful!");
        route.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message ?? "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-[#cbd5df] text-black hover:bg-[cbd5df] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isLoading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
