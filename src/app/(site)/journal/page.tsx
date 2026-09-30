import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Buying guides and notes on diamonds and fine jewellery — the 4 Cs, budgets, and looking after what you own.",
};

export default async function JournalPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <p className="eyebrow">Journal</p>
        <h1 className="mt-2 font-display text-4xl">Notes on diamonds and jewellery</h1>
        <p className="mt-3 max-w-lg text-muted">
          Buying guides and practical notes — what actually matters when
          choosing a stone, and how to look after what you own.
        </p>
        <h2 className="sr-only">Posts</h2>
      </Reveal>

      {posts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DiamondMark className="h-8 w-8 text-accent/60" />
          <p className="mt-4 text-muted">Nothing published yet — check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 70}>
              <PostCard post={post} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
