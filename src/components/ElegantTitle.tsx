"use client"; // Next.js 客户端组件必须加

import { motion } from "framer-motion";

// 动画配置：更柔和、有质感
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8,
    },
  },
};

const titleVariants = {
  hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
    },
  },
};

const subtitleVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: 0.2,
    },
  },
};

const badgeVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.8, filter: "blur(3px)" },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },
};

export default function ElegantTitle() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4">
      {/* 动画容器 */}
      <motion.div
        className="text-center max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 主标题：质感渐变 + 阴影 */}
        <motion.h1
          variants={titleVariants}
          whileHover={{
            scale: 1.03,
            filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.3))",
            transition: {
              duration: 0.3,
            },
          }}
          style={{
            fontFamily: "PingFang SC",
          }}
          className="
            font-extrabold
            bg-gradient-to-br from-blue-500 via-blue-500 to-blue-400
            bg-clip-text text-transparent
            text-4xl md:text-5xl lg:text-6xl
            tracking-wide leading-relaxed
            drop-shadow-md
            mb-4
          "
        >
          简 序
        </motion.h1>

      </motion.div>
    </div>
  );
}
