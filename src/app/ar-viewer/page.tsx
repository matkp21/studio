import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ARViewerPage() {
  return (
    <PageWrapper title="Augmented Reality Viewer">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>AR Medical Image Viewer</CardTitle>
          <CardDescription>View annotated medical images in augmented reality.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <Construction className="h-16 w-16 mb-4 text-primary" />
          <p className="text-lg font-semibold">AR Viewer Feature Coming Soon!</p>
          <p>This section is currently under development. Stay tuned for updates.</p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
