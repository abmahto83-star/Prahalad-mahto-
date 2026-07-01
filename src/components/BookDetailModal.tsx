/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, UserProfile, Order, Message } from '../types';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  book: Book;
  userProfile: UserProfile;
  onClose: () => void;
  onPurchaseSuccess: (bookId: string, price: number, sellerName: string) => void;
}

const SELLER_REPLIES = [
  "Hey! Yes, it is still available. I can meet you at the central cafeteria tomorrow around noon.",
  "Hi there! The book is in really good condition, barely any highlighting. I can hand it over near the Audi block today after 4 PM.",
  "Hello! Yes, absolutely. I’m near the computer science lab right now if you want to pick it up immediately.",
  "Hey, yes it is. I can do ₹50 off if you can pick it up from the girls' hostel lounge.",
  "Hi! Yes, I still have it. We can meet near the library fountain between classes tomorrow."
];

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  userProfile,
  onClose,
  onPurchaseSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [checkoutStep, setCheckoutStep] = useState<'none' | 'confirm' | 'success'>('none');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deliveryToken] = useState(() => `CAMP-${Math.floor(100000 + Math.random() * 90000).toString()}`);
  const [copied, setCopied] = useState(false);

  // Load chat messages
  useEffect(() => {
    setChatMessages([
      {
        id: 'msg_init',
        senderId: 'system',
        text: `Starting chat regarding "${book.title}". Arrange a physical meeting place on campus to exchange the textbook.`,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: 'msg_welcome',
        senderId: book.sellerId,
        text: `Hi! Thanks for your interest in my textbook. Let me know when and where you would like to meet on campus!`,
        createdAt: new Date(Date.now() - 4 * 60000).toISOString()
      }
    ]);
  }, [book]);

  const handleCopyISBN = () => {
    navigator.clipboard.writeText(book.isbn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'current_user',
      text: newMessageText,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessageText('');
    setIsTyping(true);

    // Simulate reply
    setTimeout(() => {
      setIsTyping(false);
      const replyText = SELLER_REPLIES[Math.floor(Math.random() * SELLER_REPLIES.length)];
      const sellerMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: book.sellerId,
        text: replyText,
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, sellerMsg]);
    }, 1500);
  };

  const handleConfirmPurchase = () => {
    if (userProfile.walletBalance < book.price) return;
    setCheckoutStep('success');
    onPurchaseSuccess(book.id, book.price, book.sellerName);
  };

  const insufficientFunds = userProfile.walletBalance < book.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-background border border-outline-variant max-w-lg w-full rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col paper-texture">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-surface border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-custom" style={{ fontVariationSettings: "'FILL' 1" }}>
              {activeTab === 'details' ? 'menu_book' : 'forum'}
            </span>
            <span className="font-serif font-bold text-lg text-primary-custom">
              {activeTab === 'details' ? 'Textbook Details' : `Chat with ${book.sellerName}`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container-high text-primary-custom transition-colors"
          >
            close
          </button>
        </div>

        {/* Tab Selection */}
        {checkoutStep === 'none' && (
          <div className="flex border-b border-outline-variant/30 bg-surface-container-lowest">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-center font-label-md text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'details'
                  ? 'border-secondary-container text-primary-custom bg-surface-container/10 font-bold'
                  : 'border-transparent text-outline hover:text-primary-custom'
              }`}
            >
              <span className="material-symbols-outlined text-sm">info</span>
              Specs & Details
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center font-label-md text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'chat'
                  ? 'border-secondary-container text-primary-custom bg-surface-container/10 font-bold'
                  : 'border-transparent text-outline hover:text-primary-custom'
              }`}
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              Message Seller
              {book.status === 'available' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
          {checkoutStep === 'none' ? (
            activeTab === 'details' ? (
              // Details View
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <BookCover book={book} size="md" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <span className="inline-block bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {book.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-snug text-primary-custom">
                      {book.title}
                    </h3>
                    <p className="font-body-sm text-sm text-outline">
                      By <span className="font-semibold text-primary-custom">{book.author}</span>
                    </p>
                    <p className="text-xs text-outline">{book.edition}</p>
                    
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-sm font-semibold text-secondary-custom">₹</span>
                      <span className="font-serif text-2xl font-bold text-secondary-custom">{book.price}</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        book.condition === 'new' ? 'bg-emerald-500' :
                        book.condition === 'good' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs font-semibold capitalize text-primary-custom">
                        Condition: {book.condition === 'new' ? 'New (Pristine)' :
                                   book.condition === 'good' ? 'Used - Good' : 'Used - Fair'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description & ISBN */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                  <div className="bg-surface-container-low p-4 rounded-xl space-y-3 border border-outline-variant/30">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs text-outline font-semibold">
                        <span className="material-symbols-outlined text-sm">barcode</span>
                        ISBN-13 Barcode
                      </div>
                      <button
                        onClick={handleCopyISBN}
                        className="flex items-center gap-1 text-[11px] text-primary-custom font-semibold hover:underline bg-surface-container-high px-2 py-1 rounded"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="font-mono text-sm text-primary-custom font-bold tracking-wider">{book.isbn}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-label-md text-sm text-primary-custom font-bold">Seller's Note</h4>
                    <p className="text-sm text-outline leading-relaxed bg-surface-container-lowest/50 p-3 rounded-lg border border-outline-variant/10">
                      {book.description || "The student seller did not provide any special notes, but has stated the textbook condition is standard for physical coursework."}
                    </p>
                  </div>
                </div>

                {/* Seller Profile Card */}
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary-container/30 text-on-secondary-container w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif text-lg">
                      {book.sellerName[0]}
                    </div>
                    <div>
                      <h5 className="font-label-md text-sm text-primary-custom font-bold">{book.sellerName}</h5>
                      <p className="text-[11px] text-outline">Student • Joined July 2025</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                      Verified Seller
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                {book.status === 'available' ? (
                  <div className="pt-2">
                    <button
                      onClick={() => setCheckoutStep('confirm')}
                      className="w-full bg-primary-custom text-white py-3.5 rounded-xl font-label-md text-base shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined">shopping_bag</span>
                      Buy Book now (₹{book.price})
                    </button>
                    <p className="text-[11px] text-center text-outline mt-2">
                      Secured via Campus Wallet. Pick up physically on campus.
                    </p>
                  </div>
                ) : (
                  <div className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant">
                    <span className="material-symbols-outlined text-outline text-3xl mb-1">shopping_basket</span>
                    <p className="font-label-md text-sm text-outline font-bold">This Textbook has been Sold</p>
                    <p className="text-xs text-outline/70 mt-1">Browse our library tab for other active listings.</p>
                  </div>
                )}
              </div>
            ) : (
              // Chat View
              <div className="flex flex-col h-[400px]">
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-4">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === 'system'
                          ? 'justify-center'
                          : msg.senderId === 'current_user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {msg.senderId === 'system' ? (
                        <div className="bg-surface-container-low text-outline text-[11px] px-3 py-1.5 rounded-lg border border-outline-variant/40 max-w-[90%] text-center font-medium">
                          {msg.text}
                        </div>
                      ) : (
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                          msg.senderId === 'current_user'
                            ? 'bg-secondary-container text-on-secondary-container rounded-br-none'
                            : 'bg-white border border-outline-variant text-primary-custom rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="block text-[9px] text-right mt-1 opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm rounded-bl-none flex items-center gap-1 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-outline animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-outline animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-outline animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-outline-variant/30 bg-background">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={e => setNewMessageText(e.target.value)}
                    placeholder="Ask about meeting point, price..."
                    className="flex-grow bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-xl py-2.5 px-4 text-sm transition-all text-primary-custom"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim()}
                    className="bg-primary-custom text-white p-2.5 rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-md">send</span>
                  </button>
                </form>
              </div>
            )
          ) : checkoutStep === 'confirm' ? (
            // Checkout Step: Confirm
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-2xl font-bold text-primary-custom">Confirm Purchase</h3>
                <p className="text-sm text-outline">You are buying directly from a student peer.</p>
              </div>

              {/* Bill Details */}
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
                  <span className="text-sm text-outline">Textbook Title</span>
                  <span className="text-sm font-bold text-primary-custom text-right max-w-[200px] truncate">{book.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-outline">Price</span>
                  <span className="text-sm font-bold text-primary-custom">₹{book.price}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-500/10 px-3 py-2 rounded-lg text-xs font-semibold">
                  <span>Campus Platform Fee</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40 font-bold text-base">
                  <span className="text-primary-custom">Total Amount</span>
                  <span className="text-secondary-custom">₹{book.price}</span>
                </div>
              </div>

              {/* Wallet Status */}
              <div className="p-4 rounded-xl border flex items-center justify-between bg-surface-container-lowest border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-custom text-2xl">account_balance_wallet</span>
                  <div>
                    <h5 className="text-xs text-outline uppercase tracking-wider font-bold">Your Campus Wallet</h5>
                    <p className="text-sm font-bold text-primary-custom">₹{userProfile.walletBalance.toFixed(2)}</p>
                  </div>
                </div>
                {insufficientFunds ? (
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Insufficient Funds
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Ready
                  </span>
                )}
              </div>

              {insufficientFunds ? (
                <div className="space-y-3">
                  <div className="bg-red-50 text-red-800 text-xs p-3.5 rounded-lg border border-red-200 leading-relaxed">
                    <strong>Balance is too low!</strong> You need <strong>₹{book.price - userProfile.walletBalance}</strong> more to purchase this textbook. Please top up your wallet in the <strong>Profile</strong> tab first!
                  </div>
                  <button
                    onClick={() => setCheckoutStep('none')}
                    className="w-full bg-outline-variant text-primary-custom py-3 rounded-xl font-label-md text-sm font-bold hover:bg-outline-variant/80 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('none')}
                    className="flex-1 border border-outline-variant text-primary-custom py-3.5 rounded-xl font-label-md text-sm font-bold hover:bg-surface-container-low transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="flex-1 bg-primary-custom text-white py-3.5 rounded-xl font-label-md text-sm font-bold hover:brightness-110 active:scale-95 shadow-md transition-all"
                  >
                    Confirm & Pay
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Checkout Step: Success receipt!
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-4xl animate-bounce">check_circle</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-primary-custom">Purchase Completed!</h3>
                <p className="text-sm text-outline">Book has been locked for you.</p>
              </div>

              {/* Delivery Receipt Card */}
              <div className="bg-white border-2 border-dashed border-outline-variant p-6 rounded-2xl shadow-xs space-y-4 max-w-sm mx-auto text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[8px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  Receipt Token
                </div>

                <div>
                  <h4 className="text-xs text-outline uppercase font-bold tracking-wider">Book Purchased</h4>
                  <p className="text-sm font-serif font-bold text-primary-custom leading-tight mt-0.5">{book.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="text-[10px] text-outline uppercase font-bold tracking-wider">Student Seller</h4>
                    <p className="text-xs font-bold text-primary-custom mt-0.5">{book.sellerName}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] text-outline uppercase font-bold tracking-wider">Paid Amount</h4>
                    <p className="text-xs font-bold text-primary-custom mt-0.5">₹{book.price}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-outline-variant/60 text-center">
                  <h4 className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">Campus Handover Code</h4>
                  <span className="inline-block bg-secondary-container/30 text-primary-custom font-mono font-bold text-lg px-4 py-1.5 rounded-lg tracking-widest border border-secondary-container">
                    {deliveryToken}
                  </span>
                  <p className="text-[10px] text-outline/80 mt-1.5 leading-normal">
                    Show this code to <strong>{book.sellerName}</strong> when you meet him/her on campus to collect your book!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setCheckoutStep('none');
                  }}
                  className="w-full bg-primary-custom text-white py-3 rounded-xl font-label-md text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  Message {book.sellerName} to Meet
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-outline-variant text-outline hover:text-primary-custom py-3 rounded-xl font-label-md text-sm font-bold transition-all"
                >
                  Back to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
