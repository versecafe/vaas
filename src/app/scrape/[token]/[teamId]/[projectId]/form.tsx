"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShinyButton } from "@/components/shiny-button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { VaasFormats } from "@/lib/vaas/core";

const analyticsOptionsFormSchema = z.object({
  timeZone: z
    .string()
    .min(6, {
      message: "Time zone must be at least 2 characters.",
    })
    .max(40, {
      message: "Time zone must not be longer than 40 characters.",
    }),
  range: z.object({
    from: z.date({
      required_error: "Start of range for the data.",
    }),
    to: z.date({
      required_error: "End of range for the data.",
    }),
  }),
  environment: z.enum(["production", "preview", "all"]),
  format: z.enum(["json", "csv", "xml", "yaml", "toml"]),
  filters: z.string().max(1024).min(2),
});

export type AnalyticsOptionsFormValues = z.infer<
  typeof analyticsOptionsFormSchema
>;

// This can come from your database or API.
const defaultValues: Partial<AnalyticsOptionsFormValues> = {
  timeZone: "America/New_York",
  range: {
    from: addDays(new Date(), -30),
    to: new Date(),
  },
  environment: "production",
  format: "json",
  filters: "{}",
};

export function AnalyticsOptionsForm({
  onFormSubmit,
}: {
  onFormSubmit: (opetions: AnalyticsOptionsFormValues) => void;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const form = useForm<AnalyticsOptionsFormValues>({
    resolver: zodResolver(analyticsOptionsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: AnalyticsOptionsFormValues) {
    onFormSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <FormControl>
                <Input placeholder="America/New_York" {...field} />
              </FormControl>
              <FormDescription>
                The time zone to use for notating date changes and times.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="range"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>From</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " border border-neutral-200  pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(range) => {
                      setDate(range);
                      field.onChange(range);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Used to select the range of data to pull from the API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="environment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Environment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a environment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                  <SelectItem value="all">All Environments</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a environment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="toml">TOML</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filters</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Apply a custom filter JSON to the data."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is under development, a filter of &#123;&#125; will return
                all data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ShinyButton type="submit">Get Analytics</ShinyButton>
      </form>
    </Form>
  );
}
