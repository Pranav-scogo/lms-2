import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sampleCourse } from "@/data/sample-course"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export default function LearnPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{sampleCourse.title}</h1>
            <p className="text-muted-foreground">{sampleCourse.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {sampleCourse.chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold">{chapter.title}</h3>
                <Progress value={chapter.progress} className="w-[100px]" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                <div className="space-y-2">
                  {chapter.subsections.map((subsection, index) => (
                    <Link
                      key={subsection.id}
                      href={`/learn/${chapter.id}/${subsection.id}`}
                      className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-muted"
                    >
                      <span>
                        {index + 1}. {subsection.title}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                  <Link
                    href={`/learn/${chapter.id}/quiz`}
                    className="flex items-center justify-between p-2 text-sm rounded-lg hover:bg-muted"
                  >
                    <span>Chapter Quiz</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

