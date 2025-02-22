"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUp, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const [stage, setStage] = useState<"upload" | "processing" | "error" | "complete">("upload")
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const simulateFileProcessing = () => {
    setStage("processing")
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setProgress(progress)
      if (progress === 100) {
        clearInterval(interval)
        setStage("complete")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    }, 200)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        setStage("error")
        return
      }
      simulateFileProcessing()
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-muted-foreground">
              Upload your PDF and we&apos;ll convert it into an interactive learning experience
            </p>
          </div>

          <Card className="relative">
            {stage === "error" && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Please upload a valid PDF file.</AlertDescription>
              </Alert>
            )}

            <div className="p-12">
              {stage === "upload" && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative group cursor-pointer w-full">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      accept=".pdf"
                    />
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 transition-colors group-hover:border-primary">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <FileUp className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium mb-1">Drop your PDF here</p>
                          <p className="text-sm text-muted-foreground">or click to browse (max 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage === "processing" && (
                <div className="space-y-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <svg className="h-16 w-16 rotate-[-90deg]" viewBox="0 0 100 100">
                        <circle
                          className="stroke-muted-foreground/25"
                          strokeWidth="8"
                          fill="none"
                          r="38"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="stroke-primary transition-all duration-300"
                          strokeWidth="8"
                          fill="none"
                          r="38"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${progress * 2.4} 240`}
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-1">Processing your document</p>
                      <p className="text-sm text-muted-foreground">This might take a few moments...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="space-y-2 pt-4">
                    {progress >= 30 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Extracting content...</span>
                      </div>
                    )}
                    {progress >= 60 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Generating quiz questions...</span>
                      </div>
                    )}
                    {progress >= 90 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Finalizing course structure...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {stage === "complete" && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-1">Processing Complete!</p>
                    <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

