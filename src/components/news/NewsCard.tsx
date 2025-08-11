// src/components/news/NewsCard.tsx
import React from "react";
import { ExternalLink } from "lucide-react";
import { NewsItem } from "../../types/news";

interface Props {
  item: NewsItem;
}

const NewsCard: React.FC<Props> = ({ item }) => {
  const pub = new Date(item.pub_date);
  const dateStr = pub.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt=""
            className="h-20 w-28 rounded-lg object-cover border border-gray-100"
            loading="lazy"
          />
        ) : (
          <div className="h-20 w-28 rounded-lg bg-gray-100" />
        )}

        <div className="flex-1 min-w-0">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg font-semibold text-gray-900 hover:underline"
          >
            {item.title}
          </a>
          <div className="mt-1 text-sm text-gray-500">
            Published by <span className="font-medium text-gray-700">{item.source_name}</span> on {dateStr}
          </div>
          {item.excerpt && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.excerpt}</p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 capitalize">
              {item.category}
            </span>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              Read <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
