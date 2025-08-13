
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor, type RichTextEditorRef } from '@/components/rich-text-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Eye, Loader2 } from 'lucide-react';
import { rephraseTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PostPreview } from '@/components/post-preview';


export default function EditPostPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id);
  const [content, setContent] = useState(post?.content || '');
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<RichTextEditorRef>(null);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRephrase = async () => {
    const selection = editorRef.current?.getSelection();
    if (!selection || selection.length === 0) {
      toast({
        title: "No Text Selected",
        description: "Please select the text you want to rephrase.",
        variant: "destructive",
      });
      return;
    }

    setIsRephrasing(true);
    const result = await rephraseTextAction(selection.text);
    setIsRephrasing(false);

    if (result.error) {
       toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.rephrasedText) {
      editorRef.current?.replaceSelection(result.rephrasedText);
    }
  };

  if (!post) {
    notFound();
  }
  
  return (
    <>
      <PostPreview 
        content={content}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
      <div className="flex flex-col h-full">
        <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8 flex-grow">
          <div className="text-center pt-8">
            <h1 className="text-4xl font-bold font-headline">Edit Post</h1>
            <p className="text-muted-foreground mt-2">
              Refine your article and get it ready for your audience.
            </p>
          </div>

          <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="title" className="text-lg font-semibold sr-only">Title</Label>
                <Input id="title" defaultValue={post.title} className="text-2xl h-14 font-headline tracking-tight" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="content" className="text-lg font-semibold sr-only">Content</Label>
                <div className="flex justify-end">
                  <Button onClick={handleRephrase} disabled={isRephrasing} variant="outline" size="sm">
                    {isRephrasing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rephrasing...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" /> Rephrase with AI
                      </>
                    )}
                  </Button>
                </div>
                {isMounted ? (
                  <RichTextEditor
                    ref={editorRef}
                    value={content}
                    onChange={setContent}
                  />
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                )}
              </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 border-t pt-6 mt-8 sticky bottom-0 bg-background py-4">
          <Button variant="outline" size="lg" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="lg">Save Draft</Button>
          <Button size="lg">Update Post</Button>
        </div>
      </div>
    </>
  );
}
