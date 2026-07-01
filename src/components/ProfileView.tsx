/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, UserProfile, Order } from '../types';
import { BookCover } from './BookCover';

interface ProfileViewProps {
  userProfile: UserProfile;
  books: Book[];
  orders: Order[];
  onTopUpWallet: (amount: number) => void;
  onRemoveBook: (bookId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  books,
  orders,
  onTopUpWallet,
  onRemoveBook,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'wallet'>('listings');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Filter listings published by current user
  const myListings = books.filter(b => b.sellerId === 'user_rahul');
  const activeListings = myListings.filter(b => b.status === 'available');
  const soldListings = myListings.filter(b => b.status === 'sold');

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) return;
    onTopUpWallet(amount);
    setTopUpAmount('');
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Identity Card */}
      <section className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 paper-texture">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-serif text-3xl font-bold shadow-xs">
            {userProfile.name[0]}
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-serif text-xl font-bold text-primary-custom">{userProfile.name}</h2>
            <p className="text-xs text-outline">{userProfile.email}</p>
            <p className="text-[11px] text-outline font-semibold bg-surface-container-high px-2 py-0.5 rounded mt-1 inline-block">
              Joined {userProfile.joinedDate}
            </p>
          </div>
        </div>

        {/* Shorthand Wallet Balance Display */}
        <div className="bg-surface-container-low border border-outline-variant/30 px-5 py-3 rounded-xl text-center md:text-right flex flex-col justify-center">
          <span className="text-[10px] text-outline uppercase font-bold tracking-wider">Campus Balance</span>
          <span className="font-serif text-2xl font-bold text-secondary-custom">₹{userProfile.walletBalance.toFixed(2)}</span>
          <button
            onClick={() => setActiveTab('wallet')}
            className="text-[11px] text-primary-custom underline font-bold mt-1"
          >
            Manage Wallet
          </button>
        </div>
      </section>

      {/* Selector Navigation */}
      <div className="flex border-b border-outline-variant/30 bg-white rounded-xl shadow-xs overflow-hidden">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-3 text-center font-label-md text-xs transition-all border-b-2 flex justify-center items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'border-secondary-container text-primary-custom font-bold bg-surface-container/5'
              : 'border-transparent text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-sm">list_alt</span>
          My Listings ({myListings.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-center font-label-md text-xs transition-all border-b-2 flex justify-center items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-secondary-container text-primary-custom font-bold bg-surface-container/5'
              : 'border-transparent text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-sm">shopping_bag</span>
          Purchased ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-3 text-center font-label-md text-xs transition-all border-b-2 flex justify-center items-center gap-1.5 ${
            activeTab === 'wallet'
              ? 'border-secondary-container text-primary-custom font-bold bg-surface-container/5'
              : 'border-transparent text-outline hover:text-primary-custom'
          }`}
        >
          <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
          Wallet Top-up
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Active Bookings list */}
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-primary-custom flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Active Listings ({activeListings.length})
              </h3>
              {activeListings.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-dashed border-outline-variant/50 text-center text-xs text-outline">
                  You are not selling any textbooks currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {activeListings.map(book => (
                    <div
                      key={book.id}
                      className="bg-white border border-outline-variant/30 rounded-xl p-3 flex gap-4 items-center justify-between shadow-xs"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-16 flex-shrink-0">
                          <BookCover book={book} size="sm" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-primary-custom line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-outline italic">By {book.author}</p>
                          <p className="text-xs font-bold text-secondary-custom mt-1">₹{book.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveBook(book.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        title="Remove Listing"
                      >
                        <span className="material-symbols-outlined text-md">delete</span>
                        <span className="text-[11px] font-bold">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sold Bookings list */}
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <h3 className="font-serif text-base font-bold text-primary-custom flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Sold Book History ({soldListings.length})
              </h3>
              {soldListings.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-dashed border-outline-variant/50 text-center text-xs text-outline">
                  No textbooks sold yet. Once a student buys your book, it will show up here.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {soldListings.map(book => (
                    <div
                      key={book.id}
                      className="bg-slate-50 border border-outline-variant/30 rounded-xl p-3 flex gap-4 items-center justify-between opacity-80"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-16 flex-shrink-0">
                          <BookCover book={book} size="sm" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-primary-custom line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-outline">Sold for <span className="font-bold text-secondary-custom">₹{book.price}</span></p>
                          <span className="inline-block bg-blue-100 text-blue-800 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1">
                            Funds Deposited
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-primary-custom">Your Purchased Textbooks</h3>
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-dashed border-outline-variant/50 text-center text-xs text-outline space-y-2">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                <p>You haven't bought any textbooks yet.</p>
                <p className="text-[11px] text-outline/70">Browse the library to buy and checkout safely.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border border-outline-variant/30 rounded-xl p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex gap-3 items-start justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="bg-secondary-container/20 text-secondary-custom w-10 h-10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-primary-custom leading-tight">{order.bookTitle}</h4>
                          <p className="text-xs text-outline mt-0.5">Seller: <strong>{order.sellerName}</strong></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-secondary-custom">₹{order.price}</p>
                        <p className="text-[9px] text-outline mt-0.5">Purchased on {new Date(order.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-2.5 rounded-lg flex justify-between items-center text-xs border border-outline-variant/30">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-outline">handover</span>
                        <span className="text-[11px] text-outline font-semibold">Campus Handover Code:</span>
                      </div>
                      <span className="font-mono font-bold text-primary-custom bg-secondary-container/40 px-2 py-0.5 rounded border border-secondary-container">
                        CAMP-{Math.floor(100000 + Math.random() * 90000)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 space-y-6 shadow-xs paper-texture">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-primary-custom">Campus Wallet Manager</h3>
              <p className="text-xs text-outline leading-relaxed">
                Add virtual student funds to instantly purchase course books, or simulated withdraw. Secure peer-to-peer campus transfers.
              </p>
            </div>

            {/* Quick Balance Status */}
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-custom text-3xl">account_balance_wallet</span>
                <div>
                  <h5 className="text-[10px] text-outline uppercase font-bold tracking-wider">Current Balance</h5>
                  <p className="font-serif text-2xl font-bold text-primary-custom">₹{userProfile.walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                Active Wallet
              </span>
            </div>

            {/* Top Up Form */}
            <form onSubmit={handleTopUpSubmit} className="space-y-3.5 pt-2">
              <label className="text-xs font-bold block text-outline px-1">Top-up Amount (₹)</label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTopUpAmount('200')}
                  className="flex-1 bg-surface-container-low border border-outline-variant/40 text-primary-custom py-2 rounded-lg text-xs font-semibold hover:border-primary-custom transition-all"
                >
                  +₹200
                </button>
                <button
                  type="button"
                  onClick={() => setTopUpAmount('500')}
                  className="flex-1 bg-surface-container-low border border-outline-variant/40 text-primary-custom py-2 rounded-lg text-xs font-semibold hover:border-primary-custom transition-all"
                >
                  +₹500
                </button>
                <button
                  type="button"
                  onClick={() => setTopUpAmount('1000')}
                  className="flex-1 bg-surface-container-low border border-outline-variant/40 text-primary-custom py-2 rounded-lg text-xs font-semibold hover:border-primary-custom transition-all"
                >
                  +₹1,000
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount to add"
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2 pl-6 pr-3 text-xs transition-all text-primary-custom"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-custom text-white px-5 rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Funds
                </button>
              </div>

              {topUpSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 font-bold">check_circle</span>
                  <span>Successfully loaded funds into your Campus Wallet!</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
