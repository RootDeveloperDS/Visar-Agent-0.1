"use client"

import { useState } from "react";
import { Check, Clipboard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CodeOutputProps {
  code: string;
  isLoading: boolean;
  className?: string;
  language?: string;
}

export function CodeOutput({ code, isLoading, className, language }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative mt-4 rounded-md border border-accent/20 bg-background/50", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground disabled:opacity-50"
        onClick={handleCopy}
        aria-label="Copy code"
        disabled={isLoading || !code}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
      </Button>
      <ScrollArea className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <pre className="p-4">
            <code className={`font-code text-sm ${language ? `language-${language}` : ''}`}>
              {code || "AI output will appear here..."}
            </code>
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
