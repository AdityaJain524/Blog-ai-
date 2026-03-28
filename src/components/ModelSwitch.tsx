import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Brain, Sparkles } from "lucide-react";

interface ModelSwitchProps {
  value: "gemini" | "openai" | "hybrid";
  onChange: (value: "gemini" | "openai" | "hybrid") => void;
}

const models = [
  { id: "gemini" as const, label: "Gemini", icon: Zap, desc: "Speed" },
  { id: "hybrid" as const, label: "Hybrid", icon: Sparkles, desc: "Best" },
  { id: "openai" as const, label: "OpenAI", icon: Brain, desc: "Quality" },
];

export function ModelSwitch({ value, onChange }: ModelSwitchProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onChange(model.id)}
          className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === model.id ? "" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {value === model.id && (
            <motion.div
              layoutId="model-switch"
              className="absolute inset-0 rounded-md gradient-primary"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            <model.icon className="h-3.5 w-3.5" />
            {model.label}
          </span>
        </button>
      ))}
    </div>
  );
}
