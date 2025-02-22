import { cn } from "@/lib/utils"
import type { Course } from "@/types/course"
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface CourseSidebarProps {
  course: Course
  currentChapterId?: string
  currentSubsectionId?: string
}

export function CourseSidebar({ course, currentChapterId, currentSubsectionId }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([currentChapterId || ""])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId],
    )
  }

  return (
    <div className="w-80 h-[calc(100vh-4rem)] border-r flex flex-col bg-muted/30">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="font-semibold text-lg">{course.title}</h2>
        </div>
        <div className="bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${course.totalProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{course.totalProgress}% Complete</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-4">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start p-3 font-medium rounded-lg transition-all",
                  currentChapterId === chapter.id && "bg-accent text-accent-foreground",
                  expandedChapters.includes(chapter.id) && "mb-2",
                )}
                onClick={() => toggleChapter(chapter.id)}
              >
                {expandedChapters.includes(chapter.id) ? (
                  <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                <div className="flex-1 text-left">
                  {chapter.title}
                  <div className="text-xs text-muted-foreground font-normal">{chapter.progress}% Complete</div>
                </div>
              </Button>
              {expandedChapters.includes(chapter.id) && (
                <div className="ml-4 space-y-1">
                  {chapter.subsections.map((subsection) => (
                    <Link
                      key={subsection.id}
                      href={`/learn/${chapter.id}/${subsection.id}`}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-accent/50 transition-all",
                        currentSubsectionId === subsection.id && "bg-accent text-accent-foreground",
                      )}
                    >
                      {subsection.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">{subsection.title}</span>
                    </Link>
                  ))}
                  <Link
                    href={`/learn/${chapter.id}/quiz`}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-accent/50 transition-all",
                      currentSubsectionId === "quiz" && "bg-accent text-accent-foreground",
                    )}
                  >
                    {chapter.progress === 100 ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="truncate">Chapter Quiz</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

