# 🚀 The Ultimate Tech Stack: AI Resume Generator

This document outlines the complete ecosystem of tools, languages, and frameworks used to build the **AI Resume Generator**. Every choice was made to ensure speed, security, and a premium user experience.

---

## 🛠️ Core Languages & Frameworks
*   **TypeScript**: The primary language. It provides end-to-end type safety, ensuring that complex resume data structures remain consistent across the app.
*   **Next.js 14 (App Router)**: Our full-stack powerhouse. We leverage Server Components for performance and SEO, and API Routes for our backend logic.
*   **React 18**: Powers the interactive UI, the multi-step builder, and real-time live previews.
*   **Tailwind CSS**: The styling engine. It allows for rapid, consistent UI development with a focus on modern aesthetics like glassmorphism and smooth transitions.

---

## 🧠 The AI Intelligence Layer
*   **Groq (Llama 3.3 70B)**: Our primary inference engine. Groq is used for its unmatched speed, allowing us to tailor resumes and analyze jobs in milliseconds.
*   **Google Gemini 1.5 Pro**: Used for deep content analysis and complex career advice where high-level reasoning and large context windows are required.
*   **Jina AI**: Utilized for its advanced web-scraping capabilities to extract clean, relevant data from job postings across the web.

---

## 💾 Backend & Infrastructure
*   **Supabase (PostgreSQL)**: Our managed database and backend-as-a-service. It handles user profiles, resume storage, and real-time subscription data.
*   **NextAuth.js**: The security layer. It manages user authentication via Google OAuth and secure magic links.
*   **Vercel**: Our deployment and hosting platform. It provides global CDN, edge execution, and seamless CI/CD integration.
*   **Zustand**: A lightweight state management library used to keep the resume builder's state synchronized without the complexity of Redux.

---

## 💳 Payments & Monetization
*   **Razorpay**: Our integrated payment gateway for the Indian market. It handles the 1-rupee trial verification, autopay setups, and recurring subscriptions.

---

## 📂 Specialized Libraries
*   **jsPDF**: Used for generating high-quality, print-ready PDF resumes directly in the client's browser.
*   **Lucide React**: A comprehensive and consistent icon set for a professional UI.
*   **React Markdown**: Efficiently renders AI-generated suggestions and formatted feedback.
*   **Zod**: Used for robust schema validation, ensuring all API requests and resume data meet strict requirements.

---

## 💻 Software & Development Tools
*   **Antigravity (AI Coding Assistant)**: An advanced agentic AI by Google Deepmind that acted as a pair programmer, architect, and debugger throughout the project.
*   **Visual Studio Code (VS Code)**: The primary Integrated Development Environment (IDE).
*   **Node.js & npm**: The runtime environment and package manager that keeps the project running.
*   **Git & GitHub**: Used for version control, collaboration, and deployment triggers.
*   **Docker**: Ensures a consistent development environment across different machines.
*   **Windows 11**: The primary operating system used for the development of this project.
*   **PowerShell**: The command-line shell used for managing tasks and running scripts.

---

## ✨ Why this Stack?
We chose this stack to balance **innovation** and **reliability**. By combining the speed of **Groq**, the power of **Next.js**, and the simplicity of **Supabase**, we’ve built a product that isn't just a tool—it's a lightning-fast, intelligent career partner.
