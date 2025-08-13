import type { User, Post, Comment } from './types';

const users: User[] = [
  { id: '1', name: 'Eleanor Vance', email: 'eleanor@example.com', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '2', name: 'Marcus Holloway', email: 'marcus@example.com', avatarUrl: 'https://placehold.co/100x100.png' },
];

const posts: Post[] = [
  {
    id: '1',
    title: 'The Art of Minimalist Design',
    content: 'Minimalist design is not about what you can add, but what you can take away. It is a philosophy that encourages us to focus on the essential, to strip away the superfluous and to find beauty in simplicity. This approach can be applied to many areas of life, from the way we decorate our homes to the way we design our digital interfaces. In this post, we will explore the principles of minimalist design, look at some inspiring examples, and discuss how you can incorporate this aesthetic into your own creative work. The journey into minimalism begins with a single step: decluttering. By removing unnecessary elements, we create space for what truly matters, allowing the core message to shine through with clarity and purpose.',
    excerpt: 'Discover the principles of minimalist design and how to apply them to create beautiful, functional, and uncluttered experiences.',
    authorId: '1',
    publishedAt: '2024-05-15T10:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'Crafting the Perfect Morning Routine',
    content: 'How you start your day can set the tone for everything that follows. A well-crafted morning routine can boost your productivity, improve your mood, and help you achieve your long-term goals. There is no one-size-fits-all solution, but there are some common elements that many successful people share. These include waking up early, hydrating, exercising, meditating, and planning your day. We will delve into the science behind these habits and provide a step-by-step guide to creating a morning routine that works for you. Remember, consistency is key. It may take time to build these new habits, but the long-term benefits are well worth the effort.',
    excerpt: 'Learn how to build a morning routine that increases productivity, enhances well-being, and sets you up for a successful day.',
    authorId: '2',
    publishedAt: '2024-05-20T14:30:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'The Future of Remote Work',
    content: 'The world of work is undergoing a profound transformation. Remote work, once a niche arrangement, has become mainstream for millions of people around the globe. This shift presents both opportunities and challenges for companies and employees alike. In this article, we will examine the trends shaping the future of remote work, from the rise of hybrid models to the importance of asynchronous communication. We will also explore the tools and strategies that can help teams thrive in a distributed environment. The future is flexible, and adapting to this new reality is crucial for success in the modern workplace.',
    excerpt: 'Explore the trends, challenges, and opportunities that are shaping the future of remote work and distributed teams.',
    authorId: '1',
    publishedAt: '2024-05-25T09:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    title: 'A Deep Dive into Sustainable Living',
    content: 'Sustainable living is a lifestyle that aims to reduce one\'s environmental impact. It involves making conscious choices about the products we buy, the food we eat, and the energy we consume. This post will serve as a practical guide to adopting a more sustainable lifestyle. We will cover topics such as reducing waste, conserving water, eating a plant-based diet, and supporting ethical brands. Every small change can make a difference, and together, our collective actions can create a healthier planet for future generations. It\'s not about perfection, but about progress.',
    excerpt: 'A practical guide to making more sustainable choices in your everyday life, from reducing waste to conscious consumerism.',
    authorId: '2',
    publishedAt: '2024-06-01T11:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    title: 'The Power of Storytelling in Marketing',
    content: 'In a world saturated with information, storytelling is one of the most powerful tools a marketer can wield. A good story can capture attention, evoke emotion, and build a lasting connection with your audience. It can transform a simple product into something meaningful and memorable. This article explores the art and science of storytelling in marketing. We will look at classic narrative structures, analyze successful brand stories, and provide a framework for crafting compelling narratives that resonate with your target customers. Learn how to turn your brand into a story that people want to hear.',
    excerpt: 'Learn how to harness the power of narrative to create compelling marketing campaigns that captivate and convert your audience.',
    authorId: '1',
    publishedAt: '2024-06-05T16:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
    {
    id: '6',
    title: 'Navigating the World of AI Ethics',
    content: 'Artificial intelligence is rapidly changing our world, and with this power comes great responsibility. The field of AI ethics is concerned with the moral implications of creating and deploying intelligent systems. Key issues include bias in algorithms, the potential for job displacement, and the privacy of personal data. This post provides an overview of the key ethical challenges in AI and discusses the frameworks and principles that are being developed to address them. As we continue to build more powerful AI, it is crucial that we do so in a way that is fair, transparent, and beneficial to all of humanity.',
    excerpt: 'An introduction to the complex ethical challenges posed by artificial intelligence and the ongoing efforts to ensure its responsible development.',
    authorId: '2',
    publishedAt: '2024-06-10T12:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

const comments: Comment[] = [
  { id: '1', postId: '1', authorId: '2', content: 'Great insights! Simplicity is truly the ultimate sophistication.', createdAt: '2024-05-16T11:00:00Z' },
  { id: '2', postId: '1', authorId: '1', content: 'Thank you! Glad you found it useful.', createdAt: '2024-05-16T12:30:00Z' },
  { id: '3', postId: '2', authorId: '1', content: 'I\'ve been trying to perfect my morning routine for months. This is super helpful!', createdAt: '2024-05-21T08:00:00Z' },
];

export function getPosts(): Post[] {
  return posts;
}

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function getUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function getComments(postId: string): Comment[] {
  return comments.filter((comment) => comment.postId === postId);
}
