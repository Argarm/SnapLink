# Copilot Instructions for SnapLink URL Shortener

This document provides guidelines for AI coding assistants to effectively understand and contribute to the SnapLink URL shortener project.

## 1. Project Overview & Core Purpose:

SnapLink is a URL shortening service that allows users to create short, memorable links for long URLs. Its core purpose is to simplify URL sharing and management by providing a user-friendly interface for shortening URLs and handling redirections to the original long URLs.

## 2. Technology Stack & Key Libraries/Frameworks:

* **Primary Language:** TypeScript, JavaScript
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Database:** MongoDB
* **ODM:** Mongoose
* **Validation:** `validator` library
* **Environment Variables:** `dotenv`

## 3. Architectural Patterns & Design Philosophy:

The project primarily follows a **Monolithic** architecture using the **Next.js App Router** for both frontend and backend API routes.

* **Client-Side Rendering (CSR):** Used for interactive components like the URL shortening form (`src/app/page.tsx`, `src/app/shorten/page.tsx`).
* **Server-Side Rendering (SSR) / Static Site Generation (SSG):** Used for dynamic routing and data fetching on the server (e.g., `src/app/[shortId]/page.tsx` for redirection).
* **API Routes:** Backend logic is exposed via Next.js API routes (`src/app/api/shorten/route.ts`, `src/app/api/[shortId]/route.ts`).
* **Database Abstraction:** A `lib/db.js` file handles MongoDB connection logic, ensuring a single, cached connection.
* **Mongoose Models:** Database schemas are defined using Mongoose in the `models/` directory (`models/Url.js`).
* **Caching:** In-memory caching is implemented in API routes for frequently accessed URLs and short ID generation to improve performance.

## 4. Coding Conventions & Style Guide:

* **File Naming:**
    * Next.js pages and API routes follow the framework's conventions (e.g., `page.tsx`, `route.ts`, `[param].tsx`).
    * Utility and model files use `kebab-case` or `camelCase` (e.g., `lib/db.js`, `models/Url.js`).
* **Indentation:** 2 spaces (inferred from code samples).
* **Quotes:** Single quotes preferred for strings in JavaScript/TypeScript (inferred).
* **TypeScript:** Used for type safety in Next.js components and API routes. `tsconfig.json` indicates strict typing.
* **ESLint:** Configured with `next/core-web-vitals` and `next/typescript` for code quality.
* **Tailwind CSS:** Classes are directly applied in JSX for styling.

## 5. Build System & CI/CD:

* **Build Tool:** Next.js CLI `next build`
* **Package Manager:** npm (or yarn/pnpm/bun based on `package.json` scripts).
* **CI/CD:** No explicit CI/CD configuration files are provided, but deployment on Vercel is mentioned in the `README.md`.

## 6. Testing Strategy & Frameworks:

No specific testing frameworks or established testing practices are discernible from the provided codebase.

## 7. Key Modules/Services & Their Responsibilities:

* `lib/db.js`: Manages the MongoDB connection, including connection pooling, cooldowns, and error handling for robust database access.
* `models/Url.js`: Defines the Mongoose schema for URL documents, including `longUrl`, `shortCode`, `createdAt`, and `clicks`. It also includes schema-level indexes and static helper methods for common queries.
* `src/app/api/shorten/route.ts`: Handles the API endpoint for URL shortening, including URL validation, unique short ID generation (with collision handling and caching), and saving new URLs to the database.
* `src/app/[shortId]/page.tsx` (or `src/app/api/[shortId]/route.ts`): Handles the dynamic routing for shortened URLs, retrieves the original URL from the database, increments click counts, and performs a redirect.
* `src/app/page.tsx` (or `src/app/shorten/page.tsx`): The main frontend page responsible for displaying the URL shortening form, handling user input, and displaying the shortened URL.

## 8. API Usage Guidelines (Internal/External):

* **Internal API:**
    * URL shortening endpoint: `POST /api/shorten`. Expects a JSON body with a `url` field. Returns a `shortCode`.
    * URL redirection: `GET /[shortId]`. This is handled by a dynamic Next.js page or API route that redirects to the `longUrl`.
* **Validation:** All incoming URLs to the `/api/shorten` endpoint must be validated using `validator.isURL` and must include a protocol (e.g., `http://` or `https://`).
* **Error Handling:** API endpoints return JSON objects with an `error` field on failure and appropriate HTTP status codes (e.g., 400 for bad requests, 500 for server errors, 404 for not found).

## 9. Security Best Practices (if evident):

* **Environment Variables:** Sensitive information like `MONGODB_URI` is loaded from `.env.local` using `dotenv`.
* **Input Validation:** URLs are explicitly validated using the `validator` library to prevent invalid input.
* **Connection Security:** Mongoose connection options include `useNewUrlParser` and `useUnifiedTopology`.
* **TTL Index:** URLs in the database have a Time-To-Live (TTL) index set to 90 days, meaning they will automatically expire, helping to manage data and potentially reducing the attack surface by removing old links.

## 10. Common Pitfalls & "Gotchas" (Optional - if inferable):

* **Mongoose OverwriteModelError:** The `mongoose.models.URL || mongoose.model('URL', urlSchema)` pattern is used in `models/Url.js` to prevent this common Next.js issue during hot reloading in development.
* **Database Connection Management:** The `lib/db.js` utility ensures a single, persistent database connection and handles connection errors and reconnections, which is crucial for serverless environments like Next.js API routes.
* **Short ID Collisions:** The `generateUniqueShortId` function in `src/app/api/shorten/route.ts` includes retry logic and falls back to a timestamp-based ID to mitigate collision risks, especially under high load.
* **Caching Strategy:** Simple in-memory caches are used for URL lookups and newly generated short IDs. This cache is not persistent across serverless function invocations and has a TTL, so it's a best-effort optimization.

## 11. Important Scripts & Tooling:

* `npm run dev`: Starts the Next.js development server with Turbopack enabled for faster compilation.
* `npm run build`: Builds the Next.js application for production.
* `npm run start`: Starts the Next.js production server.
* `npm run lint`: Runs ESLint for code linting.

---

**Instructions for the AI Assistant:**

* When generating code, strictly adhere to the identified coding conventions and architectural patterns.
* Prioritize using the specified key libraries and frameworks for new functionality.
* Ensure new code is consistent with the testing strategy (or lack thereof, implying no new testing frameworks should be introduced without discussion).
* If unsure about a specific convention not covered, ask for clarification rather than making assumptions.
* When refactoring, maintain or improve adherence to the project's established patterns, especially regarding database connection, Mongoose model usage, and API route structure.
* Pay close attention to URL validation and error handling in API routes.
* When proposing changes related to database interactions, consider the performance optimizations and connection management implemented in `lib/db.js` and `models/Url.js`.
* For frontend changes, prioritize using Tailwind CSS for styling and follow Next.js App Router conventions.