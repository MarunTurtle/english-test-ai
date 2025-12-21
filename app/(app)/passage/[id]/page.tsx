"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePassage } from "@/hooks/passages/use-passage";
import { useGenerateQuestions } from "@/hooks/questions/use-generate-questions";
import { GenerationSettings } from "@/components/generation/generation-settings";
import { GenerationLoader } from "@/components/generation/generation-loader";
import { ValidationScreen } from "@/components/generation/validation-screen";
import type { GenerationSettings as GenerationSettingsType, Question } from "@/types/question";
import { FiLoader, FiAlertCircle, FiChevronLeft, FiSave } from "react-icons/fi";

type WorkflowPhase = 'input' | 'generating' | 'results';

export default function PassageDetailPage() {
  const params = useParams();
  const passageId = params?.id as string;
  const { passage, loading, error } = usePassage(passageId);
  const { generateQuestions, isGenerating, error: generateError } = useGenerateQuestions();

  // Workflow state
  const [phase, setPhase] = useState<WorkflowPhase>('input');
  const [settings, setSettings] = useState<GenerationSettingsType>({
    difficulty: 'Medium',
    questionCount: 5,
    questionTypes: ['Main Idea', 'Detail'],
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGenerate = async () => {
    if (!passage) return;

    setPhase('generating');
    
    try {
      // Call actual OpenAI API
      const generatedQuestions = await generateQuestions({
        passageId: passage.id,
        gradeLevel: passage.grade_level as 'M1' | 'M2' | 'M3',
        difficulty: settings.difficulty,
        count: settings.questionCount,
        questionTypes: settings.questionTypes,
      });

      setQuestions(generatedQuestions);
      setPhase('results');
    } catch (err) {
      console.error('Generation failed:', err);
      // Stay on input phase if generation fails
      setPhase('input');
      alert(`Failed to generate questions: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleBack = () => {
    setPhase('input');
    setQuestions([]);
  };

  const handleSave = () => {
    // TODO: Implement save to database in next phase
    alert('Save functionality will be implemented in the next phase!');
  };

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? updatedQuestion : q))
    );
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    if (!passage) return;

    const questionToRegenerate = questions.find(q => q.id === questionId);
    if (!questionToRegenerate) return;

    try {
      // Generate a single new question with same settings
      const newQuestions = await generateQuestions({
        passageId: passage.id,
        gradeLevel: passage.grade_level as 'M1' | 'M2' | 'M3',
        difficulty: questionToRegenerate.difficulty,
        count: 1,
        questionTypes: [questionToRegenerate.type],
      });

      if (newQuestions.length > 0) {
        // Replace the old question with the new one, keeping the same position
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...newQuestions[0], id: questionId } : q))
        );
      }
    } catch (err) {
      console.error('Regeneration failed:', err);
      alert(`Failed to regenerate question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading passage...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !passage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Passage</h2>
          <p className="text-slate-600">{error || "Passage not found"}</p>
        </div>
      </div>
    );
  }

  // Phase 1: Input & Settings
  if (phase === 'input') {
    return (
      <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto bg-slate-50">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">1. Input & Settings</h2>
            <p className="text-slate-500">Review your passage and configure generation settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Passage Display */}
          <div className="col-span-8 flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
              Reading Passage
            </label>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{passage.title}</h3>
              <p className="text-xs text-slate-400 uppercase mb-4">
                Grade: {passage.grade_level} • {passage.content.length} characters
              </p>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap italic border-l-4 border-slate-100 pl-4">
                {passage.content}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="col-span-4">
            <GenerationSettings
              settings={settings}
              onChange={setSettings}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Generating
  if (phase === 'generating') {
    return <GenerationLoader />;
  }

  // Phase 3: Results & Validation
  return (
    <div className="flex-1 flex h-screen bg-slate-50 overflow-hidden">
      {/* Passage Reference (Left Side) */}
      <div className="w-1/3 border-r border-slate-200 bg-white p-8 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Reference Passage
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-800">{passage.title}</h4>
            <p className="text-xs text-slate-400 uppercase mt-1">
              {passage.grade_level}
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm italic border-l-4 border-slate-100 pl-4">
            {passage.content}
          </p>
        </div>
      </div>

      {/* Validation Screen (Right Side) */}
      <div className="w-2/3 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">2. Review & Validate</h2>
            <p className="text-sm text-slate-500">
              AI has generated {questions.length} questions. Review and validate them below.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              Save Question Set
            </button>
          </div>
        </div>

        {/* Validation Screen */}
        <div className="flex-1 overflow-y-auto p-8">
          <ValidationScreen
            questions={questions}
            onUpdateQuestion={handleUpdateQuestion}
            onRegenerateQuestion={handleRegenerateQuestion}
          />
        </div>
      </div>
    </div>
  );
}
