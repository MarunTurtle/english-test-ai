// Textual evidence display component

interface QuestionEvidenceProps {
  evidence: string;
}

export function QuestionEvidence({ evidence }: QuestionEvidenceProps) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs font-bold text-slate-400 uppercase mb-2">
        Textual Evidence
      </p>
      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border-l-4 border-slate-200 italic">
        {evidence}
      </p>
    </div>
  );
}
