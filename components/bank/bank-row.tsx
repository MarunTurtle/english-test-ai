'use client';

import { useRouter } from 'next/navigation';
import type { QuestionSetWithPassage } from '@/types';
import { FiFileText, FiTrash2, FiLoader } from 'react-icons/fi';

interface BankRowProps {
  questionSet: QuestionSetWithPassage;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function BankRow({ questionSet, onDelete, isDeleting }: BankRowProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/passage/${questionSet.passage_id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <p className="font-bold text-slate-700 truncate max-w-md">
          {questionSet.passage.title}
        </p>
        <span className="text-xs text-slate-400">
          Questions: {questionSet.question_count} items
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded uppercase">
            {questionSet.passage.grade_level}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">
            {questionSet.difficulty}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(questionSet.created_at)}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={handleView}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="View"
          disabled={isDeleting}
        >
          <FiFileText className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(questionSet.id)}
          className={`p-2 rounded-lg transition-colors ${
            isDeleting
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
          }`}
          title="Delete"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiTrash2 className="w-5 h-5" />
          )}
        </button>
      </td>
    </tr>
  );
}
