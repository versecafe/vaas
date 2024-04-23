"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/shiny-button";
import { trackEvent } from "@/lib/events";

const tokenFormSchema = z.object({
  token: z.string().length(24, {
    message: "Token must be exactly 24 characters.",
  }),
});

type TokenFormValues = z.infer<typeof tokenFormSchema>;

export function TokenForm({
  onFormSubmit,
}: {
  onFormSubmit: (token: string) => void;
}) {
  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: TokenFormValues) {
    trackEvent({ name: "set_token" });
    onFormSubmit(data.token);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Input placeholder="token here" {...field} defaultValue={""} />
              </FormControl>
              <FormDescription>
                This is your Vercel Token for accessing the Vercel API. You can
                generate a token here:{" "}
                <Link
                  href="https://vercel.com/account/tokens"
                  className="text-gray-50"
                >
                  Vercel Account Tokens
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ShinyButton type="submit">Set token</ShinyButton>
      </form>
    </Form>
  );
}
