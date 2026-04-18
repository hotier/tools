"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { toolCategories } from "./layout/Sidebar";
import ElegantTitle from "./ElegantTitle";
import { categoryRoutes } from "@/data/routes";

export function HomeContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ElegantTitle />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {toolCategories.map((cat, index) => (
          <motion.div
            key={cat.category}
            custom={index}
            variants={{
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
                transition: { duration: 0.2 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link
              href={categoryRoutes[cat.category] || "/"}
              className="group p-6 rounded-lg border bg-card hover:border-primary transition-colors block"
            >
              <div className="flex items-start space-x-4">
                <div className="text-primary">{cat.icon}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {cat.category}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-1">
                    {cat.items.map((i) => i.label).join("、")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}