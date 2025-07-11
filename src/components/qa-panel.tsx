"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { answerCodingQuestion } from "@/ai/flows/answer-coding-question"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  question: z.string().min(10, { message: "Question must be at least 10 characters." }),
  existingCode: z.string().optional(),
});

export function QAPanel() {
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      existingCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput("");
    try {
      const result = await answerCodingQuestion(values);
      setOutput(result.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an answer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <div className="gradient-border-container bg-background rounded-md">
                  <Textarea
                    placeholder="Ask a coding question..."
                    className="min-h-[80px] text-sm border-none"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="existingCode"
            render={({ field }) => (
              <FormItem>
                <div className="gradient-border-container bg-background rounded-md">
                  <Textarea
                    placeholder="Provide existing code (optional context)..."
                    className="min-h-[80px] text-sm font-code border-none"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full glowing-btn">
            Ask
          </Button>
        </form>
      </Form>
      <div className="relative mt-4 rounded-md border border-accent/20 bg-background/50">
        <ScrollArea className="h-64">
           {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
             <div className="p-4 text-sm whitespace-pre-wrap">
              {output || "AI answer will appear here..."}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
