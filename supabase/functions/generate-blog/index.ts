import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { keyword, secondaryKeywords, intent, model, geoTarget, action, blogContent, format, blogHeadings } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const callAI = async (systemPrompt: string, userPrompt: string, modelOverride?: string) => {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelOverride || "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "structured_output",
              description: "Return structured output",
              parameters: {
                type: "object",
                properties: {
                  result: { type: "object" }
                },
                required: ["result"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "structured_output" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("RATE_LIMITED");
        if (response.status === 402) throw new Error("CREDITS_EXHAUSTED");
        const t = await response.text();
        throw new Error(`AI error ${response.status}: ${t}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        return parsed.result || parsed;
      }
      const content = data.choices?.[0]?.message?.content || "";
      try {
        return JSON.parse(content);
      } catch {
        return { raw: content };
      }
    };

    // REPURPOSE ACTION
    if (action === "repurpose") {
      const formatInstructions: Record<string, string> = {
        linkedin: "Convert this blog into a compelling LinkedIn post (max 1300 chars). Use hooks, emojis sparingly, and professional tone. Return JSON: {\"result\":{\"content\":\"...\"}}",
        twitter: "Convert this blog into a Twitter/X thread (5-8 tweets). Each tweet max 280 chars. Return JSON: {\"result\":{\"content\":\"Tweet 1\\n\\nTweet 2\\n...\"}}",
        summary: "Create a 3-sentence executive summary of this blog. Return JSON: {\"result\":{\"content\":\"...\"}}"
      };

      const result = await callAI(
        formatInstructions[format] || formatInstructions.summary,
        blogContent
      );

      return new Response(JSON.stringify({ content: result.content || result.raw || JSON.stringify(result) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SERP GAP ANALYSIS
    if (action === "serp-gap") {
      const systemPrompt = `You are an SEO expert. Analyze what topics competitors would typically rank for with the given keyword. Compare against the provided blog headings to identify gaps.
Return JSON: {"result":{"gaps":[{"topic":"topic name","source":"Competitor pattern","covered":true/false}]}}
Generate 8-12 typical competitor topics. Mark as covered=true if the blog headings already cover it.`;

      const userPrompt = `Keyword: "${keyword}"
Blog headings: ${JSON.stringify(blogHeadings || [])}
Identify SERP gaps - topics that top-ranking competitors cover but this blog might be missing.`;

      const result = await callAI(systemPrompt, userPrompt);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CONTENT GAP HEATMAP
    if (action === "content-gap-heatmap") {
      const systemPrompt = `You are an SEO analyst. For the given keyword and blog sections, generate a content gap heatmap comparing competitor coverage vs the blog's coverage across key subtopics.
Return JSON: {"result":{"heatmap":[{"topic":"subtopic","competitorCoverage":0-100,"yourCoverage":0-100}]}}
Generate 8-10 subtopics. Be realistic with coverage percentages.`;

      const userPrompt = `Keyword: "${keyword}"
Blog sections: ${JSON.stringify(blogHeadings || [])}
Generate content gap heatmap data.`;

      const result = await callAI(systemPrompt, userPrompt);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GENERATE BLOG
    const geoContext = geoTarget ? ` targeting the ${geoTarget} market` : "";
    const secondaryContext = secondaryKeywords?.length > 0 ? ` Also include these secondary keywords naturally: ${secondaryKeywords.join(", ")}.` : "";

    const systemPrompt = `You are an expert SEO content writer and strategist. Generate a comprehensive, SEO-optimized blog post. 
The content must be engaging, well-structured, and optimized for both search engines and AI search engines.
Use hook-based introductions, storytelling patterns, and engagement triggers.
Include statistics and credibility signals where relevant.
Return a structured JSON object with this EXACT schema:
{
  "result": {
    "title": "SEO-optimized title",
    "metaDescription": "compelling meta description under 160 chars",
    "sections": [{"heading": "...", "level": 2 or 3, "content": "detailed paragraph..."}],
    "faqs": [{"question": "...", "answer": "..."}],
    "cta": "compelling call to action",
    "keywords": ["list", "of", "targeted", "keywords"],
    "seoInsights": {
      "seoScore": 0-100,
      "readabilityScore": 0-100,
      "rankProbability": 0-100,
      "keywordDensity": [{"keyword": "...", "density": 1.5, "status": "good|low|high"}],
      "headingCheck": [{"issue": "description", "severity": "success|warning|error"}],
      "contentGaps": ["topic not covered..."],
      "improvements": ["actionable suggestion..."]
    }
  }
}`;

    const userPrompt = `Generate a comprehensive blog post for the keyword: "${keyword}"
Search intent: ${intent}${geoContext}${secondaryContext}
Requirements:
- 6-8 well-structured sections with H2 and H3 headings
- Each section should be 100-200 words
- 4-5 FAQ items
- Compelling CTA
- Full SEO analysis`;

    const result = await callAI(systemPrompt, userPrompt);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("generate-blog error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    
    if (message === "RATE_LIMITED") {
      return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (message === "CREDITS_EXHAUSTED") {
      return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
