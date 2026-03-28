import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface BulkKeyword {
  keyword: string;
  status: "pending" | "generating" | "done" | "error";
}

interface BulkGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (keywords: string[]) => void;
  bulkKeywords: BulkKeyword[];
  isRunning: boolean;
}

export function BulkGenerateModal({ open, onOpenChange, onStart, bulkKeywords, isRunning }: BulkGenerateModalProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addKeyword = () => {
    const kw = input.trim();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setKeywords([...keywords, kw]);
      setInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">Bulk Blog Generation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!isRunning && (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  className="bg-secondary border-border"
                />
                <Button size="icon" variant="secondary" onClick={addKeyword}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, i) => (
                  <Badge key={i} variant="info" className="gap-1 cursor-pointer" onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}>
                    {kw} <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <Button variant="hero" className="w-full" disabled={keywords.length === 0} onClick={() => onStart(keywords)}>
                Generate {keywords.length} Blog{keywords.length !== 1 ? "s" : ""}
              </Button>
            </>
          )}

          {bulkKeywords.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {bulkKeywords.map((bk, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-foreground">{bk.keyword}</span>
                  {bk.status === "generating" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {bk.status === "done" && <CheckCircle className="h-4 w-4 text-success" />}
                  {bk.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  {bk.status === "pending" && <span className="text-xs text-muted-foreground">Pending</span>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
