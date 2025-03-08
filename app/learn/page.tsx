"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sampleCourse } from "@/data/sample-course"
import { ArrowRight, BookOpen, Info, Award, Layers, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { Course } from "@/types/course"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LearnPage() {
  const [course, setCourse] = useState<Course>(sampleCourse)
  const [hasUploadedCourse, setHasUploadedCourse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasFinalQuiz, setHasFinalQuiz] = useState(false)

  useEffect(() => {
    // Check if there's uploaded course data in localStorage
    const storedData = localStorage.getItem('courseData')
    
    if (storedData) {
      try {
        const apiResponse = JSON.parse(storedData) as ProcessPdfResponse
        const mappedCourse = mapApiResponseToCourse(apiResponse)
        setCourse(mappedCourse)
        setHasUploadedCourse(true)
        
        // Check if there's a final quiz
        if (apiResponse.final_quiz && apiResponse.final_quiz.length > 0) {
          setHasFinalQuiz(true)
        }
      } catch (error) {
        console.error("Error parsing stored course data:", error)
      }
    }
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading course content...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        {hasUploadedCourse && (
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Course is Ready</AlertTitle>
            <AlertDescription>
              We've processed your PDF and created the course content below.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Learning</h1>
            <p className="text-muted-foreground">Explore and continue your courses</p>
          </div>
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/upload" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Create New Course
              </Link>
            </Button>
            
            {hasFinalQuiz && (
              <Button asChild variant="outline">
                <Link href="/learn/quiz" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Take Final Quiz</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {course.chapters.map((chapter, index) => (
            <Card key={chapter.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    Chapter {index + 1}
                  </Badge>
                  {chapter.quiz && chapter.quiz.questions.length > 0 && (
                    <Button size="sm" variant="ghost" asChild className="h-8 px-2">
                      <Link href={`/learn/${chapter.id}/quiz`} className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        <span className="text-xs">Chapter Quiz</span>
                      </Link>
                    </Button>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{chapter.title}</CardTitle>
                <CardDescription className="line-clamp-2 h-10">{chapter.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{chapter.progress}%</span>
                  </div>
                  <Progress value={chapter.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{chapter.subsections.length} Sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{chapter.subsections.length * 5} mins</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/10">
                <div className="space-y-2 w-full">
                  {chapter.subsections.map((subsection, idx) => (
                    <Link
                      key={subsection.id}
                      href={`/learn/${chapter.id}/${subsection.id}`}
                      className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-muted w-full"
                    >
                      <span>
                        {idx + 1}. {subsection.title}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}

          {course.chapters.length === 0 && (
            <div className="text-center p-12 bg-muted/40 rounded-lg">
              <p className="text-muted-foreground">
                No chapters found. Upload course material on the upload page to start learning.
              </p>
              <Button asChild className="mt-4">
                <Link href="/upload">Upload Course</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

