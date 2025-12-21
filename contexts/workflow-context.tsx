"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type WorkflowStep = 'input' | 'generate' | 'review' | 'save';

interface WorkflowContextType {
  currentStep: WorkflowStep | undefined;
  setCurrentStep: (step: WorkflowStep | undefined) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep | undefined>(undefined);

  return (
    <WorkflowContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

