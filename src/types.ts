/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookCondition = 'new' | 'good' | 'fair';

export interface Book {
  id: string;
  title: string;
  author: string;
  edition: string;
  condition: BookCondition;
  price: number;
  category: string;
  isbn: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  createdAt: string;
  status: 'available' | 'sold';
  description?: string;
  courseCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  avatarUrl?: string;
  joinedDate: string;
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  price: number;
  sellerName: string;
  buyerName: string;
  purchaseDate: string;
  status: 'completed' | 'cancelled';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface ChatSession {
  id: string; // bookId + buyerId
  bookId: string;
  bookTitle: string;
  bookImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  messages: Message[];
  lastUpdated: string;
}
