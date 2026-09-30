import "server-only";
import type { Post } from "./types";
import { SAMPLE_POSTS } from "./sample-posts";
import { sanityConfigured } from "@/sanity/env";
import { fetchPostsFromSanity } from "@/sanity/lib/queries";

/**
 * Single entry point for reading journal posts — same pattern as
 * `src/lib/products.ts`. Sanity when configured, sample posts otherwise, so
 * the journal always renders.
 */
async function loadPosts(): Promise<Post[]> {
  if (sanityConfigured) {
    try {
      return await fetchPostsFromSanity();
    } catch (err) {
      console.error("[posts] Sanity fetch failed, using sample data:", err);
      return SAMPLE_POSTS;
    }
  }
  return SAMPLE_POSTS;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await loadPosts();
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug);
}

/** Other recent posts, for "keep reading" at the bottom of an article. */
export async function getRelatedPosts(
  post: Pick<Post, "id">,
  limit = 3,
): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.id !== post.id).slice(0, limit);
}
