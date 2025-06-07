// src/app/explorer/[modelId]/page.tsx
"use client"; // This page needs to be a client component due to hooks and dynamic rendering

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { InteractiveModelViewer } from '@/components/explorer/interactive-model-viewer';
import { interactiveModelsList } from '@/config/interactive-models-config';
import type { InteractiveModel } from '@/types/interactive-models';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Orbit, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = typeof params.modelId === 'string' ? params.modelId : undefined;
  
  const [selectedModel, setSelectedModel] = useState<InteractiveModel | null | undefined>(undefined); // undefined for loading state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (modelId) {
      const foundModel = interactiveModelsList.find(m => m.id === modelId);
      setSelectedModel(foundModel || null); // null if not found
    } else {
      setSelectedModel(null); // No modelId means nothing to load
    }
  }, [modelId]);

  if (!isClient || selectedModel === undefined) {
    return (
      <PageWrapper title="Loading Interactive Model...">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (selectedModel === null) {
    return (
      <PageWrapper title="Model Not Found">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Orbit className="h-5 w-5" />
          <AlertTitle>Error: Model Not Found</AlertTitle>
          <AlertDescription>
            The interactive model you are looking for could not be found. It might have been moved or removed.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button asChild variant="outline">
            <Link href="/explorer">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explorer Hub
            </Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    // No PageWrapper here, as InteractiveModelViewer is designed to be more full-screen like
    <div className="container mx-auto px-2 sm:px-4 py-4 flex flex-col min-h-screen">
        <div className="mb-4">
            <Button asChild variant="outline" size="sm">
            <Link href="/explorer">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explorer Hub
            </Link>
            </Button>
        </div>
        <div className="flex-grow">
            <InteractiveModelViewer model={selectedModel} />
        </div>
    </div>
  );
}
