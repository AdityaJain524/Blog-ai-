import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoScoreRing } from "@/components/SeoScoreRing";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle, FileText, MessageSquare, Twitter, Linkedin } from "lucide-react";

export interface SeoInsights {
  seoScore: number;
  readabilityScore: number;
  rankProbability: number;
  keywordDensity: { keyword: string; density: number; status: "good" | "low" | "high" }[];
  headingCheck: { issue: string; severity: "warning" | "error" | "success" }[];
  contentGaps: string[];
  improvements: string[];
}

interface SeoInsightsPanelProps {
  insights: SeoInsights | null;
  onRepurpose?: (format: "linkedin" | "twitter" | "summary") => void;
  repurposedContent?: { format: string; content: string } | null;
}

export function SeoInsightsPanel({ insights, onRepurpose, repurposedContent }: SeoInsightsPanelProps) {
  if (!insights) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-heading font-semibold text-foreground">SEO Insights</p>
          <p className="text-sm text-muted-foreground">Generate a blog to see SEO analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading">SEO Insights</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="scores" className="flex-1 text-xs">Scores</TabsTrigger>
            <TabsTrigger value="keywords" className="flex-1 text-xs">Keywords</TabsTrigger>
            <TabsTrigger value="gaps" className="flex-1 text-xs">Gaps</TabsTrigger>
            <TabsTrigger value="repurpose" className="flex-1 text-xs">Repurpose</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-5">
            {/* Score Rings */}
            <div className="flex justify-around">
              <SeoScoreRing score={insights.seoScore} label="SEO Score" />
              <SeoScoreRing score={insights.readabilityScore} label="Readability" />
              <SeoScoreRing score={insights.rankProbability} label="Rank %" />
            </div>

            {/* Heading Checks */}
            <div className="space-y-2">
              <h4 className="text-sm font-heading font-medium text-foreground">Heading Analysis</h4>
              {insights.headingCheck.map((check, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-xs"
                >
                  {check.severity === "success" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                  ) : check.severity === "warning" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <span className="text-secondary-foreground">{check.issue}</span>
                </motion.div>
              ))}
            </div>

            {/* Improvements */}
            <div className="space-y-2">
              <h4 className="text-sm font-heading font-medium text-foreground">Suggestions</h4>
              {insights.improvements.map((imp, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span> {imp}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-3">
            <h4 className="text-sm font-heading font-medium text-foreground">Keyword Density</h4>
            {insights.keywordDensity.map((kd, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-secondary-foreground">{kd.keyword}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-foreground">{kd.density.toFixed(1)}%</span>
                  <Badge variant={kd.status === "good" ? "success" : kd.status === "high" ? "warning" : "destructive"} className="text-[10px]">
                    {kd.status}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="gaps" className="space-y-3">
            <h4 className="text-sm font-heading font-medium text-foreground">Content Gaps</h4>
            <p className="text-xs text-muted-foreground">Topics competitors cover that your blog doesn't:</p>
            {insights.contentGaps.map((gap, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <span className="text-warning text-xs">⚠</span>
                <span className="text-xs text-secondary-foreground">{gap}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="repurpose" className="space-y-3">
            <h4 className="text-sm font-heading font-medium text-foreground">1-Click Repurpose</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="secondary" size="sm" className="justify-start gap-2" onClick={() => onRepurpose?.("linkedin")}>
                <Linkedin className="h-4 w-4" /> LinkedIn Post
              </Button>
              <Button variant="secondary" size="sm" className="justify-start gap-2" onClick={() => onRepurpose?.("twitter")}>
                <Twitter className="h-4 w-4" /> Twitter Thread
              </Button>
              <Button variant="secondary" size="sm" className="justify-start gap-2" onClick={() => onRepurpose?.("summary")}>
                <FileText className="h-4 w-4" /> Short Summary
              </Button>
            </div>
            {repurposedContent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-secondary p-4 space-y-2"
              >
                <Badge variant="info">{repurposedContent.format}</Badge>
                <p className="text-xs text-secondary-foreground whitespace-pre-wrap leading-relaxed">
                  {repurposedContent.content}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
