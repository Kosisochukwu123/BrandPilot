// src/components/dashboard/posters/poster-success-panel.tsx
import { motion } from "framer-motion";

interface PosterSuccessPanelProps {
  matchScore: number;
  recommendedPlatform: string;
  engagementLevel: string;
}

export function PosterSuccessPanel({ matchScore, recommendedPlatform, engagementLevel }: PosterSuccessPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-primary/30 bg-primary/5 p-5"
    >
      <p className="font-medium">🎉 Your poster is ready!</p>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <p className="text-xl font-semibold text-primary">{matchScore}%</p>
          <p className="text-xs text-muted-foreground">Brand Match</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{recommendedPlatform}</p>
          <p className="text-xs text-muted-foreground">Best Platform</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{engagementLevel}</p>
          <p className="text-xs text-muted-foreground">Est. Engagement</p>
        </div>
      </div>
    </motion.div>
  );
}