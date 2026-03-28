import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface AiHumanScoreProps {
  sections: { heading: string; content: string }[];
}

function analyzeContent(sections: { content: string }[]) {
  const allText = sections.map((s) => s.content).join(" ");
  const sentences = allText.split(/[.!?]+/).filter((s) => s.trim().length > 5);

  // Sentence length variation
  const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
  const variance = lengths.reduce((a, l) => a + Math.pow(l - avgLen, 2), 0) / (lengths.length || 1);
  const sentenceVariation = Math.min(100, Math.round(Math.sqrt(variance) * 8));

  // Tone diversity (unique starting words / total)
  const starters = sentences.map((s) => s.trim().split(/\s+/)[0]?.toLowerCase());
  const uniqueStarters = new Set(starters).size;
  const toneDiversity = Math.min(100, Math.round((uniqueStarters / (starters.length || 1)) * 120));

  // Transition words count
  const transitions = ["however", "moreover", "furthermore", "additionally", "consequently", "therefore", "meanwhile", "nevertheless", "although", "despite"];
  const transitionCount = transitions.reduce((c, t) => c + (allText.toLowerCase().split(t).length - 1), 0);
  const transitionScore = Math.min(100, transitionCount * 12);

  // Human-like score (higher = more human)
  const humanScore = Math.min(100, Math.round((sentenceVariation * 0.35 + toneDiversity * 0.35 + transitionScore * 0.3)));
  const aiScore = 100 - humanScore;

  return { humanScore, aiScore, sentenceVariation, toneDiversity, transitionScore };
}

export function AiHumanScore({ sections }: AiHumanScoreProps) {
  const { humanScore, aiScore, sentenceVariation, toneDiversity, transitionScore } = analyzeContent(sections);

  const metrics = [
    { label: "Sentence Variation", value: sentenceVariation, desc: "Diversity in sentence lengths" },
    { label: "Tone Diversity", value: toneDiversity, desc: "Variety of sentence starters and phrasing" },
    { label: "Transition Usage", value: transitionScore, desc: "Natural flow between ideas" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" /> AI vs Human Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-warning"><Bot className="h-3 w-3" /> AI-like {aiScore}%</span>
            <span className="flex items-center gap-1 text-success"><User className="h-3 w-3" /> Human-like {humanScore}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-warning/70 rounded-l-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${humanScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-success/70 rounded-r-full"
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary-foreground">{m.label}</span>
                <Badge variant={m.value >= 60 ? "success" : m.value >= 35 ? "warning" : "destructive"} className="text-[10px]">
                  {m.value}%
                </Badge>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full bg-primary/60"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
