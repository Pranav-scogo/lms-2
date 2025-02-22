"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

const quiz = {
  questions: [
    {
      id: 1,
      question: "What is Machine Learning primarily focused on?",
      options: [
        "Developing hardware systems",
        "Creating static programs",
        "Systems that learn from experience",
        "Manual data entry",
      ],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "Which of these is NOT a type of Machine Learning?",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Manual Learning"],
      correctAnswer: 3,
    },
    {
      id: 3,
      question: "Where can Machine Learning be applied?",
      options: ["Only in healthcare", "Only in finance", "Only in technology companies", "Across multiple industries"],
      correctAnswer: 3,
    },
  ],
}

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correct++
      }
    })
    return (correct / quiz.questions.length) * 100
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Quiz Results</h2>
              <div className="text-4xl font-bold text-primary">{score}%</div>
              <p className="text-muted-foreground">
                You got {Math.round((score / 100) * quiz.questions.length)} out of {quiz.questions.length} questions
                correct
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
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
              <Link href="/dashboard">View Progress</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Question {currentQuestion + 1}</h2>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            <p className="text-lg">{quiz.questions[currentQuestion].question}</p>
            <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]?.toString()}>
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`q${currentQuestion}-${index}`} />
                  <Label htmlFor={`q${currentQuestion}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext} disabled={answers[currentQuestion] === undefined}>
            {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

