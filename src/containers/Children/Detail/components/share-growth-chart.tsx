"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import toast from "react-hot-toast";
import { Child } from "@/containers/Dashboard/Children/components/IChild";

// Validation schema
const formSchema = z.object({
  childId: z.number(),
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(250, "Topic must not exceed 250 characters"),
  question: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(250, "Question must not exceed 250 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ShareGrowthChart({ child }: { child: Child }) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childId: child.id,
      topic: "",
      question: "",
    },
  });

  async function onSubmit(data: FormData) {
    const result = await axios.post(`${BASE_URL}/growthchart/create`, data);

    if (result.data.isSuccessed) {
      toast.success("Growth chart created successfully");
      setOpen(false);
      form.reset();
      window.location.href = `/growth-chart/${result.data.resultObj.id}`;
    } else {
      toast.success(result.data.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share Growth Chart</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Growth Chart for {child.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-40"
                      placeholder="Enter your question"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
