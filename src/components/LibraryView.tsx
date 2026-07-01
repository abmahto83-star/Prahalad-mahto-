/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, BookCondition } from '../types';
import { BookCover } from './BookCover';
import { CATEGORIES } from '../mockData';

interface LibraryViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onNavigateToSell: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onSelectBook,
  onNavigateToSell,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [selectedCondition, setSelectedCondition] = useState<'all' | BookCondition>('all');

  // Filter books
  const filteredBooks = books
    .filter(book => {
      const categoryMatch = selectedCategory === 'All' || book.category === selectedCategory;
      const conditionMatch = selectedCondition === 'all' || book.condition === selectedCondition;
      return categoryMatch && conditionMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Hero / Welcome Intro Section */}
      <section className="bg-gradient-to-tr from-primary-custom to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[150px] rotate-12">local_library</span>
        </div>
        <div className="max-w-md space-y-2 z-10 relative">
          <span className="bg-secondary-container text-on-secondary-container font-sans text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
            CAMPUS HUB
          </span>
          <h2 className="font-serif text-2xl font-bold leading-tight">
            Exchange Textbooks Directly with Student Peers
          </h2>
          <p className="text-xs text-white/80 leading-relaxed">
            Skip the markup of retail bookstores. Sell your previous semester's books and buy your next modules at fair student-to-student prices.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToSell}
              className="bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 transition-all text-xs font-bold font-sans px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
              List Your Book For Cash
            </button>
          </div>
        </div>
      </section>

      {/* Category Horizontal Selector */}
      <section className="space-y-2.5">
        <h3 className="font-serif text-lg font-bold text-primary-custom">Browse Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar scroll-smooth whitespace-nowrap">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-label-md text-xs transition-all border ${
                selectedCategory === category
                  ? 'bg-secondary-container border-secondary-container text-on-secondary-container font-bold shadow-xs'
                  : 'bg-white border-outline-variant/40 text-outline hover:text-primary-custom hover:border-outline'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Filters and Search Summary */}
      <section className="flex flex-wrap justify-between items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
        <div className="text-xs text-outline font-semibold">
          Showing {filteredBooks.length} available textbooks
        </div>
        <div className="flex items-center gap-2">
          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value as any)}
            className="bg-white border border-outline-variant text-primary-custom text-xs rounded-lg py-1.5 px-2.5 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Conditions</option>
            <option value="new">New Condition</option>
            <option value="good">Good Condition</option>
            <option value="fair">Fair Condition</option>
          </select>

          {/* Price Sorter */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-outline-variant text-primary-custom text-xs rounded-lg py-1.5 px-2.5 focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Latest Listings</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-outline-variant/60">
          <span className="material-symbols-outlined text-outline text-5xl mb-2">find_in_page</span>
          <p className="font-serif text-lg font-bold text-outline">No textbooks found</p>
          <p className="text-xs text-outline/80 max-w-xs mx-auto mt-1">
            Try resetting your active filters or explore other course categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-gutter">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-outline-variant transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Cover area */}
              <div className="p-3 bg-surface-container-low flex justify-center items-center">
                <div className="w-full relative">
                  <BookCover book={book} size="md" />
                </div>
              </div>

              {/* Book Info Metadata */}
              <div className="p-3.5 space-y-1.5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      book.condition === 'new' ? 'bg-emerald-100 text-emerald-800' :
                      book.condition === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {book.condition === 'new' ? 'New' : book.condition === 'good' ? 'Good' : 'Fair'}
                    </span>
                    <span className="text-[10px] text-outline font-medium truncate max-w-[80px]">
                      {book.courseCode || book.category}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-primary-custom line-clamp-2 mt-1 leading-snug group-hover:text-secondary-custom transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-outline line-clamp-1 italic mt-0.5">
                    {book.author}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-semibold text-secondary-custom">₹</span>
                    <span className="font-serif text-base font-bold text-secondary-custom">{book.price}</span>
                  </div>
                  
                  <span className="text-[10px] text-outline flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">person</span>
                    {book.sellerName.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
