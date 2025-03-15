"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CourseProgress } from "@/components/dashboard/course-progress"
import { sampleCourse } from "@/data/sample-course"
import { Course } from "@/types/course"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Loader2 } from "lucide-react"
import { FinalQuiz } from "@/components/learning/final-quiz"

export default function FinalQuizPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        // Fallback to sample course
        setCourse(sampleCourse)
      }
    } else {
      // Fallback to sample course
      setCourse(sampleCourse)
    }
    
    setIsLoading(false)
  }, [])

  // Helper function to create module links for the final quiz
  const createModuleLinks = (course: Course) => {
    const moduleLinks: Record<string, { chapterId: string; subsectionId: string }> = {};
    
    course.chapters.forEach(chapter => {
      if (chapter.subsections.length > 0) {
        moduleLinks[chapter.title] = {
          chapterId: chapter.id,
          subsectionId: chapter.subsections[0].id
        };
      }
    });
    
    return moduleLinks;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!course || !course.final_quiz || course.final_quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8">
        <h2 className="text-2xl font-bold mb-4">Final Quiz Not Available</h2>
        <p className="text-muted-foreground text-center mb-8">
          The comprehensive quiz for this course is not available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container max-w-4xl py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">
              Test your knowledge with this comprehensive quiz covering all modules
            </p>
          </div>

          <FinalQuiz 
            questions={course.final_quiz} 
            courseTitle={course.title}
            moduleLinks={createModuleLinks(course)}
          />
        </div>
      </div>
    </div>
  )
} 