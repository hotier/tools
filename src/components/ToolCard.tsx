"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ToolCardProps {
  href: string;
  label: string;
  description: string;
  index?: number;
  layout?: "grid" | "list";
  showDate?: boolean;
  date?: string;
  showUsage?: boolean;
  usage?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  }),
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2
    }
  }
};

export default function ToolCard({
  href,
  label,
  description,
  index = 0,
  layout = "grid",
  showDate = false,
  date,
  showUsage = false,
  usage
}: ToolCardProps) {
  const isList = layout === "list";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Link
        href={href}
        className={isList ? "block p-4 rounded-lg border bg-card hover:border-primary transition-colors" : "p-4 rounded-lg border bg-card hover:border-primary transition-colors block"}
      >
        {isList ? (
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {index + 1}
            </span>
            <div className="flex-1">
              <h2 className="font-semibold mb-1">{label}</h2>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            {showDate && date && (
              <span className="text-xs text-muted-foreground">{date}</span>
            )}
            {showUsage && usage !== undefined && (
              <span className="text-sm text-muted-foreground">{usage} 次使用</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-semibold">{label}</h2>
              {showDate && date && (
                <span className="text-xs text-muted-foreground">{date}</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}