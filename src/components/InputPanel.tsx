import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModelSwitch } from "@/components/ModelSwitch";
import { Search, Target, Layers, Globe, Plus, X } from "lucide-react";

export interface BlogInputData {
  keyword: string;
  secondaryKeywords: string[];
  intent: "informational" | "transactional" | "navigational";
  model: "gemini" | "openai" | "hybrid";
  geoTarget: string;
}

interface InputPanelProps {
  onGenerate: (data: BlogInputData) => void;
  isGenerating: boolean;
  externalKeyword?: string;
  externalSecondary?: string[];
  externalIntent?: BlogInputData["intent"];
}

const intents = [
  { id: "informational" as const, label: "Informational", icon: Search },
  { id: "transactional" as const, label: "Transactional", icon: Target },
  { id: "navigational" as const, label: "Navigational", icon: Layers },
];

export function InputPanel({ onGenerate, isGenerating, externalKeyword, externalSecondary, externalIntent }: InputPanelProps) {
  const [keyword, setKeyword] = useState(externalKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(externalSecondary || []);
  const [newSecondary, setNewSecondary] = useState("");
  const [intent, setIntent] = useState<BlogInputData["intent"]>(externalIntent || "informational");
  const [model, setModel] = useState<BlogInputData["model"]>("hybrid");
  const [geoTarget, setGeoTarget] = useState("");

  const addSecondary = () => {
    if (newSecondary.trim() && secondaryKeywords.length < 5) {
      setSecondaryKeywords([...secondaryKeywords, newSecondary.trim()]);
      setNewSecondary("");
    }
  };

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    onGenerate({ keyword: keyword.trim(), secondaryKeywords, intent, model, geoTarget });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-heading">Blog Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Primary Keyword */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Primary Keyword</label>
          <Input
            placeholder="e.g. best AI tools for SEO"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        {/* Secondary Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Secondary Keywords</label>
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={newSecondary}
              onChange={(e) => setNewSecondary(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSecondary()}
              className="bg-secondary border-border"
            />
            <Button size="icon" variant="secondary" onClick={addSecondary}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {secondaryKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {secondaryKeywords.map((kw, i) => (
                <Badge key={i} variant="info" className="gap-1 cursor-pointer" onClick={() =>
                  setSecondaryKeywords(secondaryKeywords.filter((_, idx) => idx !== i))
                }>
                  {kw} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Intent */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Search Intent</label>
          <div className="flex flex-col gap-2">
            {intents.map((i) => (
              <button
                key={i.id}
                onClick={() => setIntent(i.id)}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
                  intent === i.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                <i.icon className="h-4 w-4 shrink-0" />
                <span>{i.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GEO Target */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> GEO Target (optional)
          </label>
          <Input
            placeholder="e.g. United States"
            value={geoTarget}
            onChange={(e) => setGeoTarget(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">AI Model</label>
          <ModelSwitch value={model} onChange={setModel} />
        </div>

        {/* Generate Button */}
        <Button
          variant="hero"
          className="w-full"
          size="lg"
          onClick={handleGenerate}
          disabled={!keyword.trim() || isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Blog"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
