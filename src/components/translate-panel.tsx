"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { translateCodeSnippet } from "@/ai/flows/translate-code-snippet"
import { languages } from "@/lib/languages"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CodeOutput } from "./code-output"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight } from "lucide-react"

const formSchema = z.object({
  codeSnippet: z.string().min(1, { message: "Please enter code to translate." }),
  sourceLanguage: z.string({ required_error: "Please select a source language." }),
  targetLanguage: z.string({ required_error: "Please select a target language." }),
});

export function TranslatePanel() {
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeSnippet: "",
      sourceLanguage: "javascript",
      targetLanguage: "python",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput("");
    try {
      const result = await translateCodeSnippet(values);
      setOutput(result.translatedCode);
    } catch (error) {
      console.error("Error translating code snippet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to translate code snippet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 flex flex-col flex-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1">
          <FormField
            control={form.control}
            name="codeSnippet"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <div className="gradient-border-container bg-background rounded-md flex-1 flex">
                  <Textarea
                    placeholder="Enter code to translate..."
                    className="min-h-[100px] text-sm font-code border-none flex-1"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="sourceLanguage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
             <FormField
              control={form.control}
              name="targetLanguage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full glowing-btn">
            Translate
          </Button>
        </form>
      </Form>
      <CodeOutput code={output} isLoading={isLoading} language={form.watch('targetLanguage')} className="flex-1 flex flex-col" />
    </div>
  );
}
