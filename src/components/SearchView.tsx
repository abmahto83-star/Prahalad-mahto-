/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { BookCover } from './BookCover';

interface SearchViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const SEARCH_SUGGESTIONS = [
  { label: 'Engineering Math', query: 'Grewal' },
  { label: 'Algorithms', query: 'Cormen' },
  { label: 'Physics', query: 'Verma' },
  { label: 'Database Systems', query: 'Silberschatz' },
  { label: 'CS302', query: 'CS302' },
  { label: 'Organic Chemistry', query: 'Bruice' }
];

export const SearchView: React.FC<SearchViewProps> = ({ books, onSelectBook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Find all unique categories present in books
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(book => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedCategory === 'All' || book.category === selectedCategory;

    const matchesQuery =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.isbn.includes(q) ||
      (book.courseCode && book.courseCode.toLowerCase().includes(q)) ||
      book.category.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar Wrapper */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Title, Author, ISBN, or Course Code..."
          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-2xl py-3.5 pl-12 pr-4 text-sm transition-all text-primary-custom shadow-xs font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary-custom"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Suggested Search Keywords */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Suggested Searches</h4>
        <div className="flex flex-wrap gap-2">
          {SEARCH_SUGGESTIONS.map(s => (
            <button
              key={s.label}
              onClick={() => setSearchQuery(s.query)}
              className="bg-white border border-outline-variant/30 text-primary-custom hover:bg-secondary-container/20 text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills inside Search */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Department Filter</h4>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-custom text-white border-primary-custom font-bold shadow-xs'
                  : 'bg-white border-outline-variant/30 text-outline hover:text-primary-custom'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Title */}
      <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
        <h3 className="font-serif text-lg font-bold text-primary-custom">
          {searchQuery ? 'Search Results' : 'Explore All Textbooks'}
        </h3>
        <span className="text-xs text-outline font-semibold">{filteredBooks.length} items found</span>
      </div>

      {/* Results Listings */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-outline-variant/50">
          <span className="material-symbols-outlined text-outline text-5xl mb-2">sentiment_dissatisfied</span>
          <p className="font-serif text-lg font-bold text-outline">No textbooks match your search</p>
          <p className="text-xs text-outline/80 mt-1 max-w-xs mx-auto">
            Try checking for spelling errors, searching for the author's last name, or using a shorter search query.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="bg-white border border-outline-variant/30 hover:border-outline-variant rounded-xl p-3 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
            >
              {/* Left small book cover */}
              <div className="w-16 flex-shrink-0">
                <BookCover book={book} size="sm" />
              </div>

              {/* Right content */}
              <div className="flex-grow flex flex-col justify-between">
                <div className="space-y-0.5">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] text-outline font-semibold tracking-wider uppercase">
                      {book.category}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.25 rounded ${
                      book.condition === 'new' ? 'bg-emerald-100 text-emerald-800' :
                      book.condition === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {book.condition}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-primary-custom line-clamp-1 leading-snug group-hover:text-secondary-custom transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-outline italic">By {book.author}</p>
                  <p className="text-[10px] text-outline font-mono">ISBN: {book.isbn}</p>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/15 mt-1">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-semibold text-secondary-custom">₹</span>
                    <span className="font-serif text-sm font-bold text-secondary-custom">{book.price}</span>
                  </div>
                  <span className="text-[10px] text-outline italic">
                    By student • {book.sellerName.split(' ')[0]}
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
