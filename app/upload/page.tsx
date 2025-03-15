"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUp, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { processPdf } from "@/lib/api"
import { ProcessPdfResponse } from "@/types/api"

export default function UploadPage() {
  const [stage, setStage] = useState<"upload" | "processing" | "error" | "complete">("upload")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        setStage("error")
        setErrorMessage("Please upload a valid PDF file.")
        return
      }

      try {
        setStage("processing")
        // Start with initial progress to show something is happening
        setProgress(10)
        
        // Process the PDF with the backend API
        const result = await processPdf(file)
        
        // Store the result in localStorage for use in the dashboard and learn pages
        localStorage.setItem('courseData', JSON.stringify(result))
        
        // Update progress to complete
        setProgress(100)
        setStage("complete")
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/learn")
        }, 1000)
      } catch (error) {
        console.error("Error processing PDF:", error)
        setStage("error")
        setErrorMessage(error instanceof Error ? error.message : "Failed to process the PDF. Please try again.")
      }
    }
  }

  // Use useEffect to update progress during processing
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (stage === "processing" && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 5) + 1
          const newProgress = Math.min(prev + increment, 90)
          return newProgress
        })
      }, 500)
    }
    
    // Clean up the interval when component unmounts or stage changes
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [stage, progress])

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-muted/10 py-16">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Create New Course
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your PDF and we&apos;ll convert it into an interactive learning experience
            </p>
          </div>

          <Card className="relative border-2 shadow-lg">
            {stage === "error" && (
              <Alert variant="destructive" className="mb-6 mx-6 mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{errorMessage || "Please upload a valid PDF file."}</AlertDescription>
              </Alert>
            )}

            <div className="p-8 md:p-12">
              {stage === "upload" && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative group cursor-pointer w-full">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                      accept=".pdf"
                    />
                    <div className="border-3 border-dashed border-muted-foreground/20 rounded-xl p-12 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/[0.02]">
                      <div className="flex flex-col items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                          <FileUp className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold">Drop your PDF here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse <span className="text-primary">(max 10MB)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage === "processing" && (
                <div className="space-y-10 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      </div>
                      <svg className="h-24 w-24 rotate-[-90deg]" viewBox="0 0 100 100">
                        <circle
                          className="stroke-muted-foreground/15"
                          strokeWidth="6"
                          fill="none"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="stroke-primary transition-all duration-500 ease-in-out"
                          strokeWidth="6"
                          fill="none"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${progress * 2.51} 251`}
                        />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-semibold">Processing your document</p>
                      <p className="text-sm text-muted-foreground">This might take a few moments...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span className="text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="space-y-3 pt-2">
                    {progress >= 30 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center transition-opacity duration-500 opacity-100">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Extracting content...</span>
                      </div>
                    )}
                    {progress >= 60 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center transition-opacity duration-500 opacity-100">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Generating quiz questions...</span>
                      </div>
                    )}
                    {progress >= 90 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center transition-opacity duration-500 opacity-100">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Finalizing course structure...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {stage === "complete" && (
                <div className="flex flex-col items-center gap-6 text-center py-4">
                  <div className="p-5 bg-primary/10 rounded-full animate-bounce">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-primary">Processing Complete!</p>
                    <p className="text-sm text-muted-foreground">Redirecting to your Course...</p>
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

