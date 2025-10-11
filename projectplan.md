# ⚙️ SkillSync — AI-Powered Learning Path Manager

A modern fullstack application built with **Next.js 15**, **TypeScript**, **MongoDB**, and **Server Actions**, designed to help users plan and track their learning goals with AI-suggested learning paths and progress tracking.

---

## 🚀 Project Overview

**SkillSync** enables learners to:

- Create and manage learning goals.
- Add related tasks and resources.
- Track progress visually.
- Get **AI-powered learning path suggestions**, summaries, and quizzes.

The app demonstrates modern **Next.js 15 features** — Server Actions, Server Components, SSR, and optimized performance — built on a secure, scalable architecture.

---

## 🧰 Tech Stack

| Layer                  | Technology                                   |
| ---------------------- | -------------------------------------------- |
| **Framework**          | Next.js 15 (App Router, Server Actions, SSR) |
| **Language**           | TypeScript                                   |
| **Database**           | MongoDB (via Mongoose)                       |
| **Authentication**     | Better Auth                                  |
| **UI Library**         | ShadCN + Tailwind CSS + Radix UI             |
| **State Management**   | Zustand                                      |
| **AI Integration**     | OpenAI API                                   |
| **Deployment**         | Vercel                                       |
| **Testing (Optional)** | Vitest / Playwright                          |

---

## 🧩 Core Features

### 🧑‍💻 Authentication

- Implemented using **Better Auth**.
- Session-based secure authentication.
- Protected dashboard and profile routes.
- Server Actions for register, login, and logout.

### 🎯 Learning Goals (CRUD via Server Actions)

- Users can **create**, **edit**, **delete**, and **view** their learning goals.
- Each goal includes:
  - Title, description, tags, deadline, progress, and tasks.
- Implemented entirely using **Next.js Server Actions** for security and performance.

### 🧾 Tasks (CRUD via Server Actions)

- Each goal can have multiple tasks.
- Track completion and progress using Server Actions.
- Automatically update parent goal progress.

### 🤖 AI Assistant (Server Action + OpenAI)

- Suggests structured learning paths based on a goal’s topic.
- Optionally generates quizzes or summaries for any topic.
- Fully handled on the server (no client API calls).

### 📊 Dashboard (Server Components)

- Server-rendered dashboard showing user goals, progress, and AI insights.
- Uses `revalidatePath` for instant UI updates after actions.
- Responsive design with **ShadCN Cards** and **Tables**.

### 👤 Profile

- Update name, bio, and avatar using server actions.
- View learning stats and achievements.

---

## 🧠 Zustand State Management

Used for client-side UI states (filters, selections, local AI responses).

## 🔒 Security Best Practices

| Concern                | Mitigation                                         |
| ---------------------- | -------------------------------------------------- |
| **Auth**               | Better Auth + session validation in Server Actions |
| **Input Sanitization** | Zod validation + FormData parsing                  |
| **Sensitive Keys**     | Environment variables (`.env.local`)               |
| **Rate Limiting**      | Server-side AI throttling                          |
| **CSRF/XSS**           | Built-in protection from Next.js form actions      |

## 🧾 Footer (As Required)

```
<footer className="text-center py-4 text-sm text-muted-foreground border-t mt-8">
  Built by <a href="https://github.com/YOUR_GITHUB" className="underline">Your Name</a> |
  <a href="https://linkedin.com/in/YOUR_LINKEDIN" className="underline ml-1">LinkedIn</a>
</footer>

```

## 🧭 Real-World Considerations

| Concern             | Solution                                      |
| ------------------- | --------------------------------------------- |
| **Scalability**     | MongoDB Atlas + indexed queries               |
| **Performance**     | SSR caching, lazy data fetching               |
| **Error Handling**  | Global error boundaries + toast notifications |
| **Maintainability** | Modular folder structure + TypeScript         |
| **Security**        | Form validation, server-only actions          |
