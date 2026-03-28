import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Activity, Clock, ArrowDown, Eye } from "lucide-react";

interface EngagementPredictionProps {
  sections: { heading: string; content: string }[];
  title: string;
}

function predict(sections: { heading: string; content: string }[], title: string) {
  const allText = sections.map((s) => s.content).join(" ");
  const totalWords = allText.split(/\s+/).length;
  const avgReadTime = Math.ceil(totalWords / 230); // avg reading speed

  const paragraphs = sections.map((s) => s.content.split(/\s+/).length);
  const avgParaLen = paragraphs.reduce((a, b) => a + b, 0) / (paragraphs.length || 1);

  // Intro strength (first section word count, questions, hooks)
  const intro = sections[0]?.content || "";
  const introWords = intro.split(/\s+/).length;
  const hasQuestion = /\?/.test(intro);
  const hasHook = /(imagine|discover|ever wondered|did you know|what if)/i.test(intro);
  const introScore = Math.min(100, (introWords > 40 ? 40 : introWords) + (hasQuestion ? 25 : 0) + (hasHook ? 25 : 0) + 10);

  // Para length penalty (too long = bad)
  const paraScore = avgParaLen <= 60 ? 85 : avgParaLen <= 100 ? 65 : avgParaLen <= 150 ? 45 : 25;

  // Title engagement (length, power words)
  const powerWords = ["ultimate", "best", "complete", "proven", "essential", "top", "secret", "powerful", "guide", "how to"];
  const titlePower = powerWords.filter((w) => title.toLowerCase().includes(w)).length;
  const titleScore = Math.min(100, 40 + titlePower * 15 + (title.length >= 30 && title.length <= 60 ? 20 : 0));

  // Bounce risk
  const engagementScore = Math.round(introScore * 0.35 + paraScore * 0.3 + titleScore * 0.2 + (sections.length >= 6 ? 15 : sections.length * 2.5));
  const bounceRisk = Math.max(5, 100 - engagementScore);

  return { avgReadTime, bounceRisk, introScore, paraScore, titleScore, engagementScore, avgParaLen: Math.round(avgParaLen) };
}

export function EngagementPrediction({ sections, title }: EngagementPredictionProps) {
  const { avgReadTime, bounceRisk, introScore, paraScore, titleScore, engagementScore, avgParaLen } = predict(sections, title);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" /> Engagement Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-secondary/50 border border-border p-3 text-center"
          >
            <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-foreground">{avgReadTime} min</p>
            <p className="text-[10px] text-muted-foreground">Est. Read Time</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-secondary/50 border border-border p-3 text-center"
          >
            <ArrowDown className="h-4 w-4 text-warning mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-foreground">{bounceRisk}%</p>
            <p className="text-[10px] text-muted-foreground">Bounce Risk</p>
          </motion.div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-2">
          {[
            { label: "Intro Strength", score: introScore, desc: "Hook quality and opening engagement" },
            { label: "Paragraph Flow", score: paraScore, desc: `Avg ${avgParaLen} words/section` },
            { label: "Title Impact", score: titleScore, desc: "Power words and optimal length" },
          ].map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary-foreground">{m.label}</span>
                <Badge variant={m.score >= 65 ? "success" : m.score >= 40 ? "warning" : "destructive"} className="text-[10px]">
                  {m.score}%
                </Badge>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full bg-accent/60"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>

        <Badge
          variant={engagementScore >= 65 ? "success" : engagementScore >= 40 ? "warning" : "destructive"}
          className="w-full justify-center py-1"
        >
          <Eye className="h-3 w-3 mr-1" />
          Engagement Score: {engagementScore}/100
        </Badge>
      </CardContent>
    </Card>
  );
}
