"use client"

import { CourseSidebar } from "@/components/course-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { sampleCourse } from "@/data/sample-course"
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProcessPdfResponse } from "@/types/api"
import { mapApiResponseToCourse } from "@/lib/course-mapper"
import { Course } from "@/types/course"

export default function ChapterQuizPage() {
  const params = useParams()
  const router = useRouter()
  const { chapterId } = params

  const [course, setCourse] = useState<Course>(sampleCourse)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

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

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (chapter && currentQuestion < chapter.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      
      // Update chapter progress when quiz is completed
      if (chapter) {
        chapter.progress = 100;
        
        // Update the total progress of the course
        const chaptersCount = course.chapters.length;
        const completedProgress = course.chapters.reduce((sum, ch) => sum + ch.progress, 0);
        course.totalProgress = Math.round(completedProgress / chaptersCount);
        
        // Save the updated progress to localStorage
        const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        progressData[chapter.id] = { progress: 100 };
        progressData.totalProgress = course.totalProgress;
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
      }
    }
  }

  const calculateScore = () => {
    if (!chapter) return 0;
    
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === chapter.quiz.questions[index].correctAnswer) {
        correct++
      }
    })
    return (correct / chapter.quiz.questions.length) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8">
        <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
        <p className="text-muted-foreground text-center mb-8">
          The chapter you're looking for doesn't exist or hasn't been created yet.
        </p>
        <Button asChild>
          <Link href="/learn">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  if (!chapter.quiz || chapter.quiz.questions.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <CourseSidebar course={course} currentChapterId={chapterId as string} currentSubsectionId="quiz" />
        <div className="flex-1 overflow-auto bg-muted/10">
          <div className="container max-w-3xl py-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">No Quiz Available</h2>
              <p className="text-muted-foreground">This chapter doesn't have any quiz questions yet.</p>
              <Button asChild className="mt-4">
                <Link href={`/learn/${chapterId}`}>Back to Chapter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CourseSidebar course={course} currentChapterId={chapterId as string} currentSubsectionId="quiz" />
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="container max-w-3xl py-12">
          {showResults ? (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Quiz Results</h2>
                <p className="text-muted-foreground">Chapter: {chapter.title}</p>
              </div>

              <Card className="overflow-hidden">
                <div className="bg-muted p-6 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-background mb-4">
                    <span className="text-3xl font-bold text-primary">{calculateScore()}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You got {Math.round((calculateScore() / 100) * chapter.quiz.questions.length)} out of{" "}
                    {chapter.quiz.questions.length} questions correct
                  </p>
                </div>

                <CardContent className="p-6 space-y-4">
                  {chapter.quiz.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={cn(
                        "p-4 rounded-lg",
                        answers[index] === question.correctAnswer
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {answers[index] === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1" />
                        )}
                        <div>
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="flex justify-center gap-4 p-6 bg-muted/50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestion(0)
                      setAnswers([])
                      setShowResults(false)
                    }}
                  >
                    Try Again
                  </Button>
                  <Button asChild>
                    <Link href="/learn">Back to Chapters</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Chapter Quiz</h2>
                <Progress value={(currentQuestion / chapter.quiz.questions.length) * 100} className="w-[200px]" />
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuestion + 1} of {chapter.quiz.questions.length}
                      </span>
                      <p className="text-xl font-medium">{chapter.quiz.questions[currentQuestion].question}</p>
                    </div>

                    <RadioGroup
                      onValueChange={handleAnswer}
                      value={answers[currentQuestion]?.toString()}
                      className="space-y-3"
                    >
                      {chapter.quiz.questions[currentQuestion].options.map((option, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all",
                            answers[currentQuestion] === index
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50",
                          )}
                          onClick={() => handleAnswer(index.toString())}
                        >
                          <RadioGroupItem value={index.toString()} id={`q${currentQuestion}-${index}`} />
                          <Label htmlFor={`q${currentQuestion}-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 bg-muted/50">
                  <Button onClick={handleNext} disabled={answers[currentQuestion] === undefined} size="lg">
                    {currentQuestion === chapter.quiz.questions.length - 1 ? (
                      <>
                        Finish Quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

