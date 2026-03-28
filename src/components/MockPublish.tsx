import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Linkedin, BookOpen, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MockPublishProps {
  blog: {
    title: string;
    metaDescription: string;
    sections: { heading: string; content: string }[];
  };
}

interface PublishTarget {
  id: string;
  label: string;
  icon: typeof Linkedin;
  color: string;
}

const targets: PublishTarget[] = [
  { id: "medium", label: "Medium", icon: BookOpen, color: "text-foreground" },
  { id: "linkedin", label: "LinkedIn Article", icon: Linkedin, color: "text-primary" },
];

export function MockPublish({ blog }: MockPublishProps) {
  const [published, setPublished] = useState<Record<string, boolean>>({});
  const [publishing, setPublishing] = useState<string | null>(null);
  const [previewTarget, setPreviewTarget] = useState<string | null>(null);

  const handlePublish = (targetId: string) => {
    setPublishing(targetId);
    // Simulate publishing delay
    setTimeout(() => {
      setPublished((prev) => ({ ...prev, [targetId]: true }));
      setPublishing(null);
      toast.success(`Published to ${targetId === "medium" ? "Medium" : "LinkedIn"}! (Mock)`);
    }, 1500);
  };

  const handleCopyFormatted = (targetId: string) => {
    let formatted = "";
    if (targetId === "medium") {
      formatted = `# ${blog.title}\n\n${blog.metaDescription}\n\n---\n\n${blog.sections.map((s) => `## ${s.heading}\n\n${s.content}`).join("\n\n")}`;
    } else {
      formatted = `${blog.title}\n\n${blog.metaDescription}\n\n${blog.sections.slice(0, 3).map((s) => `▸ ${s.heading}\n${s.content.substring(0, 150)}...`).join("\n\n")}\n\n#SEO #ContentMarketing #AI`;
    }
    navigator.clipboard.writeText(formatted);
    toast.success(`${targetId === "medium" ? "Medium" : "LinkedIn"} formatted content copied!`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" /> Mock Publish
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {targets.map((target) => (
          <motion.div
            key={target.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-secondary/50 border border-border p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <target.icon className={`h-4 w-4 ${target.color}`} />
                <span className="text-xs font-medium text-foreground">{target.label}</span>
              </div>
              {published[target.id] && (
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle className="h-3 w-3" /> Published
                </Badge>
              )}
            </div>

            {/* Preview toggle */}
            {previewTarget === target.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="rounded bg-card p-3 border border-border text-xs space-y-1 max-h-32 overflow-y-auto"
              >
                <p className="font-semibold text-foreground">{blog.title}</p>
                <p className="text-muted-foreground text-[11px] italic">{blog.metaDescription}</p>
                <p className="text-muted-foreground text-[10px] mt-1">
                  {blog.sections.length} sections • {blog.sections.reduce((c, s) => c + s.content.split(/\s+/).length, 0)} words
                </p>
              </motion.div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 text-[11px] h-7"
                onClick={() => setPreviewTarget(previewTarget === target.id ? null : target.id)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="text-[11px] h-7"
                onClick={() => handleCopyFormatted(target.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="default"
                className="flex-1 text-[11px] h-7"
                onClick={() => handlePublish(target.id)}
                disabled={!!publishing || published[target.id]}
              >
                {publishing === target.id ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full border border-primary-foreground border-t-transparent animate-spin" />
                    Publishing...
                  </span>
                ) : published[target.id] ? (
                  "Published ✓"
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </motion.div>
        ))}

        <p className="text-[10px] text-muted-foreground text-center">
          Mock publish simulates the publishing flow. Copy formatted content for real publishing.
        </p>
      </CardContent>
    </Card>
  );
}
