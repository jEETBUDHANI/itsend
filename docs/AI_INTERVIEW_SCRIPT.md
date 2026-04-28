# AI Mentor Project: Interview Preparation Script

This document is designed for the person presenting the **AI & Chatbot** part of the project. It covers the technical implementation, presentation scripts, and potential cross-questioning.

---

## 1. Core Technical Overview (Must Know)
- **AI Engine:** Google Gemini 1.5 Flash API.
- **Backend:** Flask (Python) with Server-Sent Events (SSE) for streaming.
- **Frontend:** React (TypeScript) with `fetch` and `ReadableStream`.
- **Key Feature:** **Real-time Streaming** (Text appears word-by-word like ChatGPT).
- **Personalization:** The AI receives the student's profile (Class 10/12/College) and conversation history to provide tailored advice.

---

## 2. Presentation Script (English)

### The Opening
"In this project, I was responsible for the **AI Career Mentor module, named 'Shiv'**. Our goal was to create a guidance system that feels more human and responsive than a simple FAQ bot."

### The Implementation
"I integrated the **Google Gemini 1.5 Flash API** for the core intelligence. The most technically challenging part I handled was the **Real-time Streaming**. Instead of making the user wait for a full response, I implemented **SSE (Server-Sent Events)** on the Flask backend. This sends the AI's thoughts in 'chunks' as they are generated."

### The Personalization
"The AI isn't just generic. I built a **Context-Injection system** where the user's academic stage (Class 10, 12, or Graduate), their personality traits, and their previous messages are passed into the AI's memory. This ensures that a Class 10 student gets advice about streams, while a college student gets advice about placements."

---

## 3. Presentation Script (Hinglish)

### The Opening
"Maine is project mein **AI Career Mentor 'Shiv'** wala part develop kiya hai. Iska objective ye tha ki students ko ek expert mentor jaisa experience mile jo unki specifically help kar sake."

### The Implementation
"Technical side par, maine **Google Gemini 1.5 Flash API** use kiya hai. Maine ismein **Real-time Streaming** feature dala hai using **SSE**. Isse kya hota hai ki user ko wait nahi karna padta, jaise hi AI answer generate karna shuru karta hai, wo screen par word-by-word dikhne lagta hai—bilkul ChatGPT ki tarah."

### The Personalization
"Ye AI 'context-aware' hai. Matlab ye sirf questions ke answers nahi deta, balki ye student ki class (10th/12th), unke interest aur unki conversation history ko yaad rakhta hai. Isse advice bohot hi accurate aur personalized ho jati hai."

---

## 4. Likely Cross-Questions (Q&A)

**Q1: Why did you choose Gemini 1.5 Flash?**
> **Answer:** "It is extremely fast, cost-effective, and has a large context window. For an educational tool, we needed something that could handle long conversations without slowing down."

**Q2: How does the 'Streaming' work technically?**
> **Answer:** "On the backend, we use a Python Generator to `yield` data chunks. On the frontend, we use the `fetch` API to open a connection and a `reader` to decode the stream in real-time and update the React state instantly."

**Q3: How do you prevent the AI from giving wrong or out-of-scope answers?**
> **Answer:** "We use **System Prompting**. We give strict instructions to the AI that it is a 'Career Mentor' and should only focus on education, skills, and professional growth. We've also enabled safety filters provided by Google."

**Q4: What was the biggest challenge?**
> **Answer:** "Handling the **Asynchronous Stream** on the frontend. Making sure the text types out smoothly and the chat window automatically scrolls down as the message grows was tricky but improved the UX significantly."

---

## 5. Technical Keywords to Use
- **LLM (Large Language Model):** Gemini is an LLM.
- **Latency:** The delay before an answer starts (Streaming reduces perceived latency).
- **Context Injection:** Feeding user data into the AI prompt.
- **SSE (Server-Sent Events):** The protocol used for streaming data from server to client.
- **JWT Authentication:** Ensures the chat is secure and only for logged-in users.
