
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface PostPreviewProps {
  content: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostPreview({ content, open, onOpenChange }: PostPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
          <DialogDescription>
            This is how your post will look to readers.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full w-full">
            <div
                className="prose prose-lg dark:prose-invert max-w-none p-4 ql-editor"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
