import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ListOrdered, GitCompare, HelpCircle, Star, ChevronDown, ChevronUp } from "lucide-react";

const templates = [
  {
    id: "howto",
    label: "How-To Guide",
    icon: HelpCircle,
    keyword: "how to optimize website speed",
    secondaryKeywords: ["page load time", "core web vitals", "website performance"],
    intent: "informational" as const,
    description: "Step-by-step tutorial format with actionable tips",
  },
  {
    id: "listicle",
    label: "Listicle",
    icon: ListOrdered,
    keyword: "best project management tools 2025",
    secondaryKeywords: ["team collaboration", "task tracking", "agile tools"],
    intent: "informational" as const,
    description: "Numbered list format ideal for roundup posts",
  },
  {
    id: "comparison",
    label: "Comparison",
    icon: GitCompare,
    keyword: "React vs Vue vs Angular",
    secondaryKeywords: ["frontend framework", "JavaScript framework", "web development"],
    intent: "informational" as const,
    description: "Side-by-side comparison of products or concepts",
  },
  {
    id: "review",
    label: "Product Review",
    icon: Star,
    keyword: "Notion review for teams",
    secondaryKeywords: ["productivity app", "note taking", "team workspace"],
    intent: "transactional" as const,
    description: "In-depth review with pros, cons, and verdict",
  },
  {
    id: "pillar",
    label: "Pillar Page",
    icon: FileText,
    keyword: "complete guide to content marketing",
    secondaryKeywords: ["content strategy", "SEO content", "blog marketing", "content calendar"],
    intent: "informational" as const,
    description: "Comprehensive long-form authority content",
  },
];

interface PromptTemplatesProps {
  onApply: (template: { keyword: string; secondaryKeywords: string[]; intent: "informational" | "transactional" | "navigational" }) => void;
}

export function PromptTemplates({ onApply }: PromptTemplatesProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading">Prompt Templates</CardTitle>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-2 pt-0">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onApply({ keyword: t.keyword, secondaryKeywords: t.secondaryKeywords, intent: t.intent })}
              className="w-full flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <t.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{t.label}</span>
                  <Badge variant="secondary" className="text-[10px]">{t.intent}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{t.description}</p>
              </div>
            </button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
