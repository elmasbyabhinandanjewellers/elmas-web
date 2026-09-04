"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Play } from "lucide-react";
import socialMediaApi from "@/api/socialMedia/socialMediaApi";

export default function InstagramStories() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true);

      const res = await socialMediaApi.getInstagramPosts();
      const rawPosts = res?.data?.data || [];

      const uniquePosts = Array.from(
        new Map(rawPosts.map((post) => [post.permalink || post.id, post])).values()
      );

      const formattedPosts = uniquePosts
        .map((post) => ({
          id: post.id,
          caption: post.caption,
          image: post.media_url,
          thumbnail: post.thumbnail_url || post.media_url,
          permalink: post.permalink,
          mediaType: post.media_type,
          timestamp: post.timestamp,
        }))
        .filter((post) => post.permalink && (post.image || post.thumbnail));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Instagram fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const { firstRowPosts, secondRowPosts } = useMemo(() => {
    const even = [];
    const odd = [];

    posts.forEach((post, index) => {
      if (index % 2 === 0) even.push(post);
      else odd.push(post);
    });

    return {
      firstRowPosts: even,
      secondRowPosts: odd,
    };
  }, [posts]);

  return (
    <section className="py-20 bg-cream-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subheading text-forest-500 mb-3">
            FOLLOW OUR JOURNEY
          </p>

          <h2 className="section-heading mb-4">Instagram Stories</h2>

          <a
            href="https://www.instagram.com/elmasbyabhinandan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm tracking-widest text-forest-600 hover:text-forest-700 transition-colors uppercase"
          >
            @ELMASBYABHINANDANJEWELLERS <ArrowRight size={14} />
          </a>
        </div>

        {loading ? (
          <>
            <InstagramSkeletonRow />
            <InstagramSkeletonRow />
          </>
        ) : posts.length > 0 ? (
          <>
            <InstagramRow
              posts={firstRowPosts}
              animation="animate-scroll-left"
              duration="300s"
            />

            <InstagramRow
              posts={secondRowPosts}
              animation="animate-scroll-right"
              duration="300s"
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

function InstagramRow({ posts, animation, duration }) {
  if (!posts.length) return null;

  return (
    <div className="relative mb-3 overflow-hidden">
      <div
        className={`flex gap-3 w-max ${animation}`}
        style={{ animationDuration: duration }}
      >
        {posts.map((item, index) => (
          <InstagramCard
            key={item.permalink || item.id}
            item={item}
            index={index}
          />
        ))}

        {posts.map((item, index) => (
          <InstagramCard
            key={`marquee-copy-${item.permalink || item.id}`}
            item={item}
            index={index}
            ariaHidden
          />
        ))}
      </div>
    </div>
  );
}

function InstagramCard({ item, index, ariaHidden = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  const isVideo = item.mediaType === "VIDEO";
  const displayImage = item.thumbnail || item.image;

  return (
    <a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : 0}
      className="group relative flex-shrink-0 w-64 h-64 overflow-hidden cursor-pointer bg-forest-700/10"
    >
      {!imageFailed ? (
        <img
          src={displayImage}
          alt={item.caption || `Instagram post ${index + 1}`}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-forest-700/10 text-forest-700 text-xs tracking-widest uppercase px-6 text-center">
          View on Instagram
        </div>
      )}

      {isVideo && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
          <Play size={14} className="text-white fill-white" />
        </div>
      )}

      <div className="absolute inset-0 bg-forest-700/0 group-hover:bg-forest-700/30 transition-colors duration-300 flex items-center justify-center">
        <Heart
          size={32}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </a>
  );
}

function InstagramSkeletonRow() {
  return (
    <div className="relative mb-3 overflow-hidden">
      <div className="flex gap-3 w-max">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 h-64 bg-forest-700/10 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}