import { Badge } from "@/components/ui/badge";

interface KeyConceptsProps {
  concepts: string[];
}

export function KeyConcepts({ concepts }: KeyConceptsProps) {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      <h3 className="text-sm font-medium text-muted-foreground">Key Concepts</h3>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, index) => (
          <Badge key={index} variant="outline" className="bg-primary/5 hover:bg-primary/10">
            {concept}
          </Badge>
        ))}
      </div>
    </div>
  );
} 