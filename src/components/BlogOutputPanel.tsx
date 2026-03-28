import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export interface BlogOutput {
  title: string;
  metaDescription: string;
  sections: { heading: string; level: number; content: string }[];
  faqs: { question: string; answer: string }[];
  cta: string;
  keywords: string[];
}

interface BlogOutputPanelProps {
  blog: BlogOutput | null;
  isGenerating: boolean;
  onRegenerateSection?: (index: number) => void;
  onSave?: () => void;
}

export function BlogOutputPanel({ blog, isGenerating, onRegenerateSection, onSave }: BlogOutputPanelProps) {
  const copyToClipboard = () => {
    if (!blog) return;
    const text = `# ${blog.title}\n\n${blog.metaDescription}\n\n${blog.sections
      .map((s) => `${"#".repeat(s.level)} ${s.heading}\n\n${s.content}`)
      .join("\n\n")}\n\n## FAQ\n\n${blog.faqs
      .map((f) => `**${f.question}**\n${f.answer}`)
      .join("\n\n")}\n\n${blog.cta}`;
    navigator.clipboard.writeText(text);
    toast.success("Blog copied to clipboard!");
  };

  const downloadBlog = () => {
    if (!blog) return;
    const text = `# ${blog.title}\n\nMeta: ${blog.metaDescription}\n\n${blog.sections
      .map((s) => `${"#".repeat(s.level)} ${s.heading}\n\n${s.content}`)
      .join("\n\n")}\n\n## FAQ\n\n${blog.faqs
      .map((f) => `**${f.question}**\n${f.answer}`)
      .join("\n\n")}\n\n---\n${blog.cta}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blog.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Blog downloaded!");
  };

  if (isGenerating) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full gradient-primary animate-pulse-glow" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-heading font-semibold text-foreground">AI Pipeline Active</p>
            <p className="text-xs text-muted-foreground">Generating → Refining → Optimizing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!blog) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
            <span className="text-3xl">✍️</span>
          </div>
          <p className="font-heading font-semibold text-foreground">Ready to Generate</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Enter a keyword and configure your settings, then hit Generate to create an SEO-optimized blog.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-heading">Generated Blog</CardTitle>
        <div className="flex gap-2">
          {onSave && (
            <Button size="sm" variant="ghost" onClick={onSave}>
              <Save className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={downloadBlog}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">{blog.title}</h1>
          <p className="text-sm text-muted-foreground mt-2 italic">{blog.metaDescription}</p>
        </motion.div>

        <div className="flex flex-wrap gap-1.5">
          {blog.keywords.map((kw, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
          ))}
        </div>

        {blog.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            <div className="flex items-start justify-between gap-2">
              {section.level === 2 ? (
                <h2 className="text-lg font-heading font-semibold text-foreground">{section.heading}</h2>
              ) : (
                <h3 className="text-base font-heading font-medium text-foreground">{section.heading}</h3>
              )}
              {onRegenerateSection && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-7 w-7"
                  onClick={() => onRegenerateSection(i)}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed mt-1.5">{section.content}</p>
          </motion.div>
        ))}

        {blog.faqs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-semibold text-foreground">Frequently Asked Questions</h2>
            {blog.faqs.map((faq, i) => (
              <div key={i} className="rounded-lg bg-secondary p-4">
                <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                <p className="text-sm text-secondary-foreground mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg gradient-primary p-4">
          <p className="text-sm font-medium text-primary-foreground">{blog.cta}</p>
        </div>
      </CardContent>
    </Card>
  );
}
