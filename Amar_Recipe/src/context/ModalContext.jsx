import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const showAlert = useCallback((message) => {
    return new Promise((resolve) => {
      setModal({ type: 'alert', message, resolve });
    });
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setModal({ type: 'confirm', message, resolve });
    });
  }, []);

  const showPrompt = useCallback((message, defaultValue = '') => {
    return new Promise((resolve) => {
      setModal({ type: 'prompt', message, defaultValue, resolve });
    });
  }, []);

  const handleClose = (result) => {
    if (modal?.resolve) {
      modal.resolve(result);
    }
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      {modal && <ModalOverlay modal={modal} onClose={handleClose} />}
    </ModalContext.Provider>
  );
};

const ModalOverlay = ({ modal, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState(modal.defaultValue || '');

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCloseAnimation = (result) => {
    setIsVisible(false);
    setTimeout(() => onClose(result), 200);   
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0'
      }`}
      onClick={() => {
        if(modal.type === 'alert') handleCloseAnimation(true);
      }}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-200 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
            modal.type === 'alert' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
          }`}>
            {modal.type === 'alert' ? (
               <FiInfo className="text-blue-500 w-8 h-8" />
            ) : (
               <FiAlertCircle className="text-amber-500 w-8 h-8" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {modal.type === 'alert' ? 'বার্তা' : modal.type === 'confirm' ? 'নিশ্চিত করুন' : 'ইনপুট প্রয়োজন'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
            {modal.message}
          </p>
          {modal.type === 'prompt' && (
            <input 
              type="text" 
              autoFocus
              className="mt-4 w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCloseAnimation(inputValue);
                if (e.key === 'Escape') handleCloseAnimation(null);
              }}
            />
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
          {(modal.type === 'confirm' || modal.type === 'prompt') && (
            <button
              onClick={() => handleCloseAnimation(modal.type === 'prompt' ? null : false)}
              className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
            >
              বাতিল করুন
            </button>
          )}
          <button
            onClick={() => handleCloseAnimation(modal.type === 'prompt' ? inputValue : true)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-white transition shadow-sm ${
              modal.type === 'confirm' || modal.type === 'prompt'
                ? 'bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/30 w-full'
            }`}
          >
            {modal.type === 'confirm' ? 'হ্যাঁ, নিশ্চিত' : modal.type === 'prompt' ? 'জমা দিন' : 'ঠিক আছে, বুঝেছি'}
          </button>
        </div>
      </div>
    </div>
  );
};
