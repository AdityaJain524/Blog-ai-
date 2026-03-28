import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { InputPanel, type BlogInputData } from "@/components/InputPanel";
import { BlogOutputPanel, type BlogOutput } from "@/components/BlogOutputPanel";
import { SeoInsightsPanel, type SeoInsights } from "@/components/SeoInsightsPanel";
import { ContentGapHeatmap } from "@/components/ContentGapHeatmap";
import { SerpGapAnalyzer } from "@/components/SerpGapAnalyzer";
import { SavedBlogsList } from "@/components/SavedBlogsList";
import { BulkGenerateModal, type BulkKeyword } from "@/components/BulkGenerateModal";
import { AuthModal } from "@/components/AuthModal";
import { PromptTemplates } from "@/components/PromptTemplates";
import { SerpPreview } from "@/components/SerpPreview";
import { AiHumanScore } from "@/components/AiHumanScore";
import { CompetitorBeatScore } from "@/components/CompetitorBeatScore";
import { AutoInterlinking } from "@/components/AutoInterlinking";
import { EngagementPrediction } from "@/components/EngagementPrediction";
import { SeoFailurePredictor } from "@/components/SeoFailurePredictor";
import { PromptOptimizer } from "@/components/PromptOptimizer";
import { MockPublish } from "@/components/MockPublish";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [blog, setBlog] = useState<BlogOutput | null>(null);
  const [insights, setInsights] = useState<SeoInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [repurposedContent, setRepurposedContent] = useState<{ format: string; content: string } | null>(null);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [heatmapData, setHeatmapData] = useState<{ topic: string; competitorCoverage: number; yourCoverage: number }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkKeywords, setBulkKeywords] = useState<BulkKeyword[]>([]);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);

  // Template state
  const [templateKeyword, setTemplateKeyword] = useState("");
  const [templateSecondary, setTemplateSecondary] = useState<string[]>([]);
  const [templateIntent, setTemplateIntent] = useState<BlogInputData["intent"]>("informational");
  const [templateVersion, setTemplateVersion] = useState(0);
  const [lastConfig, setLastConfig] = useState<BlogInputData | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleApplyTemplate = (t: { keyword: string; secondaryKeywords: string[]; intent: "informational" | "transactional" | "navigational" }) => {
    setTemplateKeyword(t.keyword);
    setTemplateSecondary(t.secondaryKeywords);
    setTemplateIntent(t.intent);
    setTemplateVersion((v) => v + 1);
    toast.success("Template applied!");
  };

  const handleGenerate = async (data: BlogInputData) => {
    setIsGenerating(true);
    setBlog(null);
    setInsights(null);
    setRepurposedContent(null);
    setHeatmapData([]);
    setCurrentKeyword(data.keyword);
    setLastConfig(data);

    try {
      const { data: result, error } = await supabase.functions.invoke("generate-blog", {
        body: {
          keyword: data.keyword,
          secondaryKeywords: data.secondaryKeywords,
          intent: data.intent,
          model: data.model,
          geoTarget: data.geoTarget,
        },
      });

      if (error) throw error;
      if (result?.error) { toast.error(result.error); return; }

      const blogData = result?.result || result;
      const newBlog: BlogOutput = {
        title: blogData.title || "Untitled Blog",
        metaDescription: blogData.metaDescription || "",
        sections: blogData.sections || [],
        faqs: blogData.faqs || [],
        cta: blogData.cta || "",
        keywords: blogData.keywords || [data.keyword],
      };
      setBlog(newBlog);

      if (blogData.seoInsights) {
        setInsights(blogData.seoInsights);
      }

      fetchHeatmap(data.keyword, newBlog.sections.map(s => s.heading));
      toast.success("Blog generated successfully!");
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate blog. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchHeatmap = async (keyword: string, headings: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { action: "content-gap-heatmap", keyword, blogHeadings: headings },
      });
      if (!error && data) {
        const hm = data?.heatmap || data?.result?.heatmap || [];
        setHeatmapData(hm);
      }
    } catch { /* silent */ }
  };

  const handleRepurpose = async (format: "linkedin" | "twitter" | "summary") => {
    if (!blog) return;
    try {
      const blogText = `${blog.title}\n\n${blog.sections.map(s => `${s.heading}\n${s.content}`).join("\n\n")}`;
      const { data: result, error } = await supabase.functions.invoke("generate-blog", {
        body: { action: "repurpose", format, blogContent: blogText },
      });
      if (error) throw error;
      setRepurposedContent({
        format: format === "linkedin" ? "LinkedIn Post" : format === "twitter" ? "Twitter Thread" : "Summary",
        content: result?.content || "Could not generate content.",
      });
      toast.success(`${format} content generated!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to repurpose content.");
    }
  };

  const handleSaveBlog = async () => {
    if (!blog || !user) {
      if (!user) setShowAuth(true);
      return;
    }
    try {
      const { error } = await supabase.from("saved_blogs").insert({
        user_id: user.id,
        keyword: currentKeyword,
        title: blog.title,
        meta_description: blog.metaDescription,
        sections: blog.sections as any,
        faqs: blog.faqs as any,
        cta: blog.cta,
        keywords: blog.keywords as any,
        seo_insights: insights as any,
      });
      if (error) throw error;
      toast.success("Blog saved!");
      setSavedRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog");
    }
  };

  const handleLoadBlog = (loadedBlog: BlogOutput, loadedInsights: SeoInsights | null) => {
    setBlog(loadedBlog);
    setInsights(loadedInsights);
    setRepurposedContent(null);
    setHeatmapData([]);
  };

  const handleBulkStart = async (keywords: string[]) => {
    setIsBulkRunning(true);
    const items: BulkKeyword[] = keywords.map((kw) => ({ keyword: kw, status: "pending" as const }));
    setBulkKeywords(items);

    for (let i = 0; i < items.length; i++) {
      items[i].status = "generating";
      setBulkKeywords([...items]);

      try {
        const { data: result, error } = await supabase.functions.invoke("generate-blog", {
          body: { keyword: items[i].keyword, secondaryKeywords: [], intent: "informational", model: "hybrid", geoTarget: "" },
        });

        if (error) throw error;
        if (result?.error) throw new Error(result.error);

        const blogData = result?.result || result;

        if (user) {
          await supabase.from("saved_blogs").insert({
            user_id: user.id,
            keyword: items[i].keyword,
            title: blogData.title || "Untitled",
            meta_description: blogData.metaDescription || "",
            sections: blogData.sections || [],
            faqs: blogData.faqs || [],
            cta: blogData.cta || "",
            keywords: blogData.keywords || [],
            seo_insights: blogData.seoInsights || null,
          });
        }

        items[i].status = "done";
      } catch {
        items[i].status = "error";
      }
      setBulkKeywords([...items]);
    }

    setIsBulkRunning(false);
    setSavedRefreshKey((k) => k + 1);
    toast.success("Bulk generation complete!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onSignOut={() => supabase.auth.signOut()}
        onBulkClick={() => setShowBulk(true)}
      />
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      <BulkGenerateModal
        open={showBulk}
        onOpenChange={setShowBulk}
        onStart={handleBulkStart}
        bulkKeywords={bulkKeywords}
        isRunning={isBulkRunning}
      />
      <main className="flex-1 p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            <InputPanel
              key={templateVersion}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              externalKeyword={templateKeyword}
              externalSecondary={templateSecondary}
              externalIntent={templateIntent}
            />
            <PromptTemplates onApply={handleApplyTemplate} />
            {user && <SavedBlogsList onLoad={handleLoadBlog} refreshKey={savedRefreshKey} />}
          </div>

          {/* Blog Output + Analysis */}
          <div className="lg:col-span-5 space-y-4">
            <BlogOutputPanel blog={blog} isGenerating={isGenerating} onSave={user ? handleSaveBlog : undefined} />

            {blog && (
              <SerpPreview title={blog.title} metaDescription={blog.metaDescription} keyword={currentKeyword} />
            )}

            {blog && lastConfig && (
              <PromptOptimizer
                keyword={lastConfig.keyword}
                intent={lastConfig.intent}
                secondaryKeywords={lastConfig.secondaryKeywords}
                geoTarget={lastConfig.geoTarget}
              />
            )}

            {blog && currentKeyword && (
              <SerpGapAnalyzer keyword={currentKeyword} blogSections={blog.sections.map((s) => s.heading)} />
            )}

            {blog && (
              <AutoInterlinking sections={blog.sections} keyword={currentKeyword} />
            )}

            {blog && (
              <MockPublish blog={blog} />
            )}
          </div>

          {/* SEO Insights + New Panels */}
          <div className="lg:col-span-4 space-y-4">
            <SeoInsightsPanel
              insights={insights}
              onRepurpose={handleRepurpose}
              repurposedContent={repurposedContent}
            />

            {blog && (
              <SeoFailurePredictor
                sections={blog.sections}
                keywords={blog.keywords}
                title={blog.title}
                metaDescription={blog.metaDescription}
              />
            )}

            {blog && (
              <AiHumanScore sections={blog.sections} />
            )}

            {blog && (
              <CompetitorBeatScore sections={blog.sections} keywords={blog.keywords} />
            )}

            {blog && (
              <EngagementPrediction sections={blog.sections} title={blog.title} />
            )}

            {heatmapData.length > 0 && <ContentGapHeatmap gaps={heatmapData} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
