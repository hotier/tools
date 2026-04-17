"use client";

import React from "react";
import tools from "@/data/tools";

interface ToolDescriptionProps {
  href: string;
}

export function ToolDescription({ href }: ToolDescriptionProps) {
  const tool = tools
    .flatMap((cat) => cat.items)
    .find((item) => item.href === href);

  if (!tool) return null;

  const renderContent = () => {
    const lines = tool.description.split('\n');
    const content: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('#')) {
        // 处理之前的段落
        if (currentParagraph.length > 0) {
          content.push(
            <p key={`p-${index}`} className="mb-4">
              {currentParagraph.map((paraLine, paraIndex) => (
                <React.Fragment key={paraIndex}>
                  {paraLine}
                  {paraIndex < currentParagraph.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
          currentParagraph = [];
        }
        // 计算标题级别
        const headingLevel = line.match(/^#+/)?.[0].length || 1;
        const normalizedLevel = Math.min(Math.max(headingLevel, 1), 6); // 限制在 1-6 级
        const headingText = line.replace(/^#+/, '').trim();
        
        // 根据级别创建不同的标题标签和样式
        const headingClasses = [
          "font-semibold mb-2 mt-6 first:mt-0 text-foreground",
          normalizedLevel === 1 ? "text-lg pl-3 border-l-4 border-primary" :
          normalizedLevel === 2 ? "text-base" :
          normalizedLevel === 3 ? "text-sm font-medium" :
          "text-sm font-medium"
        ].join(' ');
        
        // 使用条件渲染来创建不同级别的标题
        let headingElement;
        switch (normalizedLevel) {
          case 1:
            headingElement = <h1 key={`h-${index}`} className={headingClasses}>{headingText}</h1>;
            break;
          case 2:
            headingElement = <h2 key={`h-${index}`} className={headingClasses}>{headingText}</h2>;
            break;
          case 3:
            headingElement = <h3 key={`h-${index}`} className={headingClasses}>{headingText}</h3>;
            break;
          case 4:
            headingElement = <h4 key={`h-${index}`} className={headingClasses}>{headingText}</h4>;
            break;
          case 5:
            headingElement = <h5 key={`h-${index}`} className={headingClasses}>{headingText}</h5>;
            break;
          default:
            headingElement = <h6 key={`h-${index}`} className={headingClasses}>{headingText}</h6>;
        }
        
        content.push(headingElement);
      } else if (line.trim() === '') {
        // 处理空行，结束当前段落
        if (currentParagraph.length > 0) {
          content.push(
            <p key={`p-${index}`} className="mb-4">
              {currentParagraph.map((paraLine, paraIndex) => (
                <React.Fragment key={paraIndex}>
                  {paraLine}
                  {paraIndex < currentParagraph.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
          currentParagraph = [];
        }
      } else {
        // 添加到当前段落
        currentParagraph.push(line);
      }
    });

    // 处理最后一个段落
    if (currentParagraph.length > 0) {
      content.push(
        <p key="p-last" className="mb-4">
          {currentParagraph.map((paraLine, paraIndex) => (
            <React.Fragment key={paraIndex}>
              {paraLine}
              {paraIndex < currentParagraph.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }

    return content;
  };

  return (
    <div className="mt-8 p-4 rounded-lg border bg-card/50">
      <div className="text-muted-foreground text-sm leading-relaxed">
        {renderContent()}
      </div>
    </div>
  );
}
