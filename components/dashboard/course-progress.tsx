"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { ProcessPdfResponse } from "@/types/api"
import { Course } from "@/types/course"

// Fallback data when no courses are available
const fallbackCourses = [
  // {
  //   id: 1,
  //   name: "Machine Learning Fundamentals",
  //   progress: 75,
  //   chapters: 12,
  //   completedChapters: 9,
  // },
  // {
  //   id: 2,
  //   name: "Web Development Basics",
  //   progress: 45,
  //   chapters: 10,
  //   completedChapters: 4,
  // },
  // {
  //   id: 3,
  //   name: "Python Programming",
  //   progress: 90,
  //   chapters: 8,
  //   completedChapters: 7,
  // },
]

// Course interface for generated courses
interface CourseInfo {
  id: number;
  name: string;
  progress: number;
  chapters: number;
  completedChapters: number;
}

export function CourseProgress() {
  const [courses, setCourses] = useState<CourseInfo[]>(fallbackCourses);
  const [hasUploadedCourse, setHasUploadedCourse] = useState(false);

  useEffect(() => {
    // Check if there's course data in localStorage
    const storedData = localStorage.getItem('courseData');
    
    if (storedData) {
      try {
        const courseData = JSON.parse(storedData) as ProcessPdfResponse;
        
        // Create a new course from the uploaded data
        const newCourse: CourseInfo = {
          id: Date.now(), // Use timestamp as unique ID
          name: "Your Uploaded Course",
          progress: 0, // Initial progress is 0%
          chapters: courseData.sections.length,
          completedChapters: 0,
        };
        
        // Add the new course to the top of the list
        setCourses([newCourse, ...fallbackCourses]);
        setHasUploadedCourse(true);
      } catch (error) {
        console.error("Error parsing stored course data:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      {courses.map((course) => (
        <div key={course.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{course.name}</p>
              <p className="text-sm text-muted-foreground">
                {course.completedChapters} of {course.chapters} chapters completed
              </p>
            </div>
            <span className="text-sm font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
      ))}
      
      {!hasUploadedCourse && (
        <div className="text-center p-4 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">
            Upload your first course material on the upload page to see it here.
          </p>
        </div>
      )}
    </div>
  )
}

