/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Book } from '../types';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_THEMES: { [key: string]: { bg: string; text: string; accent: string } } = {
  'Computer Science': { bg: 'from-emerald-900 to-teal-950', text: 'text-emerald-100', accent: 'border-emerald-500 bg-emerald-500/20' },
  'Engineering': { bg: 'from-blue-900 to-indigo-950', text: 'text-blue-100', accent: 'border-blue-500 bg-blue-500/20' },
  'Physics': { bg: 'from-rose-950 to-red-950', text: 'text-rose-100', accent: 'border-rose-500 bg-rose-500/20' },
  'Mathematics': { bg: 'from-amber-950 to-amber-900', text: 'text-amber-100', accent: 'border-amber-400 bg-amber-400/20' },
  'Management & Finance': { bg: 'from-purple-900 to-violet-950', text: 'text-purple-100', accent: 'border-purple-500 bg-purple-500/20' },
  'Chemistry & Biology': { bg: 'from-cyan-950 to-teal-900', text: 'text-cyan-100', accent: 'border-cyan-500 bg-cyan-500/20' },
};

export const BookCover: React.FC<BookCoverProps> = ({ book, size = 'md' }) => {
  // If an image exists and is valid, show it
  if (book.images && book.images.length > 0 && book.images[0]) {
    return (
      <div className={`relative overflow-hidden rounded-md shadow-md aspect-[3/4] w-full bg-surface-container`}>
        <img
          src={book.images[0]}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        {book.status === 'sold' && (
          <div className="absolute inset-0 bg-primary-custom/80 flex items-center justify-center">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
              Sold
            </span>
          </div>
        )}
      </div>
    );
  }

  // Generate dynamic aesthetic textbook cover
  const theme = CATEGORY_THEMES[book.category] || { bg: 'from-slate-800 to-slate-950', text: 'text-slate-100', accent: 'border-slate-500 bg-slate-500/20' };

  const paddingClass = size === 'sm' ? 'p-3' : size === 'lg' ? 'p-6' : 'p-4';
  const titleClass = size === 'sm' ? 'text-xs font-semibold' : size === 'lg' ? 'text-xl font-bold' : 'text-sm font-bold';
  const authorClass = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-sm' : 'text-[11px]';
  const iconClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl';

  return (
    <div className={`relative rounded-lg shadow-md aspect-[3/4] w-full bg-gradient-to-br ${theme.bg} text-white flex flex-col justify-between overflow-hidden border-l-[6px] border-black/30 group-hover:shadow-lg transition-shadow`}>
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      
      {/* Spine highlight line */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/20" />

      {/* Top Banner with Category / Code */}
      <div className={`${paddingClass} pb-0 flex justify-between items-start z-10`}>
        <span className={`font-mono uppercase text-[9px] px-1.5 py-0.5 rounded border ${theme.accent} ${theme.text}`}>
          {book.courseCode || book.category.substring(0, 3)}
        </span>
        <span className="material-symbols-outlined text-white/30 text-sm">auto_stories</span>
      </div>

      {/* Middle Spine & Crest */}
      <div className="flex flex-col items-center justify-center px-4 py-2 text-center z-10">
        <div className={`text-white/40 mb-1`}>
          <span className="material-symbols-outlined font-light" style={{ fontSize: size === 'lg' ? '48px' : '32px' }}>
            {book.category === 'Computer Science' ? 'terminal' :
             book.category === 'Physics' ? 'architecture' :
             book.category === 'Mathematics' ? 'calculate' :
             book.category === 'Management & Finance' ? 'query_stats' :
             book.category === 'Chemistry & Biology' ? 'science' : 'school'}
          </span>
        </div>
      </div>

      {/* Title & Author at Bottom / Low-mid */}
      <div className={`${paddingClass} pt-0 flex flex-col z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent pb-3`}>
        <h4 className={`font-serif leading-tight line-clamp-3 text-balance tracking-tight ${theme.text} ${titleClass}`}>
          {book.title}
        </h4>
        <p className={`mt-1 font-sans text-white/70 line-clamp-1 italic ${authorClass}`}>
          {book.author}
        </p>
        <span className="text-[9px] text-white/50 font-mono mt-0.5">{book.edition}</span>
      </div>

      {/* Paper cover fiber texture overlay */}
      <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

      {/* Status Overlay */}
      {book.status === 'sold' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-20">
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-secondary">
            Sold
          </span>
        </div>
      )}
    </div>
  );
};
