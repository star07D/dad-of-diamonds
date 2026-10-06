import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/format";
import { resizedSrc, resizedSrcSet } from "@/lib/image-url";
import { DiamondMark } from "./logo";

export function PostCard({
  post,
  priority = false,
}: {
  post: Post;
  /** Above-the-fold cards load eagerly instead of lazily. */
  priority?: boolean;
}) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)]"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-surface-muted">
        {post.coverImage ? (
          <img
            src={resizedSrc(post.coverImage.src, 640)}
            srcSet={resizedSrcSet(post.coverImage.src, [400, 640, 960])}
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
            alt={post.coverImage.alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        ) : (
          <DiamondMark className="h-10 w-10 text-accent/40" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-muted">
          {formatDate(post.publishedAt)} · {readingTime(post.body)}
        </p>
        <h3 className="font-display text-lg leading-snug">{post.title}</h3>
        <p className="text-sm text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
