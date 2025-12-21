/**
 * Skeleton Loader Component
 * Provides loading placeholders with pulse animation
 */

interface SkeletonLoaderProps {
  variant: 'card' | 'question' | 'table-row' | 'text';
  count?: number;
  className?: string;
}

/**
 * Skeleton for passage card
 */
function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
      
      {/* Content skeleton - 3 lines */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 rounded w-4/6"></div>
      </div>
      
      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-200 rounded"></div>
          <div className="h-8 w-8 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for question card
 */
function QuestionSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse">
      {/* Header with badge and icons */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
          <div className="h-5 bg-slate-200 rounded w-24"></div>
          <div className="h-5 bg-slate-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
      </div>
      
      {/* Question text */}
      <div className="h-5 bg-slate-200 rounded w-full mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-4/5 mb-4"></div>
      
      {/* Options - 4 lines */}
      <div className="space-y-3 mb-4">
        <div className="h-10 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
      
      {/* Evidence */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

/**
 * Skeleton for table row
 */
function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          <div className="h-5 bg-slate-200 rounded w-16"></div>
          <div className="h-5 bg-slate-200 rounded w-16"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-slate-200 rounded"></div>
          <div className="h-8 w-16 bg-slate-200 rounded"></div>
        </div>
      </td>
    </tr>
  );
}

/**
 * Skeleton for text lines
 */
function TextSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
    </div>
  );
}

/**
 * Main SkeletonLoader component
 */
export function SkeletonLoader({ variant, count = 1, className = '' }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((i) => (
          <CardSkeleton key={i} />
        ))}
      </>
    );
  }

  if (variant === 'question') {
    return (
      <div className={className}>
        {skeletons.map((i) => (
          <QuestionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {skeletons.map((i) => (
          <TableRowSkeleton key={i} />
        ))}
      </>
    );
  }

  if (variant === 'text') {
    return <TextSkeleton className={className} />;
  }

  return null;
}

