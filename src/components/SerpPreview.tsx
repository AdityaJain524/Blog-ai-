import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface SerpPreviewProps {
  title: string;
  metaDescription: string;
  keyword: string;
}

export function SerpPreview({ title, metaDescription, keyword }: SerpPreviewProps) {
  const titleLen = title.length;
  const descLen = metaDescription.length;
  const titleOk = titleLen >= 30 && titleLen <= 60;
  const descOk = descLen >= 120 && descLen <= 160;

  const url = `https://yourblog.com/${keyword.replace(/\s+/g, "-").toLowerCase()}`;

  // Highlight keyword in title/desc
  const highlight = (text: string) => {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" /> SERP Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Google-style preview */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-secondary/50 p-4 space-y-1 border border-border"
        >
          <p className="text-xs text-muted-foreground truncate">{url}</p>
          <h3 className="text-sm font-medium text-primary leading-snug line-clamp-2">
            {highlight(title)}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {highlight(metaDescription)}
          </p>
        </motion.div>

        {/* Length checks */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={titleOk ? "success" : "destructive"} className="text-[10px]">
            Title: {titleLen}/60 {titleOk ? "✓" : titleLen < 30 ? "Too short" : "Too long"}
          </Badge>
          <Badge variant={descOk ? "success" : "destructive"} className="text-[10px]">
            Meta: {descLen}/160 {descOk ? "✓" : descLen < 120 ? "Too short" : "Too long"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
