// Adding type declarations to extend Next.js types

// Augment the built-in types
declare module 'next' {
  interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

// Default export to make the file a module
export {};
