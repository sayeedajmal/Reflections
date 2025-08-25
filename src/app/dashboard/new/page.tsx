
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor, RichTextEditorRef } from '@/components/rich-text-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Eye, Loader2, Save, Send } from 'lucide-react';
import { rephraseTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PostPreview } from '@/components/post-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.trim()}</p>`)
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
        <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-left mb-8">
                <h1 className="text-4xl font-bold font-headline">Create New Post</h1>
                <p className="text-muted-foreground mt-2">
                Let your ideas flow. Fill in the details below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="grid gap-3">
                        <Label htmlFor="title" className="text-lg font-semibold sr-only">Title</Label>
                        <Input
                            id="title"
                            placeholder="Post Title"
                            className="text-3xl h-16 font-headline tracking-tight"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="content" className="text-lg font-semibold sr-only">Content</Label>
                        <RichTextEditor
                            ref={editorRef}
                            value={content}
                            onChange={setContent}
                            placeholder="Start writing your amazing story here..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Publish</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button size="lg" className="w-full">
                               <Send className="mr-2"/> Publish
                            </Button>
                             <Button variant="outline" size="lg" className="w-full">
                               <Save className="mr-2"/> Save Draft
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Tools</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={handleRephrase} disabled={isRephrasing} variant="outline" className="w-full">
                                {isRephrasing ? (
                                    <>
                                    <Loader2 className="mr-2 animate-spin" /> Rephrasing...
                                    </>
                                ) : (
                                    <>
                                    <Bot className="mr-2" /> Rephrase with AI
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
                                <Eye className="mr-2" />
                                View Post Preview
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
      </div>
    </>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-[450px] w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
      </div>
    }>
      <NewPostForm />
    </Suspense>
  )
}
