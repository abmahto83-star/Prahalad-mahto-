/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, UserProfile, Order } from './types';
import { INITIAL_BOOKS } from './mockData';
import { LibraryView } from './components/LibraryView';
import { SearchView } from './components/SearchView';
import { SellView } from './components/SellView';
import { ProfileView } from './components/ProfileView';
import { BookDetailModal } from './components/BookDetailModal';

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<'library' | 'search' | 'sell' | 'profile'>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Core database state with local storage persistence
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('campus_textbooks_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing books from localStorage', e);
      }
    }
    return INITIAL_BOOKS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('campus_user_profile_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing profile from localStorage', e);
      }
    }
    return {
      id: 'user_rahul',
      name: 'Rahul Sharma',
      email: 'rahul.s@campus.edu',
      walletBalance: 1500,
      joinedDate: 'July 2025',
    };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('campus_orders_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing orders from localStorage', e);
      }
    }
    return [];
  });

  // Action toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('campus_textbooks_v1', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('campus_user_profile_v1', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('campus_orders_v1', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Handler: List a new textbook
  const handleListBook = (newBookData: Omit<Book, 'id' | 'sellerId' | 'sellerName' | 'sellerEmail' | 'status' | 'createdAt'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `book_${Date.now()}`,
      sellerId: 'user_rahul',
      sellerName: userProfile.name,
      sellerEmail: userProfile.email,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    setBooks(prev => [newBook, ...prev]);
    showToast(`"${newBook.title}" listed successfully!`);
    setActiveTab('library'); // Take them back to see it
  };

  // Handler: Complete a purchase
  const handlePurchaseSuccess = (bookId: string, price: number, sellerName: string) => {
    // 1. Deduct price from wallet balance
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - price),
    }));

    // 2. Change book status to sold
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, status: 'sold' as const } : b))
    );

    // 3. Find the book details to generate the order
    const bookBought = books.find(b => b.id === bookId);
    if (bookBought) {
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        bookId: bookBought.id,
        bookTitle: bookBought.title,
        bookImage: bookBought.images?.[0] || '',
        price: bookBought.price,
        sellerName: bookBought.sellerName,
        buyerName: userProfile.name,
        purchaseDate: new Date().toISOString(),
        status: 'completed',
      };
      setOrders(prev => [newOrder, ...prev]);
      
      // Update selectedBook status if currently open in modal
      setSelectedBook(prev => prev && prev.id === bookId ? { ...prev, status: 'sold' as const } : prev);
    }

    showToast(`Successfully bought textbook from ${sellerName}!`, 'success');
  };

  // Handler: Deposit money to wallet
  const handleTopUpWallet = (amount: number) => {
    setUserProfile(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    showToast(`Added ₹${amount.toFixed(2)} to Campus Wallet!`, 'success');
  };

  // Handler: Cancel/Remove textbook listing
  const handleRemoveBook = (bookId: string) => {
    const bookToRemove = books.find(b => b.id === bookId);
    if (bookToRemove) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
      showToast(`Removed listing: "${bookToRemove.title}"`, 'info');
    }
  };

  // Generate page heading title dynamically
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'library':
        return 'Campus Library';
      case 'search':
        return 'Find Textbooks';
      case 'sell':
        return 'Sell your Book';
      case 'profile':
        return 'Student Profile';
      default:
        return 'Campus Bookstore';
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen paper-texture pb-24 relative selection:bg-secondary-container">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-bounce">
          <div className="bg-primary-custom text-white py-3 px-5 rounded-xl shadow-lg flex items-center justify-between gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">
                {toast.type === 'success' ? 'check_circle' : 'info'}
              </span>
              <p className="text-xs font-semibold">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="material-symbols-outlined text-xs text-white/60 hover:text-white">
              close
            </button>
          </div>
        </div>
      )}

      {/* Top AppBar */}
      <header className="bg-surface dark:bg-surface-dim shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] flex justify-between items-center px-container-margin py-3 w-full sticky top-0 z-40 border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('library')}
            disabled={activeTab === 'library'}
            className="material-symbols-outlined text-primary-custom disabled:opacity-30 active:scale-95 transition-transform cursor-pointer"
          >
            arrow_back
          </button>
          <h1 className="font-serif text-xl font-bold text-primary-custom">
            {getHeaderTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-base">
          <button
            onClick={() => showToast('Peer-to-peer marketplace. For handovers, meet safely on campus.', 'info')}
            className="material-symbols-outlined text-primary-custom hover:opacity-80 flex items-center justify-center p-1"
          >
            help_outline
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-2xl mx-auto px-container-margin mt-6">
        {activeTab === 'library' && (
          <LibraryView
            books={books}
            onSelectBook={setSelectedBook}
            onNavigateToSell={() => setActiveTab('sell')}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            books={books}
            onSelectBook={setSelectedBook}
          />
        )}

        {activeTab === 'sell' && (
          <SellView
            onListBook={handleListBook}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            books={books}
            orders={orders}
            onTopUpWallet={handleTopUpWallet}
            onRemoveBook={handleRemoveBook}
          />
        )}
      </main>

      {/* Book Specifications Details Modal Overlay */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          userProfile={userProfile}
          onClose={() => setSelectedBook(null)}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}

      {/* Bottom Sticky Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-safe bg-surface shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-outline-variant/60">
        <button
          onClick={() => {
            setActiveTab('library');
            setSelectedBook(null);
          }}
          className={`flex flex-col items-center justify-center text-center pt-2 pb-2.5 flex-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'library'
              ? 'text-primary-custom border-t-2 border-secondary-container font-bold'
              : 'text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'library' ? "'FILL' 1" : undefined }}>
            auto_stories
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Library</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            setSelectedBook(null);
          }}
          className={`flex flex-col items-center justify-center text-center pt-2 pb-2.5 flex-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'search'
              ? 'text-primary-custom border-t-2 border-secondary-container font-bold'
              : 'text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'search' ? "'FILL' 1" : undefined }}>
            search
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sell');
            setSelectedBook(null);
          }}
          className={`flex flex-col items-center justify-center text-center pt-2 pb-2.5 flex-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'sell'
              ? 'text-primary-custom border-t-2 border-secondary-container font-bold'
              : 'text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'sell' ? "'FILL' 1" : undefined }}>
            add_circle
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Sell</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            setSelectedBook(null);
          }}
          className={`flex flex-col items-center justify-center text-center pt-2 pb-2.5 flex-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-primary-custom border-t-2 border-secondary-container font-bold'
              : 'text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : undefined }}>
            person
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
