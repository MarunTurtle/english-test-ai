// Status indicator for validation status

import type { ValidationStatus } from '@/types/question';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface StatusIndicatorProps {
  status: ValidationStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'PASS') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
        <FiCheckCircle className="w-3.5 h-3.5" />
        <span>PASS</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
      <FiAlertCircle className="w-3.5 h-3.5" />
      <span>NEEDS FIX</span>
    </div>
  );
}
