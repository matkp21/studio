
// src/app/medico/[toolId]/page.tsx
'use client';

import { useParams, useSearchParams, notFound } from 'next/navigation';
import { allMedicoToolsList } from '@/config/medico-tools-config';
import React, { Suspense, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function MedicoToolPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const toolId = params.toolId as string;
    const topic = searchParams.get('topic');

    const tool = useMemo(() => allMedicoToolsList.find(t => t.id === toolId), [toolId]);

    if (!tool || !tool.component) {
        notFound();
    }

    const ToolComponent = tool.component;

    return (
        <PageWrapper title={tool.title}>
            <Card className="shadow-lg rounded-xl border-border/50">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <tool.icon className="h-7 w-7 text-primary" />
                        {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={
                        <div className="flex justify-center items-center min-h-[200px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    }>
                        <ToolComponent initialTopic={topic} />
                    </Suspense>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}

export default function MedicoToolPage() {
    return (
        <Suspense fallback={
            <PageWrapper title="Loading Tool...">
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </PageWrapper>
        }>
            <MedicoToolPageContent />
        </Suspense>
    );
}
