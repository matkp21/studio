// src/components/medico/recommended-tools.tsx
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { allMedicoToolsList } from '@/config/medico-tools-config';
import type { ActiveToolId } from '@/types/medico-tools';
import { ArrowRight, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendedToolsProps {
  toolIds: ActiveToolId[];
  title?: string;
  description?: string;
}

export function RecommendedTools({ 
  toolIds,
  title = "Suggested Next Steps",
  description = "Based on your activity, here are some tools that might be helpful next." 
}: RecommendedToolsProps) {
  const recommendedTools = allMedicoToolsList.filter(tool => toolIds.includes(tool.id) && !tool.comingSoon);

  if (recommendedTools.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Wand2 className="mr-3 h-6 w-6 text-primary" />
            {title}
          </CardTitle>
          <p className="text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedTools.map(tool => (
              <Link key={tool.id} href={tool.href || `/medico/${tool.id}`} passHref>
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0px 8px 15px hsla(var(--primary) / 0.1)" }}
                  className="flex items-center p-4 rounded-lg bg-card hover:bg-background transition-all duration-300 cursor-pointer border h-full"
                >
                  <div className="mr-4 p-2 bg-primary/10 text-primary rounded-md">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground">{tool.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
