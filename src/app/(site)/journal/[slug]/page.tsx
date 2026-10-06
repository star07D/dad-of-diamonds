import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/format";
import { resizedSrc, resizedSrcSet } from "@/lib/image-url";
import { PostCard } from "@/components/post-card";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage.src] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: post.title },
        ])}
      />

      <Reveal>
        <nav aria-label="Breadcrumb" className="eyebrow">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <Link href="/journal" className="hover:text-accent">
            Journal
          </Link>
        </nav>
        <h1 className="mt-2 font-display text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {formatDate(post.publishedAt)} · {readingTime(post.body)}
        </p>
      </Reveal>

      <Reveal delay={60} className="mt-8 overflow-hidden rounded-lg">
        {post.coverImage ? (
          <img
            src={resizedSrc(post.coverImage.src, 1000)}
            srcSet={resizedSrcSet(post.coverImage.src, [600, 1000, 1400])}
            sizes="(min-width: 768px) 700px, 100vw"
            alt={post.coverImage.alt}
            className="aspect-[16/9] w-full object-cover"
            fetchPriority="high"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-surface-muted">
            <DiamondMark className="h-12 w-12 text-accent/40" />
          </div>
        )}
      </Reveal>

      <Reveal
        delay={100}
        className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90"
      >
        {post.body}
      </Reveal>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          {/* h1 above is the article title; these cards render h3s, so this
              needs to be an h2 to keep the heading order unbroken. */}
          <h2 className="eyebrow">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <Reveal className="mt-12">
        <Link
          href="/journal"
          className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Back to the journal
        </Link>
      </Reveal>
    </div>
  );
}
