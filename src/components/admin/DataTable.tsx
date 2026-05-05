'use client';

import { motion } from 'framer-motion';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading,
  emptyMessage = 'No items found.'
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 border border-[#1a1a1a] rounded-xl bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-[#99ccff]/20 border-t-[#99ccff] rounded-full animate-spin" />
        <span className="text-xs text-white/40 font-mono tracking-widest uppercase">Fetching encrypted data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 border border-[#1a1a1a] rounded-xl bg-[#0a0a0a]">
        <span className="text-3xl opacity-20">🕳️</span>
        <span className="text-xs text-white/20 font-mono tracking-widest uppercase">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-[#1a1a1a] rounded-xl bg-[#0a0a0a]/50 backdrop-blur-sm shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-white/2">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`px-6 py-4 text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={item.id}
                className="group border-b border-[#1a1a1a] hover:bg-white/2 transition-colors duration-200"
              >
                {columns.map((col, j) => (
                  <td key={j} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 hover:bg-[#99ccff]/10 text-[#99ccff] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
