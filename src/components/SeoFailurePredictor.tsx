import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle, XCircle, ShieldAlert } from "lucide-react";

interface SeoFailurePredictorProps {
  sections: { heading: string; content: string }[];
  keywords: string[];
  title: string;
  metaDescription: string;
}

interface RiskItem {
  label: string;
  severity: "critical" | "warning" | "ok";
  message: string;
}

function analyzeRisks(
  sections: { heading: string; content: string }[],
  keywords: string[],
  title: string,
  meta: string
): { risks: RiskItem[]; overallRisk: "high" | "medium" | "low" } {
  const risks: RiskItem[] = [];
  const allText = sections.map((s) => s.content).join(" ").toLowerCase();
  const totalWords = allText.split(/\s+/).length;

  // 1. Thin content
  if (totalWords < 600) {
    risks.push({ label: "Thin Content", severity: "critical", message: `Only ${totalWords} words — aim for 1,200+ for competitive keywords.` });
  } else if (totalWords < 1000) {
    risks.push({ label: "Content Length", severity: "warning", message: `${totalWords} words is borderline. 1,200+ recommended.` });
  } else {
    risks.push({ label: "Content Length", severity: "ok", message: `${totalWords} words — solid depth.` });
  }

  // 2. Keyword in title
  const primaryKw = keywords[0]?.toLowerCase() || "";
  if (primaryKw && !title.toLowerCase().includes(primaryKw)) {
    risks.push({ label: "Keyword in Title", severity: "critical", message: "Primary keyword missing from title." });
  } else {
    risks.push({ label: "Keyword in Title", severity: "ok", message: "Primary keyword found in title." });
  }

  // 3. Meta description length
  if (meta.length < 100) {
    risks.push({ label: "Meta Description", severity: "warning", message: `Too short (${meta.length} chars). Aim for 120–160.` });
  } else if (meta.length > 165) {
    risks.push({ label: "Meta Description", severity: "warning", message: `Too long (${meta.length} chars). May be truncated.` });
  } else {
    risks.push({ label: "Meta Description", severity: "ok", message: "Meta description length is optimal." });
  }

  // 4. Heading structure
  const h2Count = sections.filter((s) => s.heading).length;
  if (h2Count < 3) {
    risks.push({ label: "Heading Structure", severity: "critical", message: "Too few headings — add more H2/H3 for structure." });
  } else {
    risks.push({ label: "Heading Structure", severity: "ok", message: `${h2Count} section headings — good structure.` });
  }

  // 5. Keyword stuffing check
  if (primaryKw) {
    const kwCount = (allText.match(new RegExp(primaryKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    const density = (kwCount / totalWords) * 100;
    if (density > 3) {
      risks.push({ label: "Keyword Stuffing", severity: "critical", message: `Density at ${density.toFixed(1)}% — risk of penalty.` });
    } else if (density < 0.5) {
      risks.push({ label: "Low Keyword Usage", severity: "warning", message: `Density at ${density.toFixed(1)}% — too low for ranking.` });
    } else {
      risks.push({ label: "Keyword Density", severity: "ok", message: `${density.toFixed(1)}% density — optimal range.` });
    }
  }

  // 6. No images / media mentions
  const hasMediaRef = /image|video|infographic|chart|diagram|screenshot/i.test(allText);
  if (!hasMediaRef) {
    risks.push({ label: "No Media References", severity: "warning", message: "No mention of images/videos. Multimedia boosts engagement." });
  }

  // 7. Internal/external links
  const hasLinkRef = /link|source|reference|according to|study/i.test(allText);
  if (!hasLinkRef) {
    risks.push({ label: "No Link Signals", severity: "warning", message: "No authority signals or source references found." });
  }

  const criticals = risks.filter((r) => r.severity === "critical").length;
  const warnings = risks.filter((r) => r.severity === "warning").length;
  const overallRisk = criticals >= 2 ? "high" : criticals >= 1 || warnings >= 3 ? "medium" : "low";

  return { risks, overallRisk };
}

export function SeoFailurePredictor({ sections, keywords, title, metaDescription }: SeoFailurePredictorProps) {
  const { risks, overallRisk } = analyzeRisks(sections, keywords, title, metaDescription);

  const riskColors = { high: "destructive", medium: "warning", low: "success" } as const;
  const riskLabels = { high: "High Risk — May Fail to Rank", medium: "Medium Risk — Improvements Needed", low: "Low Risk — Looking Good" };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" /> SEO Failure Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant={riskColors[overallRisk]} className="w-full justify-center py-1.5 text-xs">
          {riskLabels[overallRisk]}
        </Badge>

        <div className="space-y-2">
          {risks.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-2 text-xs"
            >
              {r.severity === "ok" ? (
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
              ) : r.severity === "warning" ? (
                <AlertOctagon className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-medium text-foreground">{r.label}: </span>
                <span className="text-muted-foreground">{r.message}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
