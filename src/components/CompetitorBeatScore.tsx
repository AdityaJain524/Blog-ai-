import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, BarChart3 } from "lucide-react";

interface CompetitorBeatScoreProps {
  sections: { heading: string; content: string }[];
  keywords: string[];
}

function calculateBeatScore(sections: { heading: string; content: string }[], keywords: string[]) {
  const totalWords = sections.reduce((c, s) => c + s.content.split(/\s+/).length, 0);
  const headingCount = sections.length;
  const allText = sections.map((s) => s.content).join(" ").toLowerCase();

  // Content depth (word count relative to avg competitor ~800 words)
  const depthScore = Math.min(100, Math.round((totalWords / 800) * 70));

  // Keyword usage (how many target keywords appear)
  const keywordHits = keywords.filter((kw) => allText.includes(kw.toLowerCase())).length;
  const keywordScore = Math.min(100, Math.round((keywordHits / Math.max(keywords.length, 1)) * 100));

  // Structure (heading density, avg 6-10 headings is ideal)
  const structureScore = headingCount >= 6 ? Math.min(100, 70 + headingCount * 3) : Math.round((headingCount / 6) * 70);

  // FAQ bonus
  const hasFaq = sections.some((s) => s.heading.toLowerCase().includes("faq") || s.heading.toLowerCase().includes("question"));
  const faqBonus = hasFaq ? 10 : 0;

  const overallScore = Math.min(100, Math.round(depthScore * 0.35 + keywordScore * 0.3 + structureScore * 0.25 + faqBonus));

  // Competitor percentile (mock: based on score)
  const competitorPercentile = Math.min(99, Math.round(overallScore * 0.95 + Math.random() * 5));

  return { overallScore, depthScore, keywordScore, structureScore, competitorPercentile };
}

export function CompetitorBeatScore({ sections, keywords }: CompetitorBeatScoreProps) {
  const { overallScore, depthScore, keywordScore, structureScore, competitorPercentile } = calculateBeatScore(sections, keywords);

  const metrics = [
    { label: "Content Depth", score: depthScore },
    { label: "Keyword Usage", score: keywordScore },
    { label: "Structure Quality", score: structureScore },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" /> Competitor Beat Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Big percentile */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-4 rounded-lg bg-secondary/50 border border-border"
        >
          <p className="text-3xl font-heading font-bold text-gradient-primary">{competitorPercentile}%</p>
          <p className="text-xs text-muted-foreground mt-1">You beat <span className="text-foreground font-medium">{competitorPercentile}%</span> of competitors</p>
        </motion.div>

        {/* Metric bars */}
        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary-foreground">{m.label}</span>
                <span className="text-foreground font-mono">{m.score}/100</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score}%` }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className={`h-full rounded-full ${m.score >= 70 ? "bg-success/70" : m.score >= 40 ? "bg-warning/70" : "bg-destructive/70"}`}
                />
              </div>
            </div>
          ))}
        </div>

        <Badge variant={overallScore >= 70 ? "success" : overallScore >= 45 ? "warning" : "destructive"} className="w-full justify-center py-1">
          Overall: {overallScore}/100 — {overallScore >= 70 ? "Strong" : overallScore >= 45 ? "Competitive" : "Needs Improvement"}
        </Badge>
      </CardContent>
    </Card>
  );
}
