'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FieldType = 'text' | 'textarea' | 'select' | 'switch' | 'date' | 'number';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  gridCols?: 1 | 2;
}

interface EntityFormProps {
  title: string;
  fields: FieldDefinition[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isModal?: boolean;
}

export default function EntityForm({
  title,
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  isLoading,
  isModal = true
}: EntityFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  };

  const formContent = (
      <motion.div
        initial={isModal ? { opacity: 0, scale: 0.95, y: 20 } : false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-full max-w-2xl overflow-hidden ${isModal ? 'shadow-2xl shadow-black/50' : ''}`}
      >
        {/* Form Header */}
        <div className="px-8 py-6 border-b border-[#1a1a1a] bg-white/2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#99ccff] tracking-tight">{title}</h3>
          {isModal && (
            <button type="button" onClick={onCancel} className="text-white/20 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono">
              [ERROR] {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {fields.map((field) => (
              <div 
                key={field.name} 
                className={field.gridCols === 2 ? 'col-span-2' : 'col-span-1'}
              >
                <label className="block text-[10px] font-bold text-white/40 tracking-widest uppercase mb-2">
                  {field.label} {field.required && <span className="text-[#99ccff]">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-sm focus:border-[#99ccff]/50 focus:ring-1 focus:ring-[#99ccff]/20 outline-none transition-all"
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-sm focus:border-[#99ccff]/50 focus:ring-1 focus:ring-[#99ccff]/20 outline-none transition-all"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-sm focus:border-[#99ccff]/50 focus:ring-1 focus:ring-[#99ccff]/20 outline-none transition-all resize-none"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-sm focus:border-[#99ccff]/50 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>{field.placeholder || 'Select option'}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {field.type === 'date' && (
                  <input
                    type="date"
                    value={formData[field.name] ? new Date(formData[field.name]).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-sm focus:border-[#99ccff]/50 outline-none transition-all"
                  />
                )}

                {field.type === 'switch' && (
                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleChange(field.name, !formData[field.name])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#99ccff]/20 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                        formData[field.name] ? 'bg-[#99ccff]' : 'bg-[#333333]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData[field.name] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-white/60">{formData[field.name] ? 'Enabled' : 'Disabled'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="mt-10 flex items-center justify-end gap-4">
            {isModal && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 text-sm font-bold text-white/40 hover:text-white transition-colors"
              >
                CANCEL
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#99ccff] text-[#080808] px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7ab8e6] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#99ccff]/10"
            >
              {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </motion.div>
  );

  return isModal ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {formContent}
    </div>
  ) : formContent;
}
