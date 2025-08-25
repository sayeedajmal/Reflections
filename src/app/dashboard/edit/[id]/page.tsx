
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { notFound, useRouter } from "next/navigation";
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor, type RichTextEditorRef } from '@/components/rich-text-editor';
import { Bot, Eye, Loader2, Save, Send, Trash } from 'lucide-react';
import { rephraseTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PostPreview } from '@/components/post-preview';
import { getPost, updatePost, type PostActionState } from '../../actions';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeletePostButton } from '../../delete-post-button';

const initialState: PostActionState = {};

function SubmitButton({status}: {status: 'PUBLISHED' | 'DRAFT'}) {
  const { pending } = useFormStatus();
  const isPublishing = pending && document.activeElement?.getAttribute('name') === 'status' && document.activeElement?.getAttribute('value') === 'PUBLISHED';
  const isSaving = pending && document.activeElement?.getAttribute('name') === 'status' && document.activeElement?.getAttribute('value') === 'DRAFT';

  if (status === 'PUBLISHED') {
      return (
          <Button type="submit" name="status" value="PUBLISHED" size="lg" className="w-full" disabled={pending}>
              {isPublishing ? <><Loader2 className="mr-2 animate-spin" /> Publishing...</> : <><Send className="mr-2" /> Publish Changes</>}
          </Button>
      );
  }

  return (
       <Button type="submit" name="status" value="DRAFT" variant="outline" size="lg" className="w-full" disabled={pending}>
           {isSaving ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : <><Save className="mr-2" /> Save Draft</>}
       </Button>
  );
}


export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, accessToken } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const updatePostWithId = updatePost.bind(null, params.id, accessToken || "");
  const [state, formAction] = useFormState(updatePostWithId, initialState);
  
  const editorRef = useRef<RichTextEditorRef>(null);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fetchedPost = await getPost(params.id, accessToken);
      if (fetchedPost) {
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
        setCurrentStatus(fetchedPost.status);
      } else {
        notFound();
      }
      setIsLoading(false);
    }
    fetchPost();
  }, [params.id, accessToken]);

  useEffect(() => {
    if (state.message) {
      toast({ title: "Success", description: state.message });
      // Optionally refetch data or optimistically update UI
    }
    if (state.error) {
       toast({ title: "Error", description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

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
  
  if (isLoading) {
    return (
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
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p>Post not found or you do not have permission to view it.</p>
      </div>
    );
  }

  return (
    <>
      <PostPreview
        content={content}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
       <form action={formAction} className="flex flex-col h-full">
        <input type="hidden" name="content" value={content} />
        <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-left mb-8">
                <h1 className="text-4xl font-bold font-headline">Edit Post</h1>
                <p className="text-muted-foreground mt-2">
                  Refine your article and get it ready for your audience.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                     <div className="grid gap-3">
                        <Label htmlFor="title" className="text-lg font-semibold sr-only">Title</Label>
                        <Input
                            id="title"
                            name="title"
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
                        />
                    </div>
                </div>

                <aside className="space-y-6 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Publish</CardTitle>
                            <CardDescription>Status: {currentStatus}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SubmitButton status="PUBLISHED" />
                            <SubmitButton status="DRAFT" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Tools</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={handleRephrase} disabled={isRephrasing} variant="outline" className="w-full" type="button">
                                {isRephrasing ? (
                                    <><Loader2 className="mr-2 animate-spin" /> Rephrasing...</>
                                ) : (
                                    <><Bot className="mr-2" /> Rephrase with AI</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)} type="button">
                                <Eye className="mr-2" /> View Post Preview
                            </Button>
                            <DeletePostButton postId={post.id} />
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
      </form>
    </>
  );
}
