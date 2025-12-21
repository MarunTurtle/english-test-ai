import { Spinner } from '@/components/shared/spinner';

// Loading state during question generation

export function GenerationLoader() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px]">
      <div className="text-center">
        <Spinner size="lg" className="text-blue-600 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Generating Questions...
        </h3>
        <p className="text-sm text-slate-500">
          AI is analyzing the passage and creating test items
        </p>
      </div>
    </div>
  );
}
