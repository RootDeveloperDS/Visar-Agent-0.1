"use client"

import { useState } from "react";
import { Check, Clipboard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CodeOutputProps {
  code: string;
  isLoading: boolean;
  className?: string;
  language?: string;
}

export function CodeOutput({ code, isLoading, className, language }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "The code has been copied to your clipboard.",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        duration: 2000,
      });
    }
  };

  return (
    <div className={cn("relative mt-4 rounded-md border border-accent/20 bg-background/50", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground disabled:opacity-50 z-10"
              onClick={handleCopy}
              aria-label="Copy code"
              disabled={isLoading || !code}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ScrollArea className="h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <pre className="p-4 overflow-auto h-full">
            <code className={`font-code text-sm ${language ? `language-${language}` : ''}`}>
              {code || "AI output will appear here..."}
            </code>
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
