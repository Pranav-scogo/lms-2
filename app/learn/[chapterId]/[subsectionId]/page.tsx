"use client"

import { CourseSidebar } from "@/components/course-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { sampleCourse } from "@/data/sample-course"
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function SubsectionPage() {
  const params = useParams()
  const { chapterId, subsectionId } = params

  const chapter = sampleCourse.chapters.find((c) => c.id === chapterId)
  const subsection = chapter?.subsections.find((s) => s.id === subsectionId)
  const subsectionIndex = chapter?.subsections.findIndex((s) => s.id === subsectionId) ?? -1
  const nextSubsectionId = chapter?.subsections[subsectionIndex + 1]?.id
  const prevSubsectionId = chapter?.subsections[subsectionIndex - 1]?.id

  const [isCompleted, setIsCompleted] = useState(false)

  if (!chapter || !subsection) {
    return <div>Section not found</div>
  }

  const handleComplete = () => {
    setIsCompleted(true)
    subsection.completed = true
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CourseSidebar
        course={sampleCourse}
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

