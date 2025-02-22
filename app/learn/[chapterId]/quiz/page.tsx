"use client"

import { CourseSidebar } from "@/components/course-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { sampleCourse } from "@/data/sample-course"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ChapterQuizPage() {
  const params = useParams()
  const { chapterId } = params

  const chapter = sampleCourse.chapters.find((c) => c.id === chapterId)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  if (!chapter) {
    return <div>Chapter not found</div>
  }

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < chapter.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === chapter.quiz.questions[index].correctAnswer) {
        correct++
      }
    })
    return (correct / chapter.quiz.questions.length) * 100
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <CourseSidebar course={sampleCourse} currentChapterId={chapterId as string} currentSubsectionId="quiz" />
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

