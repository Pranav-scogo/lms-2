"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Course } from "@/types/course"
import { sampleCourse } from "@/data/sample-course"
import { Loader2, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProgressPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUploadedCourse, setHasUploadedCourse] = useState(false)

  useEffect(() => {
    // Check if there's uploaded course data in localStorage
    const storedData = localStorage.getItem('courseData')
    const progressData = localStorage.getItem('courseProgress')
    
    if (storedData) {
      try {
        const apiResponse = JSON.parse(storedData) as ProcessPdfResponse
        const mappedCourse = mapApiResponseToCourse(apiResponse)
        
        // Update progress if available
        if (progressData) {
          try {
            const progress = JSON.parse(progressData)
            
            // Apply progress data to course if available
            if (progress.totalProgress) {
              mappedCourse.totalProgress = progress.totalProgress
            }
            
            // Update individual chapter progress
            mappedCourse.chapters.forEach(chapter => {
              if (progress[chapter.id] && progress[chapter.id].progress) {
                chapter.progress = progress[chapter.id].progress
              }
            })
          } catch (error) {
            console.error("Error parsing progress data:", error)
          }
        }
        
        setCourse(mappedCourse)
        setHasUploadedCourse(true)
      } catch (error) {
        console.error("Error parsing stored course data:", error)
      }
    } else {
      // If no uploaded course, show the sample course
      setCourse(sampleCourse)
    }
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading progress data...</span>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Course Data Available</h1>
        <p className="text-muted-foreground mb-8">
          You haven't started any courses yet. Upload a PDF to begin your learning journey.
        </p>
        <Button asChild>
          <Link href="/upload">Upload Course</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Progress</h1>
          <p className="text-muted-foreground">
            Track your learning progress across all chapters and sections
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <span>{course.title}</span>
              <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                {course.totalProgress}% Complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${course.totalProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{course.totalProgress}%</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      {chapter.progress === 100 && (
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      )}
                      {chapter.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {chapter.progress}% Complete
                    </span>
                  </div>
                  
                  <Progress value={chapter.progress} className="h-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                    {chapter.subsections.map((subsection) => (
                      <div key={subsection.id} className="flex items-center text-sm">
                        {subsection.completed ? (
                          <CheckCircle className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                        ) : (
                          <div className="h-3 w-3 border border-muted-foreground/30 rounded-full mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{subsection.title}</span>
                      </div>
                    ))}
                    <div className="flex items-center text-sm">
                      {chapter.progress === 100 ? (
                        <CheckCircle className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                      ) : (
                        <div className="h-3 w-3 border border-muted-foreground/30 rounded-full mr-2 flex-shrink-0" />
                      )}
                      <span>Chapter Quiz</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/learn/${chapter.id}`} className="text-xs">
                        Continue Learning
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {hasUploadedCourse && (
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/upload">Upload Another Course</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 