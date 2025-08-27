
# UI/UX Design Prompt: Futuristic Blogging Platform "Reflections"

## **Project Goal:**
Create a visually stunning, futuristic, and highly functional user interface for a modern blogging platform named "Reflections". The design should be clean, professional, and intuitive, prioritizing an excellent user experience for both readers and content creators.

## **Core Aesthetic:**
- **Futuristic & Clean:** Think glassmorphism, subtle gradients, and clean lines. The UI should feel light and modern.
- **Professional:** While futuristic, the design must be professional and suitable for serious content. Typography should be crisp and legible.
- **Color Palette:** A sophisticated palette. A dark mode is essential.
    - **Primary:** A vibrant yet elegant color for calls-to-action, links, and highlights (e.g., a futuristic blue or a warm gold).
    - **Background:** A deep, near-black for dark mode and a clean, off-white for light mode.
    - **Accent:** A secondary color for subtle highlights, badges, and secondary buttons.
- **Typography:**
    - **Headlines:** A sophisticated serif font (like Playfair Display) to convey elegance and authority.
    - **Body Text:** A clean, highly-readable sans-serif font (like PT Sans or Inter) for paragraphs and UI elements.

---

## **Key Pages & User Flows:**

### **1. Public-Facing Pages**

#### **a. Landing Page (`/`)**
- **Hero Section:**
    - A full-screen, captivating hero section.
    - Features an auto-playing carousel of high-quality, atmospheric background images (e.g., workspaces, writing, books). The images should have a subtle dark overlay to ensure text is readable.
    - A large, elegant headline with the blog's name, "Reflections".
    - A concise, inspiring tagline below the headline.
    - A primary call-to-action button: "Start Writing →".
    - An animated "scroll down" indicator at the bottom.
- **Recent Posts Section:**
    - A grid or list of the most recent articles.
    - Each post should be presented in a clean "Card" component.
    - The card should display:
        - A featured image (aspect ratio 4:3).
        - The post title (which is a link to the full article).
        - A short excerpt of the post.
        - The author's avatar, name, and publish date.
    - The card should have a subtle hover effect (e.g., a slight lift or a glowing border).

#### **b. Post Detail Page (`/posts/[id]`)**
- A clean, reader-focused layout.
- The post title is prominent at the top.
- Author details (avatar, name, date) are clearly visible below the title.
- A large, high-quality featured image is displayed.
- The post content, rendered from HTML, must be beautifully formatted with clear headings, paragraphs, lists, and code blocks that match the editor's styling.
- A "Comments" section at the bottom, allowing users to read and write comments.

### **2. Authentication Pages**

#### **a. Login & Signup Pages (`/login`, `/signup`)**
- A centered card-based form on a clean background.
- Clear, simple input fields for email, password, name, etc.
- A prominent primary button for submission.
- A secondary "outline" button for "Login with Google".
- A simple link at the bottom to switch between Login and Signup.
- Forms should include loading states on the buttons.

### **3. Creator Dashboard (Private)**

#### **a. Main Dashboard Page (`/dashboard`)**
- **Header:**
    - A clear title: "Blog Posts".
    - A primary button to "Create New Post".
    - A secondary button to "Generate Ideas" with an AI/Bot icon.
    - An icon-only "Refresh" button.
- **Post List:**
    - A table view of the logged-in user's posts.
    - Columns: Title, Status, Last Updated, and Actions.
    - **Title:** Should be a link to the public post page.
    - **Status:** Should be a "Badge" component (e.g., a green badge for "PUBLISHED", a gray one for "DRAFT").
    - **Actions:** A "more" (three dots) icon that opens a dropdown menu with "Edit" and "Delete" options. Deleting should trigger a confirmation dialog.

#### **b. New / Edit Post Page (`/dashboard/new`, `/dashboard/edit/[id]`)**
- A two-column layout.
- **Main Column (Left):**
    - A large input field for the post title.
    - A rich text editor (like Quill) for the content, with a clean, unobtrusive toolbar. The editor should have a minimum height and scroll internally when content overflows.
- **Sidebar (Right, sticky):**
    - A "Publish" card with two buttons:
        - "Publish" (primary button).
        - "Save Draft" (outline button).
    - An "AI Tools" card with a button to "Rephrase with AI".
    - An "Actions" card with a button for a full-screen "Post Preview" and the delete post functionality.

#### **c. AI Idea Generator Page (`/dashboard/generate`)**
- A two-column layout.
- **Left Column:** A card with a form for "Topic" and "Keywords". A single "Generate Ideas" button.
- **Right Column:** An area to display the generated ideas.
    - Initially shows an empty state with a bot icon.
    - When ideas are generated, they appear in an Accordion list. Each accordion item contains an idea as the trigger and the corresponding outline in the content.
    - Each accordion item should have a "Create Post from this Idea" button.

---

## **Component Library (ShadCN/Tailwind):**
Utilize a library of pre-styled but customizable components:
- **Button:** Primary, Secondary, Outline, Ghost variants.
- **Card:** For post listings, forms, and dashboard widgets.
- **Input & Label:** Clean and modern form elements.
- **Table:** For the dashboard post list.
- **Badge:** For post statuses.
- **DropdownMenu:** For action menus.
- **AlertDialog:** For delete confirmations.
- **Dialog:** For the post preview modal.
- **Rich Text Editor:** A "snow" theme editor like Quill.
- **Accordion:** For displaying AI-generated ideas.
- **Avatar:** For user profiles.
- **Carousel:** For the landing page hero.
- **Skeleton:** For loading states.
- **Toaster:** For non-intrusive notifications (success/error messages).

    