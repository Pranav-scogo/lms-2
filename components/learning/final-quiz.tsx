import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestion } from "./quiz-question";
import { Button } from "@/components/ui/button";
import { FinalQuizQuestion } from "@/types/course";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface FinalQuizProps {
  questions: FinalQuizQuestion[];
  courseTitle: string;
  // Map of module names to their corresponding chapter IDs and subsection IDs
  moduleLinks: Record<string, { chapterId: string; subsectionId: string }>;
}

export function FinalQuiz({ questions, courseTitle, moduleLinks }: FinalQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate results
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswer = (questionId: number, isCorrect: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
  };

  const correctAnswers = Object.values(answers).filter(Boolean).length;
  const totalAnswered = Object.keys(answers).length;
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  // Convert the moduleLinks record into the format expected by QuizQuestion
  const flatModuleLinks: Record<string, string> = {};
  if (questions[currentQuestion]?.related_modules) {
    questions[currentQuestion].related_modules.forEach(moduleName => {
      if (moduleLinks[moduleName]) {
        const { chapterId, subsectionId } = moduleLinks[moduleName];
        flatModuleLinks[moduleName] = `/learn/${chapterId}/${subsectionId}`;
      }
    });
  }

  if (quizCompleted) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            You've completed the comprehensive quiz for {courseTitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {score}%
              </div>
            </div>
            <h3 className="text-xl font-bold mt-2">
              {score >= 80 ? "Excellent work!" : score >= 60 ? "Good job!" : "Keep practicing!"}
            </h3>
            <p className="text-muted-foreground mt-1">
              You got {correctAnswers} out of {totalAnswered} questions correct
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href={`/learn`}>Review All Modules</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comprehensive Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions[currentQuestion] && (
          <QuizQuestion
            key={questions[currentQuestion].id}
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            correctAnswer={questions[currentQuestion].correctAnswer}
            explanation={questions[currentQuestion].explanation}
            relatedModules={questions[currentQuestion].related_modules}
            moduleLinks={flatModuleLinks}
          />
        )}

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!(currentQuestion in answers)}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 