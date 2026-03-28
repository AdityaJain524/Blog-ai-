import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { BlogOutput } from "@/components/BlogOutputPanel";
import type { SeoInsights } from "@/components/SeoInsightsPanel";

interface SavedBlog {
  id: string;
  keyword: string;
  title: string;
  created_at: string | null;
  meta_description: string | null;
  sections: any;
  faqs: any;
  cta: string | null;
  keywords: any;
  seo_insights: any;
  user_id: string;
}

interface SavedBlogsListProps {
  onLoad: (blog: BlogOutput, insights: SeoInsights | null) => void;
  refreshKey?: number;
}

export function SavedBlogsList({ onLoad, refreshKey }: SavedBlogsListProps) {
  const [blogs, setBlogs] = useState<SavedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("saved_blogs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching blogs:", error);
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("saved_blogs").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete blog");
    } else {
      setBlogs(blogs.filter((b) => b.id !== id));
      toast.success("Blog deleted");
    }
  };

  const loadBlog = (blog: SavedBlog) => {
    onLoad(
      {
        title: blog.title,
        metaDescription: blog.meta_description || "",
        sections: blog.sections || [],
        faqs: blog.faqs || [],
        cta: blog.cta || "",
        keywords: blog.keywords || [],
      },
      blog.seo_insights || null
    );
  };

  if (loading) return null;
  if (blogs.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-heading flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Saved Blogs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 max-h-48 overflow-y-auto">
        {blogs.map((blog, i) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between rounded-lg bg-secondary p-2.5 cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => loadBlog(blog)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{blog.title}</p>
              <p className="text-[10px] text-muted-foreground">{blog.keyword} • {new Date(blog.created_at).toLocaleDateString()}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0"
              onClick={(e) => { e.stopPropagation(); deleteBlog(blog.id); }}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
