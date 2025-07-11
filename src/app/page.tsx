"use client"

import { Bot } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GeneratePanel } from "@/components/generate-panel"
import { TranslatePanel } from "@/components/translate-panel"
import { QAPanel } from "@/components/qa-panel"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background font-body">
      <div className="w-full max-w-md mx-auto">
        <Tabs defaultValue="generate" className="w-full">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" style={{ filter: 'drop-shadow(0 0 3px hsl(var(--primary)))' }} />
                </div>
                VISAR Agent 001
              </CardTitle>
              <TabsList className="grid grid-cols-3 w-auto h-8 p-0 bg-card">
                <TabsTrigger value="generate" className="h-full rounded-l-md rounded-r-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Generate</TabsTrigger>
                <TabsTrigger value="translate" className="h-full rounded-none border-x border-primary/50 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Translate</TabsTrigger>
                <TabsTrigger value="qa" className="h-full rounded-r-md rounded-l-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Q&amp;A</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="generate" className="mt-0">
                <GeneratePanel />
              </TabsContent>
              <TabsContent value="translate" className="mt-0">
                <TranslatePanel />
              </TabsContent>
              <TabsContent value="qa" className="mt-0">
                <QAPanel />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </main>
  )
}
