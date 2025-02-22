import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    progress: 75,
    duration: "2h 30m",
    lessons: 12,
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    progress: 45,
    duration: "1h 45m",
    lessons: 8,
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    progress: 90,
    duration: "3h 15m",
    lessons: 15,
  },
]

export default function CourseList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle className="text-lg">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{course.lessons} lessons</span>
                <span>{course.duration}</span>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/courses/${course.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

