"use client";

interface WorkflowIndicatorProps {
  currentStep?: 'input' | 'generate' | 'review' | 'save';
}

const WORKFLOW_STEPS = [
  { key: 'input', label: 'Input' },
  { key: 'generate', label: 'Generate' },
  { key: 'review', label: 'Review' },
  { key: 'save', label: 'Save' },
] as const;

export function WorkflowIndicator({ currentStep = 'input' }: WorkflowIndicatorProps) {
  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.key === currentStep);

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <p className="text-xs font-semibold text-blue-700 uppercase">Current Workflow</p>
      <div className="mt-2 space-y-2">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isComplete = idx < currentStepIndex;

          return (
            <div key={step.key} className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  isComplete || isActive ? 'bg-blue-500' : 'bg-slate-300'
                }`} 
              />
              <span 
                className={`text-xs ${
                  isActive ? 'font-bold text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
