
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor, RichTextEditorRef } from '@/components/rich-text-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Eye, Loader2 } from 'lucide-react';
import { rephraseTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PostPreview } from '@/components/post-preview';

function NewPostForm() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const editorRef = useRef<RichTextEditorRef>(null);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

   useEffect(() => {
    const initialTitle = searchParams.get('title');
    const initialContent = searchParams.get('content');
    if (initialTitle) {
      setTitle(decodeURIComponent(initialTitle));
    }
    if (initialContent) {
      // Replace newlines with paragraph tags for better HTML formatting
      const formattedContent = decodeURIComponent(initialContent)
        .split('\n')
        .map(p => `<p>${p}</p>`)
        .join('');
      setContent(formattedContent);
    }
  }, [searchParams]);

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

  return (
    <>
      <PostPreview
        content={content}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
      <div className="flex flex-col h-full">
        <div className='flex-grow flex flex-col justify-center mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold font-headline">Create New Post</h1>
            <p className="text-muted-foreground mt-2">
              Let your ideas flow. Fill in the details below to get started.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title" className="text-lg font-semibold sr-only">Title</Label>
              <Input
                id="title"
                placeholder="Post Title"
                className="text-2xl h-14 font-headline tracking-tight"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
                 <RichTextEditor
                    ref={editorRef}
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your amazing story here..."
                  />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 border-t pt-6 mt-8 bg-background sticky bottom-0 py-4">
          <Button variant="outline" size="lg" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="lg">Save Draft</Button>
          <Button size="lg">Publish</Button>
        </div>
      </div>
    </>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:p-8 space-y-6">
          <Skeleton className="h-14 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-24 ml-auto" />
            <Skeleton className="h-[400px] w-full" />
          </div>
      </div>
    }>
      <NewPostForm />
    </Suspense>
  )
}
