"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ProcessPdfResponse, QuizQuestion } from "@/types/api"

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  questions: Question[];
}

// Fallback quiz in case no uploaded quiz is available
const fallbackQuiz: Quiz = {
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
  const [quiz, setQuiz] = useState<Quiz>(fallbackQuiz)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if there's uploaded course data in localStorage
    const storedData = localStorage.getItem('courseData')
    
    if (storedData) {
      try {
        const apiResponse = JSON.parse(storedData) as ProcessPdfResponse
        
        // Use the final quiz from the API response
        if (apiResponse.final_quiz && apiResponse.final_quiz.length > 0) {
          const formattedQuestions = apiResponse.final_quiz.map((q, index) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }));
          
          setQuiz({ questions: formattedQuestions });
        }
      } catch (error) {
        console.error("Error parsing stored course data:", error)
      }
    }
    
    setIsLoading(false)
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <div className="text-center">
          <p>Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <div className="container py-8 max-w-2xl">
          <Card className="shadow-md">
            <CardContent className="pt-8 pb-6">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Quiz Results</h2>
                <div className="text-5xl font-bold text-primary">{score}%</div>
                <p className="text-muted-foreground">
                  You got {Math.round((score / 100) * quiz.questions.length)} out of {quiz.questions.length} questions
                  correct
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pb-6">
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
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <div className=" py-8 max-w-2xl">
     
          <CardContent className="pt-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Question {currentQuestion + 1}</h2>
                <span className="text-sm text-muted-foreground">
                  {currentQuestion + 1} of {quiz.questions.length}
                </span>
              </div>
              <p className="text-lg text-left font-medium my-6">{quiz.questions[currentQuestion].question}</p>
              <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]?.toString()} className="flex flex-col items-left space-y-4">
                {quiz.questions[currentQuestion].options.map((option: string, index: number) => (
                  <div key={index} className="flex items-left space-x-3 w-full max-w-md p-2 rounded-md hover:bg-slate-50">
                    <RadioGroupItem value={index.toString()} id={`q${currentQuestion}-${index}`} />
                    <Label htmlFor={`q${currentQuestion}-${index}`} className="cursor-pointer w-full">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4 pb-6">
            <Button 
              onClick={handleNext} 
              disabled={answers[currentQuestion] === undefined}
              className="px-6"
            >
              {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
  
      </div>
    </div>
  )
}

