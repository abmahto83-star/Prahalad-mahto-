/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, BookCondition } from '../types';

interface SellViewProps {
  onListBook: (newBook: Omit<Book, 'id' | 'sellerId' | 'sellerName' | 'sellerEmail' | 'status' | 'createdAt'>) => void;
}

const PRESET_SCANNED_BOOKS = [
  {
    title: 'Fundamentals of Software Engineering',
    author: 'Rajib Mall',
    edition: '5th Edition',
    category: 'Computer Science',
    isbn: '9789388028783',
    suggestedMin: 350,
    suggestedMax: 500
  },
  {
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    edition: '10th Edition',
    category: 'Engineering',
    isbn: '9780470458365',
    suggestedMin: 700,
    suggestedMax: 950
  },
  {
    title: 'University Physics with Modern Physics',
    author: 'Hugh D. Young, Roger A. Freedman',
    edition: '15th Edition',
    category: 'Physics',
    isbn: '9780135159552',
    suggestedMin: 900,
    suggestedMax: 1300
  }
];

export const SellView: React.FC<SellViewProps> = ({ onListBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [condition, setCondition] = useState<BookCondition>('good');
  const [price, setPrice] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');

  // 4 photos: [front, back, inside, index]
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const photoSlots = [
    { label: 'Front', key: 0 },
    { label: 'Back', key: 1 },
    { label: 'Inside', key: 2 },
    { label: 'Index', key: 3 }
  ];

  // Simulated Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState('');

  // Auto-suggest price range
  const [suggestedRange, setSuggestedRange] = useState('₹450 - ₹600');

  useEffect(() => {
    // Dynamically adjust suggested price based on category/condition
    let min = 300;
    let max = 450;
    if (category === 'Engineering' || category === 'Physics') {
      min = 500;
      max = 700;
    } else if (category === 'Computer Science') {
      min = 400;
      max = 650;
    }
    if (condition === 'new') {
      min += 150;
      max += 200;
    } else if (condition === 'fair') {
      min -= 150;
      max -= 100;
    }
    setSuggestedRange(`₹${Math.max(100, min)} - ₹${max}`);
  }, [category, condition]);

  // Handle Photo Upload & preview
  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPhotos(prev => {
          const next = [...prev];
          next[index] = result;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate ISBN Scanner
  const handleBarcodeScan = () => {
    setIsScanning(true);
    setScanSuccessMessage('');
    setTimeout(() => {
      const preset = PRESET_SCANNED_BOOKS[Math.floor(Math.random() * PRESET_SCANNED_BOOKS.length)];
      setTitle(preset.title);
      setAuthor(preset.author);
      setEdition(preset.edition);
      setCategory(preset.category);
      setIsbn(preset.isbn);
      setCondition('good');
      setIsScanning(false);
      setScanSuccessMessage(`Successfully scanned ISBN ${preset.isbn}! Textbook info auto-filled.`);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !price) {
      alert('Please fill out the Book Title, Author, and Set Price.');
      return;
    }

    // Prepare non-empty photo list
    const validPhotos = photos.filter((p): p is string => p !== null);

    onListBook({
      title,
      author,
      edition: edition || '1st Edition',
      condition,
      price: Number(price),
      category,
      isbn: isbn || Math.floor(9780000000000 + Math.random() * 999999999).toString(),
      images: validPhotos,
      courseCode: courseCode || undefined,
      description: description || undefined
    });

    // Clear state
    setTitle('');
    setAuthor('');
    setEdition('');
    setPrice('');
    setCourseCode('');
    setDescription('');
    setIsbn('');
    setPhotos([null, null, null, null]);
    setScanSuccessMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Hero / Intro Section */}
      <section className="text-center md:text-left space-y-1">
        <p className="font-body-md text-sm text-outline">
          Turn your previous semester's course materials into instant cash for other students. Fast, verified, and campus-friendly.
        </p>
      </section>

      {/* ISBN Scan Section */}
      <section>
        {isScanning ? (
          <div className="bg-surface-container-lowest border-2 border-dashed border-secondary-container p-gutter rounded-xl shadow-xs flex flex-col items-center justify-center py-6 space-y-3">
            <span className="material-symbols-outlined text-4xl text-on-secondary-container animate-spin">
              progress_activity
            </span>
            <div className="text-center">
              <h3 className="font-label-md text-sm text-primary-custom font-bold">Scanning Barcode...</h3>
              <p className="text-xs text-outline">Accessing simulated campus ISBN database</p>
            </div>
          </div>
        ) : (
          <div
            onClick={handleBarcodeScan}
            className="bg-surface-container-lowest border border-outline-variant p-gutter rounded-xl shadow-xs flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary-container p-3 rounded-full text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
              </div>
              <div>
                <h3 className="font-label-md text-sm text-primary-custom font-bold">Scan ISBN Barcode</h3>
                <p className="text-xs text-outline">Auto-fill book specifications instantly</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        )}

        {scanSuccessMessage && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 font-bold">check_circle</span>
            <span>{scanSuccessMessage}</span>
          </div>
        )}
      </section>

      {/* Manual Entry Form */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-[1px] flex-grow bg-outline-variant/50"></div>
          <span className="text-[10px] text-outline font-bold uppercase tracking-widest">
            or enter textbook manually
          </span>
          <div className="h-[1px] flex-grow bg-outline-variant/50"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-gutter">
          {/* Book Details Group */}
          <div className="space-y-4 bg-surface-container-low p-gutter rounded-xl border border-outline-variant/30 shadow-xs">
            <h2 className="font-serif text-base font-bold text-primary-custom flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-lg">book</span>
              Book Specifications
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-outline px-1" htmlFor="title">
                Book Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Higher Engineering Mathematics"
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-4 text-sm transition-all text-primary-custom"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-outline px-1" htmlFor="author">
                  Author(s) *
                </label>
                <input
                  id="author"
                  type="text"
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. B.S. Grewal"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-4 text-sm transition-all text-primary-custom"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-outline px-1" htmlFor="edition">
                  Edition / Year
                </label>
                <input
                  id="edition"
                  type="text"
                  value={edition}
                  onChange={e => setEdition(e.target.value)}
                  placeholder="e.g. 44th Edition"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-4 text-sm transition-all text-primary-custom"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-outline px-1">
                  Department Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-3 text-sm transition-all text-primary-custom cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Management & Finance">Management & Finance</option>
                  <option value="Chemistry & Biology">Chemistry & Biology</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-outline px-1" htmlFor="course">
                  Course Code (Optional)
                </label>
                <input
                  id="course"
                  type="text"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="e.g. MATH201, CS302"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-4 text-sm transition-all text-primary-custom"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-outline px-1" htmlFor="isbn">
                ISBN Number (Optional)
              </label>
              <input
                id="isbn"
                type="text"
                value={isbn}
                onChange={e => setIsbn(e.target.value)}
                placeholder="e.g. 9788193328491"
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 px-4 text-sm transition-all text-primary-custom"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-outline px-1" htmlFor="description">
                Condition Details / Seller Note
              </label>
              <textarea
                id="description"
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Minor highlighting. Spiral bound copy. Great for exam preparation."
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2 px-3 text-sm transition-all text-primary-custom"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4 bg-surface-container-low p-gutter rounded-xl border border-outline-variant/30 shadow-xs">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-2">
              <h2 className="font-serif text-base font-bold text-primary-custom flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add_a_photo</span> Photos
              </h2>
              <span className="text-[10px] text-outline font-semibold">Max 4 slots</span>
            </div>
            <div className="grid grid-cols-4 gap-base">
              {photoSlots.map(slot => (
                <div key={slot.key} className="aspect-square relative group">
                  {photos[slot.key] ? (
                    <div className="absolute inset-0 bg-surface-container-lowest border-2 border-secondary rounded-lg overflow-hidden">
                      <img src={photos[slot.key]!} alt={slot.label} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos(prev => {
                            const next = [...prev];
                            next[slot.key] = null;
                            return next;
                          })
                        }
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center text-outline group-hover:border-primary-custom group-hover:text-primary-custom transition-colors cursor-pointer overflow-hidden">
                      <span className="material-symbols-outlined text-lg">add</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">{slot.label}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handlePhotoUpload(slot.key, e)}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none"
                    disabled={photos[slot.key] !== null}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Condition Selector */}
          <div className="space-y-4 bg-surface-container-low p-gutter rounded-xl border border-outline-variant/30 shadow-xs">
            <h2 className="font-serif text-base font-bold text-primary-custom flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-lg">verified</span> Textbook Condition
            </h2>
            <div className="flex flex-col gap-base">
              {/* New */}
              <label
                className={`flex items-center p-3 border rounded-lg bg-surface-container-lowest cursor-pointer hover:bg-surface-container-high transition-colors ${
                  condition === 'new' ? 'border-secondary-custom bg-secondary-container/5 font-semibold' : 'border-outline-variant'
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={condition === 'new'}
                  onChange={() => setCondition('new')}
                  className="w-4 h-4 text-primary-custom focus:ring-primary-custom border-outline-variant"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-primary-custom">New</span>
                  <span className="block text-[11px] text-outline">Unused, crisp pages, no highlights or pen marks.</span>
                </div>
                <span className="ml-auto bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                  Best Value
                </span>
              </label>

              {/* Good */}
              <label
                className={`flex items-center p-3 border rounded-lg bg-surface-container-lowest cursor-pointer hover:bg-surface-container-high transition-colors ${
                  condition === 'good' ? 'border-secondary-custom bg-secondary-container/5 font-semibold' : 'border-outline-variant'
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value="good"
                  checked={condition === 'good'}
                  onChange={() => setCondition('good')}
                  className="w-4 h-4 text-primary-custom focus:ring-primary-custom border-outline-variant"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-primary-custom">Used - Good</span>
                  <span className="block text-[11px] text-outline">Minor shelf wear, minimal highlights, clean notes.</span>
                </div>
              </label>

              {/* Fair */}
              <label
                className={`flex items-center p-3 border rounded-lg bg-surface-container-lowest cursor-pointer hover:bg-surface-container-high transition-colors ${
                  condition === 'fair' ? 'border-secondary-custom bg-secondary-container/5 font-semibold' : 'border-outline-variant'
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value="fair"
                  checked={condition === 'fair'}
                  onChange={() => setCondition('fair')}
                  className="w-4 h-4 text-primary-custom focus:ring-primary-custom border-outline-variant"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-primary-custom">Used - Fair</span>
                  <span className="block text-[11px] text-outline">Well-loved, visible outer wear, solved problems.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-4 bg-surface-container-low p-gutter rounded-xl border border-outline-variant/30 shadow-xs">
            <h2 className="font-serif text-base font-bold text-primary-custom flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-lg">payments</span> Pricing
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">₹</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary-custom focus:ring-1 focus:ring-primary-custom rounded-lg py-2.5 pl-8 pr-4 transition-all font-bold text-base text-primary-custom"
                />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[9px] text-outline uppercase font-bold tracking-wider">Suggested Range</p>
                <p className="font-serif text-base font-bold text-secondary-custom">{suggestedRange}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary-custom text-white py-3.5 rounded-xl font-label-md text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group font-bold"
            >
              <span>List Book for Sale</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                send
              </span>
            </button>
            <p className="text-center text-xs text-outline mt-3">
              By listing, you agree to our{' '}
              <a href="#" className="text-primary-custom underline decoration-secondary-container">
                Community Student Guidelines
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
