import { Progress } from "@/components/ui/progress"

const courses = [
  {
    id: 1,
    name: "Machine Learning Fundamentals",
    progress: 75,
    chapters: 12,
    completedChapters: 9,
  },
  {
    id: 2,
    name: "Web Development Basics",
    progress: 45,
    chapters: 10,
    completedChapters: 4,
  },
  {
    id: 3,
    name: "Python Programming",
    progress: 90,
    chapters: 8,
    completedChapters: 7,
  },
]

export function CourseProgress() {
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
    </div>
  )
}

