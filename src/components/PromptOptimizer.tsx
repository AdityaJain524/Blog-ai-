import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface PromptOptimizerProps {
  keyword: string;
  intent: string;
  secondaryKeywords: string[];
  geoTarget: string;
}

interface OptimizationStep {
  label: string;
  before: string;
  after: string;
  reason: string;
}

function generateOptimizations(keyword: string, intent: string, secondary: string[], geo: string): OptimizationStep[] {
  const steps: OptimizationStep[] = [];

  // 1. Keyword specificity
  if (keyword.split(/\s+/).length <= 2) {
    steps.push({
      label: "Keyword Expansion",
      before: `"${keyword}"`,
      after: `"${keyword} ${intent === "transactional" ? "best tools" : "complete guide"} ${new Date().getFullYear()}"`,
      reason: "Short-tail keywords are highly competitive. Long-tail variants increase ranking chances by 3–5x.",
    });
  }

  // 2. Intent alignment
  steps.push({
    label: "Intent Reinforcement",
    before: `Intent: ${intent}`,
    after: `Intent: ${intent} → Prompt includes ${intent === "informational" ? "how-to framing, educational tone" : intent === "transactional" ? "comparison tables, pricing cues, CTAs" : "brand mentions, navigation patterns"}`,
    reason: `Google prioritizes content matching search intent. ${intent} queries expect specific content patterns.`,
  });

  // 3. Secondary keyword injection
  if (secondary.length === 0) {
    steps.push({
      label: "LSI Keyword Addition",
      before: "No secondary keywords",
      after: `Auto-suggested: "${keyword} tips", "${keyword} examples", "${keyword} vs alternatives"`,
      reason: "LSI keywords help search engines understand topical depth and improve semantic relevance.",
    });
  } else {
    steps.push({
      label: "Keyword Clustering",
      before: `${secondary.length} separate keywords`,
      after: `Clustered into ${Math.ceil(secondary.length / 2)} semantic groups for natural placement`,
      reason: "Keyword clustering prevents stuffing while maximizing topical coverage across sections.",
    });
  }

  // 4. GEO optimization
  if (geo) {
    steps.push({
      label: "GEO Targeting",
      before: `Region: ${geo}`,
      after: `Localized: currency, regulations, market-specific examples for ${geo}`,
      reason: "Region-specific content increases relevance for local search queries by 40%.",
    });
  } else {
    steps.push({
      label: "GEO Opportunity",
      before: "No geo target set",
      after: "Consider adding a target region for localized ranking boost",
      reason: "Geo-targeted content ranks 2x better in local SERPs. Even global content benefits from regional context.",
    });
  }

  // 5. Structure optimization
  steps.push({
    label: "Content Structure",
    before: "Standard blog format",
    after: "Hook intro → Problem → Solution sections → Data points → FAQ → CTA",
    reason: "This structure matches Google's E-E-A-T framework and Featured Snippet patterns.",
  });

  return steps;
}

export function PromptOptimizer({ keyword, intent, secondaryKeywords, geoTarget }: PromptOptimizerProps) {
  const [expanded, setExpanded] = useState(true);
  const optimizations = generateOptimizations(keyword, intent, secondaryKeywords, geoTarget);

  return (
    <Card>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-warning" /> Prompt Optimizer
            <Badge variant="info" className="text-[10px]">{optimizations.length} optimizations</Badge>
          </CardTitle>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {optimizations.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg bg-secondary/50 border border-border p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">Step {i + 1}</Badge>
                <span className="text-xs font-medium text-foreground">{step.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded bg-destructive/10 p-2 border border-destructive/20">
                  <span className="text-destructive text-[10px] font-medium">Before</span>
                  <p className="text-secondary-foreground mt-0.5">{step.before}</p>
                </div>
                <div className="rounded bg-success/10 p-2 border border-success/20">
                  <span className="text-success text-[10px] font-medium">After</span>
                  <p className="text-secondary-foreground mt-0.5">{step.after}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                <Lightbulb className="h-3 w-3 text-warning shrink-0 mt-0.5" />
                {step.reason}
              </div>
            </motion.div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
