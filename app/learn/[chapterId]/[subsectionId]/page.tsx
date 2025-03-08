"use client"

import { CourseSidebar } from "@/components/course-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { sampleCourse } from "@/data/sample-course"
import { ArrowRight, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Course } from "@/types/course"

export default function SubsectionPage() {
  const params = useParams()
  const router = useRouter()
  const { chapterId, subsectionId } = params

  const [course, setCourse] = useState<Course>(sampleCourse)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Check if there's uploaded course data in localStorage
    const storedData = localStorage.getItem('courseData')
    
    if (storedData) {
      try {
        const apiResponse = JSON.parse(storedData) as ProcessPdfResponse
        const mappedCourse = mapApiResponseToCourse(apiResponse)
        setCourse(mappedCourse)
      } catch (error) {
        console.error("Error parsing stored course data:", error)
      }
    }
    
    setIsLoading(false)
  }, [])

  const chapter = course.chapters.find((c) => c.id === chapterId)
  const subsection = chapter?.subsections.find((s) => s.id === subsectionId)
  const subsectionIndex = chapter?.subsections.findIndex((s) => s.id === subsectionId) ?? -1
  const nextSubsectionId = chapter?.subsections[subsectionIndex + 1]?.id
  const prevSubsectionId = chapter?.subsections[subsectionIndex - 1]?.id

  useEffect(() => {
    if (subsection) {
      setIsCompleted(subsection.completed)
    }
  }, [subsection])

  const handleComplete = () => {
    setIsCompleted(true)
    
    if (subsection) {
      subsection.completed = true;
      
      // Update the progress of the chapter
      if (chapter) {
        const completedCount = chapter.subsections.filter(s => s.completed).length;
        const totalCount = chapter.subsections.length;
        chapter.progress = Math.round((completedCount / totalCount) * 100);
        
        // Update the total progress of the course
        const totalCompleted = course.chapters.reduce((acc, chapter) => {
          return acc + chapter.subsections.filter(s => s.completed).length;
        }, 0);
        
        const totalSubsections = course.chapters.reduce((acc, chapter) => {
          return acc + chapter.subsections.length;
        }, 0);
        
        course.totalProgress = Math.round((totalCompleted / totalSubsections) * 100);
        
        // Save the updated course data back to localStorage
        localStorage.setItem('courseProgress', JSON.stringify({
          chapters: course.chapters.map(c => ({
            id: c.id,
            progress: c.progress,
            subsections: c.subsections.map(s => ({
              id: s.id,
              completed: s.completed
            }))
          })),
          totalProgress: course.totalProgress
        }));
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!chapter || !subsection) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8">
        <h2 className="text-2xl font-bold mb-4">Section not found</h2>
        <p className="text-muted-foreground text-center mb-8">
          The chapter or section you're looking for doesn't exist or hasn't been created yet.
        </p>
        <Button asChild>
          <Link href="/learn">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CourseSidebar
        course={course}
        currentChapterId={chapterId as string}
        currentSubsectionId={subsectionId as string}
      />
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="container max-w-3xl py-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{subsection.title}</h1>
              {isCompleted && (
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            <Card className="p-8 prose prose-slate max-w-none">
              {subsection.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </Card>

            <div className="flex items-center justify-between pt-4">
              <div className="flex-1">
                {prevSubsectionId && (
                  <Button variant="ghost" asChild>
                    <Link href={`/learn/${chapterId}/${prevSubsectionId}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous Section
                    </Link>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {!isCompleted && (
                  <Button onClick={handleComplete} variant="outline">
                    Mark as Complete
                  </Button>
                )}

                {nextSubsectionId ? (
                  <Button asChild>
                    <Link href={`/learn/${chapterId}/${nextSubsectionId}`}>
                      Next Section
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={`/learn/${chapterId}/quiz`}>
                      Take Chapter Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

