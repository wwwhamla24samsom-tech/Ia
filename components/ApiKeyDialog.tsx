
import React from 'react';

interface ApiKeyDialogProps {
  onSuccess: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onSuccess }) => {
  const handleOpenSelect = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      onSuccess();
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">مطلوب مفتاح API</h2>
        <p className="text-gray-600">
          لاستخدام نموذج الصور المتقدم، يجب عليك اختيار مفتاح API من مشروع Google Cloud مدفوع.
        </p>
        <button
          onClick={handleOpenSelect}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          اختر مفتاح API
        </button>
        <div className="text-sm text-gray-500">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            تعرف على الفوترة والتكاليف
          </a>
        </div>
      </div>
    </div>
  );
};
