
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPosts, getUser } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const recentPosts = getPosts().slice(0, 10);
  const carouselImages = [
    { src: "https://images.unsplash.com/photo-1456615074700-1dc12aa7364d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b3Jrc3BhY2UlMjBjb2ZmZWV8ZW58MHx8fHwxNzU1MDk5MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "A tranquil workspace with a laptop and a cup of coffee.", hint: "workspace coffee" },
    { src: "https://images.unsplash.com/photo-1568639152391-61b4303bead7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3cml0aW5nJTIwbm90ZWJvb2t8ZW58MHx8fHwxNzU1MDk5MDQwfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "A person writing in a notebook with a pen.", hint: "writing notebook" },
    { src: "https://images.unsplash.com/photo-1589816634282-bf08f4e43ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxib29rcyUyMHNoZWxmfGVufDB8fHx8MTc1NTA5OTA0MHww&ixlib=rb-4.1.0&q=80&w=1080", alt: "A collection of old books on a wooden shelf.", hint: "books shelf" },
  ];

  return (
    <>
      <section className="h-full relative w-full flex flex-col items-center justify-center text-center snap-section">
        <Carousel
          className="w-screen h-full absolute top-0 left-0 -z-10"
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          opts={{ loop: true }}
        >
          <CarouselContent className="w-full h-full">
            {carouselImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="relative w-full h-screen"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover brightness-50 select-none w-screen"
                  data-ai-hint={image.hint}
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

        </Carousel>

        <div className="container mx-auto px-4 py-8 md:py-12 ">
          <h1 className="text-white text-4xl md:text-7xl font-bold font-headline">
            Reflections
          </h1>
          <p className=" text-white mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Discover insights, stories, and ideas that matter. A space for thoughtful articles on technology, design, and life.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/dashboard/new">
                Start Writing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <a href="#recent-posts" className=" text-white absolute bottom-12 animate-bounce">
          <ArrowDown className="h-8 w-8" />
          <span className="sr-only">Scroll to recent posts</span>
        </a>
      </section>

      <section
        id="recent-posts"
        className="w-full flex flex-col items-center justify-center bg-background min-h-full py-16 snap-section"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">
            Recent Posts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {recentPosts.map((post) => {
              const author = getUser(post.authorId);
              return (
                <article key={post.id} className="p-2 group relative flex items-center gap-4 transition-all shadow-md duration-300 hover:scale-105 hover:shadow-lg rounded-lg">
                  <div className="relative w-1/3 aspect-[4/3] rounded-tl-lg rounded-bl-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={post.imageUrl || "https://images.unsplash.com/photo-1461749280684-dcc9ba868b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8Y29kaW5nfGVufDB8fHx8MTcyMTEwOTE5NHww&ixlib=rb-4.1.0&q=80&w=1080"} // Fallback image
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-base md:text-lg font-bold font-headline leading-tight mb-1">
                      <Link href={`/posts/${post.id}`} className="block">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {post.title}
                      </Link>
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      {author && (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={author.avatarUrl} alt={author.name} />
                            <AvatarFallback>
                              {author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{author.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
