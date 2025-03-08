"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Course } from "@/types/course"
import { BookOpen, CheckCircle, Clock, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Fallback data when no courses are available
const fallbackCourses: Course[] = [
  {
    id: "sample-1",
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning and its applications",
    totalProgress: 75,
    chapters: new Array(12).fill(null).map((_, i) => ({
      id: `ch-${i+1}`,
      title: `Chapter ${i+1}`,
      description: "Chapter description",
      progress: Math.min(100, 75 + Math.floor(Math.random() * 20) - 10),
      subsections: [],
      quiz: { id: `quiz-${i+1}`, questions: [] }
    })),
  },
  {
    id: "sample-2",
    title: "Web Development Basics",
    description: "Introduction to HTML, CSS and JavaScript",
    totalProgress: 45,
    chapters: new Array(10).fill(null).map((_, i) => ({
      id: `ch-${i+1}`,
      title: `Chapter ${i+1}`,
      description: "Chapter description",
      progress: Math.min(100, 45 + Math.floor(Math.random() * 20) - 10),
      subsections: [],
      quiz: { id: `quiz-${i+1}`, questions: [] }
    })),
  },
];

export function CourseProgress() {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [hasUploadedCourse, setHasUploadedCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's uploaded course data in localStorage
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
            
            // Apply progress data if available
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
        
        // Add the mapped course to the beginning of the array
        setCourses([mappedCourse, ...fallbackCourses]);
        setHasUploadedCourse(true);
      } catch (error) {
        console.error("Error parsing stored course data:", error);
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="py-2">Loading course progress...</div>;
  }

  return (
    <div className="space-y-6">
      {courses.slice(0, 3).map((course, index) => (
        <div key={course.id || `course-${index}`} className="rounded-xl border p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">{course.title}</h3>
                {index === 0 && hasUploadedCourse && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{course.description}</p>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm font-medium whitespace-nowrap">
              {course.totalProgress}%
            </div>
          </div>
          
          <Progress value={course.totalProgress} className="h-2 mb-3" />
          
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>{course.chapters.length} Chapters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>
                {course.chapters.filter(c => c.progress === 100).length} / {course.chapters.length} Completed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>~{course.chapters.length * 10} mins</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" asChild className="w-full mt-2">
            <Link href={course.id ? `/learn/course/${course.id}` : "/learn"}>
              Continue Learning
            </Link>
          </Button>
        </div>
      ))}
      
      {!hasUploadedCourse && (
        <div className="text-center p-4 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground text-sm mb-3">
            Upload your first course material to see it here.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/upload">Upload Course</Link>
          </Button>
        </div>
      )}
    </div>
  )
}