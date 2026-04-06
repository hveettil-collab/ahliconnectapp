'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CORPORATE_NEWS } from '@/lib/mockData';
import { ArrowLeft, Share2, Star, Clock, Calendar, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';

/* ── Sticky header that shows title on scroll ── */
function StickyHeader({ title, scrolled, onBack, onShare, saved, onSave }: {
  title: string; scrolled: boolean; onBack: () => void; onShare: () => void; saved: boolean; onSave: () => void;
}) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(18,18,22,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}>
          <ArrowLeft size={20} className="text-white" />
        </button>

        {/* Title appears on scroll */}
        <div className="flex-1 min-w-0 mx-3 overflow-hidden" style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <p className="text-[14px] font-bold text-white truncate leading-tight">{title}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onShare}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}>
            <Share2 size={18} className="text-white" />
          </button>
          <button onClick={onSave}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}>
            {saved
              ? <BookmarkCheck size={18} className="text-[#FFBD4C]" fill="#FFBD4C" />
              : <Star size={18} className="text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── News article card for listing ── */
function NewsCard({ article, onClick }: { article: typeof CORPORATE_NEWS[0]; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left active:scale-[0.98] transition-all">
      <div className="relative rounded-[20px] overflow-hidden" style={{ height: 220 }}>
        <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>{tag}</span>
          ))}
        </div>
        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-white/60">
              <Clock size={10} />
              <span className="text-[10px] font-medium">{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Calendar size={10} />
              <span className="text-[10px] font-medium">{article.date}</span>
            </div>
          </div>
          <p className="text-[16px] font-extrabold text-white leading-tight line-clamp-2">{article.title}</p>
        </div>
      </div>
    </button>
  );
}

/* ── Article detail view ── */
function ArticleDetail({ article, onBack }: { article: typeof CORPORATE_NEWS[0]; onBack: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => setScrolled(el.scrollTop > 260);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.summary });
    }
  };

  // Parse body into paragraphs
  const paragraphs = article.body.split('\n\n');

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: '#121216' }}>
      <StickyHeader
        title={article.title}
        scrolled={scrolled}
        onBack={onBack}
        onShare={handleShare}
        saved={saved}
        onSave={() => setSaved(!saved)}
      />

      <div ref={contentRef} className="h-full overflow-y-auto">
        {/* Hero image */}
        <div className="relative" style={{ height: 380 }}>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, #121216 0%, rgba(18,18,22,0.4) 40%, transparent 70%)',
          }} />
          {/* Date on image */}
          <div className="absolute bottom-6 left-5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/60">
              <Calendar size={12} />
              <span className="text-[12px] font-medium">{article.date}</span>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="relative px-5 pb-24 -mt-2" style={{ background: '#121216' }}>
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white/80 border border-white/15">{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[24px] font-extrabold text-white leading-[1.2] mb-4">{article.title}</h1>

          {/* Author & read time */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#9D63F6]/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#9D63F6]">IHC</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/80">{article.author}</p>
              <p className="text-[10px] text-white/40">{article.readTime}</p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4">
            {paragraphs.map((para, i) => {
              // Check if paragraph is a heading-like line (short, no period, first line of a section)
              const isHeading = para.length < 60 && !para.endsWith('.') && !para.startsWith('•') && !para.startsWith('"');
              const isBullet = para.startsWith('•');

              if (isHeading && i > 0) {
                return <h2 key={i} className="text-[17px] font-bold text-white mt-6 mb-2">{para}</h2>;
              }

              if (isBullet) {
                return (
                  <div key={i} className="flex gap-2.5 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9D63F6] mt-2 shrink-0" />
                    <p className="text-[15px] text-white/75 leading-[1.7]">{para.substring(2)}</p>
                  </div>
                );
              }

              return (
                <p key={i} className="text-[15px] text-white/75 leading-[1.7]">{para}</p>
              );
            })}
          </div>

          {/* Related articles */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <h3 className="text-[15px] font-bold text-white mb-4">More from IHC</h3>
            <div className="space-y-3">
              {CORPORATE_NEWS.filter(n => n.id !== article.id).slice(0, 2).map(related => (
                <div key={related.id} className="flex gap-3 items-start">
                  <div className="w-20 h-16 rounded-[12px] overflow-hidden shrink-0">
                    <img src={related.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white line-clamp-2 leading-tight">{related.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-white/40">{related.readTime}</span>
                      <span className="text-[10px] text-white/40">{related.date}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/30 shrink-0 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main news page ── */
function NewsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');
  const [selectedArticle, setSelectedArticle] = useState<typeof CORPORATE_NEWS[0] | null>(null);

  // If opened with ?id=cn001, show article directly
  useEffect(() => {
    if (articleId) {
      const found = CORPORATE_NEWS.find(n => n.id === articleId);
      if (found) setSelectedArticle(found);
    }
  }, [articleId]);

  // If viewing a specific article
  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => {
          if (articleId) {
            router.back();
          } else {
            setSelectedArticle(null);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#121216' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-5 py-4" style={{ background: 'rgba(18,18,22,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-[18px] font-extrabold text-white">Corporate News</h1>
            <p className="text-[11px] text-white/40">IHC Group Updates</p>
          </div>
        </div>
      </div>

      {/* Article list */}
      <div className="px-4 pb-24 space-y-4">
        {/* Featured (first article) */}
        <NewsCard article={CORPORATE_NEWS[0]} onClick={() => setSelectedArticle(CORPORATE_NEWS[0])} />

        {/* Rest */}
        {CORPORATE_NEWS.slice(1).map(article => (
          <button key={article.id} onClick={() => setSelectedArticle(article)}
            className="w-full flex gap-3 items-start text-left active:scale-[0.98] transition-all p-3 rounded-[16px]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="w-24 h-20 rounded-[14px] overflow-hidden shrink-0">
              <img src={article.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex gap-1.5 mb-1.5">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[8px] font-bold text-white/60 border border-white/10">{tag}</span>
                ))}
              </div>
              <p className="text-[13px] font-bold text-white line-clamp-2 leading-tight">{article.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-white/40">{article.readTime}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                <span className="text-[10px] text-white/40">{article.date}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#121216' }} />}>
      <NewsPageInner />
    </Suspense>
  );
}
