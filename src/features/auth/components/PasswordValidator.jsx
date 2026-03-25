import React from 'react';
import { CheckCircle2, CircleX } from 'lucide-react';

export default function PasswordValidator({ password }) {
  const requirements = [
    { id: 'length', text: 'Ít nhất 8 kí tự', regex: /.{8,}/ },
    { id: 'uppercase', text: 'Ít nhất 1 chữ hoa', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'Ít nhất 1 chữ thường', regex: /[a-z]/ },
    { id: 'number', text: 'Ít nhất 1 số', regex: /[0-9]/ },
    { id: 'special', text: 'Ít nhất 1 kí tự đặc biệt', regex: /[^A-Za-z0-9]/ },
  ];

  return (
    <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg text-sm">
      <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Mật khẩu phải bao gồm:</p>
      <div className="space-y-2">
        {requirements.map((req) => {
          const isValid = req.regex.test(password);
          return (
            <div key={req.id} className={`flex items-center gap-2 ${isValid ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {isValid ? <CheckCircle2 size={16} /> : <CircleX size={16} />}
              <span>{req.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
