"use client"

import React, { createContext, useContext, useState } from 'react';
import { BookData } from './types';

interface BookContextType {
  selectedBook: BookData | null;
  setSelectedBook: (book: BookData | null) => void;
  isBookOpen: boolean;
  setIsBookOpen: (isOpen: boolean) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children
}) => {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <BookContext.Provider value={{ 
      selectedBook, 
      setSelectedBook,
      isBookOpen,
      setIsBookOpen
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};