"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sampleCourse } from "@/data/sample-course"
import { ArrowRight, BookOpen, Info, Award, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Course } from "@/types/course"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFinalQuiz, setHasFinalQuiz] = useState(false);

  useEffect(() => {
    // First check if it's the sample course
    if (courseId === sampleCourse.id) {
      setCourse(sampleCourse);
      setIsLoading(false);
      return;
    }
    
    // Otherwise check localStorage for the uploaded course
    const storedData = localStorage.getItem('courseData');
    const progressData = localStorage.getItem('courseProgress');
    
    if (storedData) {
      try {
        const apiResponse = JSON.parse(storedData) as ProcessPdfResponse;
        const mappedCourse = mapApiResponseToCourse(apiResponse);
        
        // Update progress if available
        if (progressData) {
          try {
            const progress = JSON.parse(progressData);
            
            // Apply progress data to course if available
            if (progress.totalProgress) {
              mappedCourse.totalProgress = progress.totalProgress;
            }
            
            // Update individual chapter progress
            mappedCourse.chapters.forEach(chapter => {
              if (progress[chapter.id] && progress[chapter.id].progress) {
                chapter.progress = progress[chapter.id].progress;
              }
            });
          } catch (error) {
            console.error("Error parsing progress data:", error);
          }
        }
        
        setCourse(mappedCourse);
        
        // Check if there's a final quiz
        if (apiResponse.final_quiz && apiResponse.final_quiz.length > 0) {
          setHasFinalQuiz(true);
        }
      } catch (error) {
        console.error("Error parsing stored course data:", error);
      }
    }
    
    setIsLoading(false);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/learn">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/learn">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{course.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
          </div>
          
          {hasFinalQuiz && (
            <Button asChild variant="outline">
              <Link href="/learn/quiz" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Take Final Quiz</span>
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{course.totalProgress}% Complete</span>
          </div>
          <Progress value={course.totalProgress} className="h-2.5" />
        </div>

        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <Card key={chapter.id} className={chapter.progress === 100 ? "border-primary/40 shadow-sm" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  {chapter.progress === 100 && <CheckCircle className="h-4 w-4 text-primary" />}
                  <h3 className="font-semibold">{chapter.title}</h3>
                </div>
                <Progress value={chapter.progress} className="w-[100px]" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                <div className="space-y-2">
                  {chapter.subsections.map((subsection, index) => (
                    <Link
                      key={subsection.id}
                      href={`/learn/${chapter.id}/${subsection.id}`}
                      className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-muted group"
                    >
                      <span className="flex items-center gap-2">
                        {subsection.completed ? 
                          <CheckCircle className="h-3.5 w-3.5 text-primary" /> : 
                          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                        }
                        <span>
                          {index + 1}. {subsection.title}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {chapter.quiz && chapter.quiz.questions.length > 0 && (
                    <Link
                      href={`/learn/${chapter.id}/quiz`}
                      className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-muted group"
                    >
                      <span className="flex items-center gap-2">
                        {chapter.progress === 100 ? 
                          <CheckCircle className="h-3.5 w-3.5 text-primary" /> : 
                          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                        }
                        <span>Chapter Quiz</span>
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {course.chapters.length === 0 && (
            <div className="text-center p-6 bg-muted/40 rounded-lg">
              <p className="text-muted-foreground">
                No chapters found. Upload course material on the upload page to start learning.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/learn">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 