// Multiple choice options display component

interface QuestionOptionsProps {
  options: [string, string, string, string];
  correctAnswer: number;
  showAnswer?: boolean;
}

export function QuestionOptions({ options, correctAnswer, showAnswer = true }: QuestionOptionsProps) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option, index) => {
        const isCorrect = index === correctAnswer;
        const baseClasses = "p-3 text-sm rounded-lg border flex items-center gap-3 transition-colors";
        const colorClasses = showAnswer && isCorrect
          ? "bg-blue-50 border-blue-200 text-blue-800 font-medium"
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";

        return (
          <div key={index} className={`${baseClasses} ${colorClasses}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                showAnswer && isCorrect
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {letters[index]}
            </span>
            <span className="flex-1">{option}</span>
          </div>
        );
      })}
    </div>
  );
}
