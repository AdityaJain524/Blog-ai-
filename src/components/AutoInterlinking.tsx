import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface AutoInterlinkingProps {
  sections: { heading: string; content: string }[];
  keyword: string;
}

function generateLinkSuggestions(sections: { heading: string; content: string }[], keyword: string) {
  const suggestions: { section: string; anchorText: string; targetPage: string; reason: string }[] = [];

  const mockPages = [
    { slug: "/seo-basics", title: "SEO Basics Guide", triggers: ["seo", "search engine", "optimization", "ranking"] },
    { slug: "/keyword-research", title: "Keyword Research Guide", triggers: ["keyword", "search volume", "keyword research", "long-tail"] },
    { slug: "/content-strategy", title: "Content Strategy 101", triggers: ["content", "strategy", "blog", "editorial"] },
    { slug: "/link-building", title: "Link Building Guide", triggers: ["backlink", "link building", "domain authority", "outreach"] },
    { slug: "/technical-seo", title: "Technical SEO Checklist", triggers: ["technical", "site speed", "crawl", "indexing", "core web vitals"] },
    { slug: "/analytics-guide", title: "Analytics Setup Guide", triggers: ["analytics", "google analytics", "tracking", "metrics", "data"] },
    { slug: "/ai-tools", title: "Best AI Tools", triggers: ["ai", "artificial intelligence", "machine learning", "automation"] },
    { slug: "/conversion-optimization", title: "CRO Guide", triggers: ["conversion", "cta", "landing page", "funnel"] },
  ];

  sections.forEach((section) => {
    const text = section.content.toLowerCase();
    mockPages.forEach((page) => {
      const match = page.triggers.find((t) => text.includes(t));
      if (match && suggestions.length < 8) {
        // Find a sentence fragment around the match for anchor text
        const idx = text.indexOf(match);
        const start = Math.max(0, text.lastIndexOf(" ", idx - 1));
        const end = Math.min(text.length, text.indexOf(" ", idx + match.length + 8));
        const anchor = section.content.substring(start, end > start ? end : start + match.length + 15).trim();

        if (!suggestions.find((s) => s.targetPage === page.slug)) {
          suggestions.push({
            section: section.heading,
            anchorText: anchor.length > 50 ? anchor.substring(0, 50) + "…" : anchor,
            targetPage: page.slug,
            reason: `Contains "${match}" — links to ${page.title}`,
          });
        }
      }
    });
  });

  return suggestions;
}

export function AutoInterlinking({ sections, keyword }: AutoInterlinkingProps) {
  const suggestions = generateLinkSuggestions(sections, keyword);

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" /> Auto Interlinking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No interlinking opportunities found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" /> Auto Interlinking
          <Badge variant="info" className="text-[10px]">{suggestions.length} links</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg bg-secondary/50 p-3 border border-border space-y-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground truncate">In: {s.section}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
            <p className="text-xs text-foreground">
              Anchor: <span className="text-primary font-medium">"{s.anchorText}"</span>
            </p>
            <p className="text-[10px] text-muted-foreground">{s.reason}</p>
            <Badge variant="secondary" className="text-[10px]">{s.targetPage}</Badge>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
