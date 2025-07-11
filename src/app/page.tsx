"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GeneratePanel } from "@/components/generate-panel"
import { QAPanel } from "@/components/qa-panel"

export default function Home() {
  return (
    <main className="h-screen w-screen flex flex-col font-body"style={{ backgroundImage: 'linear-gradient(to top, #501608, #32115b, rgba(12, 71, 94, 0.9), rgba(57, 255, 20, 0.3))' }}>
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="generate" className="flex-1 flex flex-col">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 flex-1 flex flex-col rounded-none border-none">
          {/*for transparent background change above , with below line*/}
          {/*<Card className="flex-1 flex flex-col rounded-none border-0 bg-transparent">*/}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/0 flex items-center justify-center">
                  <Image src="/icon.png" alt="VISAR Agent Logo" width={35} height={35} style={{ filter: 'drop-shadow(0 0 3px hsl(var(--primary)))' }} data-ai-hint="robot head" />
                </div>
                VISAR Agent 0.1
              </CardTitle>
              <TabsList className="grid grid-cols-2 w-auto h-8 p-0 bg-card">
                <TabsTrigger value="generate" className="h-full rounded-l-md rounded-r-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Generate</TabsTrigger>
                <TabsTrigger value="qa" className="h-full rounded-r-md rounded-l-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Q&amp;A</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <TabsContent value="generate" className="mt-0 flex-1 flex flex-col">
                <GeneratePanel />
              </TabsContent>
              <TabsContent value="qa" className="mt-0 flex-1 flex flex-col">
                <QAPanel />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </main>
  )
}
