"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { generateCodeSnippet } from "@/ai/flows/generate-code-snippet"
import { languages } from "@/lib/languages"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CodeOutput } from "./code-output"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
  language: z.string({ required_error: "Please select a language." }),
});

export function GeneratePanel() {
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      language: "javascript",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput("");
    try {
      const result = await generateCodeSnippet(values);
      setOutput(result.code);
    } catch (error) {
      console.error("Error generating code snippet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate code snippet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <div className="gradient-border-container bg-background rounded-md">
                  <Textarea
                    placeholder="Describe the code you want to generate..."
                    className="min-h-[100px] text-sm border-none"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="glowing-btn">
              Generate
            </Button>
          </div>
        </form>
      </Form>
      <CodeOutput code={output} isLoading={isLoading} language={form.watch('language')} className="flex-1 mt-4" />
    </div>
  );
}
