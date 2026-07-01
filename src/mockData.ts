/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_1',
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    edition: '44th Edition',
    condition: 'good',
    price: 550,
    category: 'Engineering',
    isbn: '9788193328491',
    images: [], // We can generate elegant, colored SVG/CSS covers if empty
    sellerId: 'user_rahul',
    sellerName: 'Rahul Sharma',
    sellerEmail: 'rahul.s@campus.edu',
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(), // 36h ago
    status: 'available',
    description: 'Perfect for engineering courses. Minimal highlighting on initial pages. Binding is completely intact.',
    courseCode: 'MATH201'
  },
  {
    id: 'book_2',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    edition: '3rd Edition',
    condition: 'new',
    price: 1200,
    category: 'Computer Science',
    isbn: '9780262033848',
    images: [],
    sellerId: 'user_priya',
    sellerName: 'Priya Patel',
    sellerEmail: 'priya.p@campus.edu',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12h ago
    status: 'available',
    description: 'Brand new copy, unused because I dropped the elective. No scratches or marks.',
    courseCode: 'CS302'
  },
  {
    id: 'book_3',
    title: 'Concepts of Physics (Vol 1)',
    author: 'H.C. Verma',
    edition: '2023 Reprint',
    condition: 'fair',
    price: 250,
    category: 'Physics',
    isbn: '9788177091878',
    images: [],
    sellerId: 'user_amit',
    sellerName: 'Amit Verma',
    sellerEmail: 'amit.v@campus.edu',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: 'available',
    description: 'Well-loved book, some pencil markings on the numerical exercises. Good for practicing IIT JEE problems.',
    courseCode: 'PHY101'
  },
  {
    id: 'book_4',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth',
    edition: '7th Edition',
    condition: 'good',
    price: 680,
    category: 'Computer Science',
    isbn: '9780078022135',
    images: [],
    sellerId: 'user_sneha',
    sellerName: 'Sneha Reddy',
    sellerEmail: 'sneha.r@campus.edu',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'available',
    description: 'Extremely clean interior. Only some shelf wear on the cover corners. Highly recommended for DB courses.',
    courseCode: 'CS204'
  },
  {
    id: 'book_5',
    title: 'Principles of Microeconomics',
    author: 'N. Gregory Mankiw',
    edition: '8th Edition',
    condition: 'good',
    price: 450,
    category: 'Management & Finance',
    isbn: '9781305971493',
    images: [],
    sellerId: 'user_vikram',
    sellerName: 'Vikram Singh',
    sellerEmail: 'vikram.s@campus.edu',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: 'available',
    description: 'Used for one semester. Great conceptual explanations. Includes some stick-on study flags if you want them.',
    courseCode: 'ECO102'
  },
  {
    id: 'book_6',
    title: 'Organic Chemistry',
    author: 'Paula Yurkanis Bruice',
    edition: '8th Edition',
    condition: 'new',
    price: 900,
    category: 'Chemistry & Biology',
    isbn: '9780134074580',
    images: [],
    sellerId: 'user_ananya',
    sellerName: 'Ananya Roy',
    sellerEmail: 'ananya.r@campus.edu',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    status: 'available',
    description: 'Virtually pristine. Comes with the molecular model kit guide booklet inside.',
    courseCode: 'CHM211'
  }
];

export const CATEGORIES = [
  'All',
  'Computer Science',
  'Engineering',
  'Physics',
  'Mathematics',
  'Management & Finance',
  'Chemistry & Biology'
];
