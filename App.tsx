import React from 'react';
import Chat from './components/Chat';
import LegalInfo from './components/LegalInfo';
import { GavelIcon } from './components/icons/GavelIcon';

const App: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <GavelIcon className="h-8 w-8 text-emerald-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                المساعد القانوني السعودي
                <span className="text-gray-600 font-normal hidden sm:inline"> | Saudi Legal Assistant</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LegalInfo />
          </div>
          <div className="lg:col-span-2">
            <Chat />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} شركة حازم | Hazim Company. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;