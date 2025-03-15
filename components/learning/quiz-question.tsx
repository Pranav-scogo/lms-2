import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Info, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  relatedModules?: string[];
  moduleLinks?: Record<string, string>; // Map of module names to their URLs
}

export function QuizQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  relatedModules,
  moduleLinks = {}
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const isCorrect = selectedOption === correctAnswer;

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsAnswered(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <h3 className="font-medium">{question}</h3>
        
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => !isAnswered && setSelectedOption(parseInt(value))}
          className="space-y-2"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 border rounded-md transition-colors ${
                isAnswered
                  ? index === correctAnswer
                    ? "border-green-500 bg-green-50"
                    : index === selectedOption
                    ? "border-red-500 bg-red-50"
                    : "opacity-70"
                  : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                disabled={isAnswered}
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer"
              >
                {option}
              </Label>
              {isAnswered && index === correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswered && index === selectedOption && index !== correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </div>

      {!isAnswered ? (
        <Button onClick={handleSubmit} disabled={selectedOption === null}>
          Submit Answer
        </Button>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-md ${isCorrect ? "bg-green-50" : "bg-amber-50"}`}>
            <div className="flex items-start gap-2">
              <Info className={`h-5 w-5 mt-0.5 ${isCorrect ? "text-green-500" : "text-amber-500"}`} />
              <div className="space-y-2">
                <p className="font-medium">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
              </div>
            </div>
          </div>

          {relatedModules && relatedModules.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Related Modules:</p>
              <div className="flex flex-wrap gap-2">
                {relatedModules.map((module, index) => (
                  moduleLinks[module] ? (
                    <Link href={moduleLinks[module]} key={index}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1">
                        {module}
                        <ArrowRight className="h-3 w-3" />
                      </Badge>
                    </Link>
                  ) : (
                    <Badge key={index} variant="secondary">
                      {module}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleReset} variant="outline">
            Try Another Question
          </Button>
        </div>
      )}
    </div>
  );
} 