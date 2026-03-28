import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, Plus, Loader2 } from "lucide-react";

interface SerpGap {
  topic: string;
  source: string;
  covered: boolean;
}

interface SerpGapAnalyzerProps {
  keyword: string;
  blogSections: string[];
  onAddGap?: (topic: string) => void;
}

export function SerpGapAnalyzer({ keyword, blogSections, onAddGap }: SerpGapAnalyzerProps) {
  const [gaps, setGaps] = useState<SerpGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: {
          action: "serp-gap",
          keyword,
          blogHeadings: blogSections,
        },
      });
      if (error) throw error;

      const result = data?.gaps || data?.result?.gaps || [];
      setGaps(result);
      setAnalyzed(true);
      toast.success("SERP gap analysis complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze SERP gaps");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" /> SERP Gap Analyzer
        </CardTitle>
        <Button size="sm" variant="secondary" onClick={analyze} disabled={loading || !keyword}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Analyze"}
        </Button>
      </CardHeader>
      <CardContent>
        {!analyzed && !loading && (
          <p className="text-xs text-muted-foreground">Click Analyze to find topics competitors rank for that your blog is missing.</p>
        )}
        {gaps.length > 0 && (
          <div className="space-y-2">
            {gaps.map((gap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-lg bg-secondary p-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{gap.topic}</p>
                  <p className="text-[10px] text-muted-foreground">{gap.source}</p>
                </div>
                <div className="flex items-center gap-2">
                  {gap.covered ? (
                    <Badge variant="success" className="text-[10px]">Covered</Badge>
                  ) : (
                    <>
                      <Badge variant="destructive" className="text-[10px]">Missing</Badge>
                      {onAddGap && (
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onAddGap(gap.topic)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
