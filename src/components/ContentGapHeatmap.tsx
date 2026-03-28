import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ContentGapHeatmapProps {
  gaps: {
    topic: string;
    competitorCoverage: number; // 0-100
    yourCoverage: number; // 0-100
  }[];
}

const getHeatColor = (value: number) => {
  if (value >= 80) return "bg-success/80";
  if (value >= 60) return "bg-success/50";
  if (value >= 40) return "bg-warning/60";
  if (value >= 20) return "bg-warning/30";
  return "bg-destructive/40";
};

export function ContentGapHeatmap({ gaps }: ContentGapHeatmapProps) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-heading">Content Gap Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Topic</span>
          <span className="text-center">Competitors</span>
          <span className="text-center">Your Blog</span>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {gaps.map((gap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_80px_80px] gap-2 items-center"
            >
              <span className="text-xs text-secondary-foreground truncate">{gap.topic}</span>
              <div className="flex items-center justify-center">
                <div className={`h-6 w-full rounded ${getHeatColor(gap.competitorCoverage)} flex items-center justify-center`}>
                  <span className="text-[10px] font-mono font-bold text-foreground">{gap.competitorCoverage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className={`h-6 w-full rounded ${getHeatColor(gap.yourCoverage)} flex items-center justify-center`}>
                  <span className="text-[10px] font-mono font-bold text-foreground">{gap.yourCoverage}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
          <span className="text-[10px] text-muted-foreground">Coverage:</span>
          <div className="flex gap-1.5">
            {[
              { label: "0-20%", cls: "bg-destructive/40" },
              { label: "20-40%", cls: "bg-warning/30" },
              { label: "40-60%", cls: "bg-warning/60" },
              { label: "60-80%", cls: "bg-success/50" },
              { label: "80-100%", cls: "bg-success/80" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`h-3 w-3 rounded-sm ${l.cls}`} />
                <span className="text-[9px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
