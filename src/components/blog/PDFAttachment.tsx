import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/glass/GlassCard';

interface PDFAttachmentProps {
  name: string;
  url: string;
}

export const PDFAttachment = ({ name, url }: PDFAttachmentProps) => {
  return (
    <GlassCard className="p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
        <FileText className="h-6 w-6 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">PDF Document</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer" download>
          <Download className="h-4 w-4 mr-1" /> Download
        </a>
      </Button>
    </GlassCard>
  );
};
