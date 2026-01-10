import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Edit3, 
  Download,
  Database,
  Search,
  Plus,
  LogOut,
  Sparkles,
  School
} from 'lucide-react';

const App = () => {
  // State for Authentication and Navigation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStep, setCurrentStep] = useState('input');
  
  // App Data State
  const [passage, setPassage] = useState('');
  const [grade, setGrade] = useState('Middle 2');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [savedQuestions, setSavedQuestions] = useState<Array<{
    id: number;
    title: string;
    questions: typeof initialQuestions;
    grade: string;
    difficulty: string;
    date: string;
  }>>([]);

  // Mock data for questions
  const initialQuestions = [
    {
      id: 1,
      type: 'Main Idea',
      question: 'What is the main topic of this passage?',
      options: ['The history of space travel', 'The importance of healthy eating', 'How to play the piano', 'The life of a famous scientist'],
      answer: 1,
      evidence: "Found in Paragraph 1: 'Eating a balanced diet is crucial for maintaining physical and mental health.'",
      status: 'PASS',
      difficulty: 'Easy'
    },
    {
      id: 2,
      type: 'Detail',
      question: 'According to the text, which vitamin is mentioned as essential for bone health?',
      options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
      answer: 2,
      evidence: "Found in Paragraph 2: '...especially Vitamin D, which plays a key role in calcium absorption and bone density.'",
      status: 'PASS',
      difficulty: 'Medium'
    },
    {
      id: 3,
      type: 'Inference',
      question: 'What can be inferred about someone who skips breakfast?',
      options: ['They will lose weight quickly', 'They might experience lower energy levels', 'They are more productive', 'They have a faster metabolism'],
      answer: 1,
      evidence: "Inferred from Paragraph 3: 'Without a morning fuel source, the body begins to draw from stored glucose, often leading to a mid-morning slump.'",
      status: 'NEEDS FIX',
      issue: 'Distractor A is a common misconception and might be too tempting for lower-level students.',
      difficulty: 'Hard'
    },
    {
      id: 4,
      type: 'Vocabulary',
      question: 'In line 14, the word "crucial" is closest in meaning to:',
      options: ['Simple', 'Important', 'Boring', 'Optional'],
      answer: 1,
      evidence: "Context: '...crucial for maintaining physical and mental health.'",
      status: 'PASS',
      difficulty: 'Easy'
    }
  ];

  const [questions, setQuestions] = useState(initialQuestions);

  const handleSaveAll = () => {
    const newEntry = {
      id: Date.now(),
      title: passage.substring(0, 30) + '...',
      questions: questions,
      grade,
      difficulty,
      date: new Date().toLocaleDateString()
    };
    setSavedQuestions([newEntry, ...savedQuestions]);
    setCurrentStep('bank');
  };

  const handleLogin = () => {
    // Simulate API delay
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentStep('input');
    }, 600);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassage('');
    setQuestions(initialQuestions);
  };

  // --- Components for Screens ---

  const LandingScreen = () => (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">AI Workbench</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#" className="hover:text-blue-600 transition-colors">For Schools</a>
        </div>
        <button 
          onClick={handleLogin}
          className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Teacher Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-50/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          New: Middle School Curriculum Update
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl">
          Generate Perfect <span className="text-blue-600">English Tests</span><br />
          <span className="text-slate-400">Without the Headache</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          The AI workbench designed for Korean educators. Turn any reading passage into valid, syllabus-aligned multiple choice questions in seconds.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl shadow-sm transition-all transform active:scale-95 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <School className="w-4 h-4" />
            <span>Used by teachers in 120+ Schools</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100">
        © 2025 AI Question Workbench. All rights reserved.
      </footer>
    </div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          AI Workbench
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Teacher Control Panel</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button 
          onClick={() => setCurrentStep('input')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentStep === 'input' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Plus className="w-4 h-4" /> New Question Set
        </button>
        <button 
          onClick={() => setCurrentStep('bank')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentStep === 'bank' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Database className="w-4 h-4" /> Question Bank
        </button>
      </nav>

      {/* Sidebar Footer with Logout */}
      <div className="p-4 border-t border-slate-200 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 uppercase">Current Workflow</p>
          <div className="mt-2 space-y-2">
            {['Input', 'Generate', 'Review', 'Save'].map((step, idx) => {
              const activeIdx = ['input', 'generate', 'review', 'bank'].indexOf(currentStep);
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${idx <= activeIdx ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  <span className={`text-xs ${idx === activeIdx ? 'font-bold text-slate-700' : 'text-slate-400'}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  const InputScreen = () => (
    <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">1. Input & Settings</h2>
          <p className="text-slate-500">Provide a reading passage and configure your generation needs.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Reading Passage</label>
          <textarea 
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            placeholder="Paste your English reading passage here (minimum 100 words recommended)..."
            className="h-[500px] w-full p-6 text-lg bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm resize-none leading-relaxed text-slate-700"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
            <span>Character Count: {passage.length}</span>
            <span>Recommended: 500 - 2000 chars</span>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Generation Settings
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Grade Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Middle 1', 'Middle 2', 'Middle 3'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-2 text-xs rounded border ${grade === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 text-xs rounded border ${difficulty === d ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Number of Questions</label>
              <select 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase">Question Types</label>
              <div className="space-y-2">
                {['Main Idea', 'Detail', 'Inference', 'Vocabulary'].map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{type}</span>
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            disabled={!passage}
            onClick={() => setCurrentStep('generate')}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${!passage ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
          >
            Generate Question Set <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const GenerationScreen = () => (
    <div className="flex-1 flex h-screen bg-slate-50 overflow-hidden">
      {/* Passage Reference */}
      <div className="w-1/3 border-r border-slate-200 bg-white p-8 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Reference Passage</h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm italic border-l-4 border-slate-100 pl-4">
          {passage || "No passage provided. Please go back to input."}
        </p>
      </div>

      {/* Generated Results */}
      <div className="w-2/3 flex flex-col">
        <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">2. Generated Questions</h2>
            <p className="text-sm text-slate-500">AI has generated {questions.length} questions based on your input.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCurrentStep('input')} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              Back
            </button>
            <button onClick={() => setCurrentStep('review')} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md">
              Proceed to Validation
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Q{idx + 1} — {q.type}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {q.difficulty}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-lg font-semibold text-slate-800">{q.question}</p>
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`p-3 text-sm rounded-lg border flex items-center gap-3 ${oIdx === q.answer ? 'bg-blue-50 border-blue-200 text-blue-800 font-medium' : 'bg-white border-slate-100 text-slate-600'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${oIdx === q.answer ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Textual Evidence</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border-l-2 border-slate-200 italic">
                    {q.evidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ValidationScreen = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen">
      <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">3. Quality Review & Validation</h2>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase">
              <CheckCircle className="w-3.5 h-3.5" /> 3 Passed
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 uppercase">
              <AlertCircle className="w-3.5 h-3.5" /> 1 Needs Attention
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCurrentStep('generate')} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
            Back
          </button>
          <button onClick={handleSaveAll} className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-md">
            <Save className="w-4 h-4" /> Finalize & Save All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className={`bg-white border-l-8 rounded-xl overflow-hidden shadow-sm flex ${q.status === 'PASS' ? 'border-l-green-500' : 'border-l-amber-500'}`}>
            <div className="p-6 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${q.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {q.status}
                </span>
                <span className="text-xs font-bold text-slate-400">Q{idx + 1} — {q.type}</span>
              </div>
              <p className="font-bold text-slate-800 text-lg mb-4">{q.question}</p>
              
              {q.status === 'NEEDS FIX' && (
                <div className="mb-4 bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Validation Issue Detected</p>
                    <p className="text-sm text-amber-700 italic">{q.issue}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-64 bg-slate-50 border-l border-slate-100 p-6 flex flex-col gap-2 justify-center">
              <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200">
                <Edit3 className="w-4 h-4" /> Manual Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BankScreen = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen">
      <div className="p-8 border-b border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-800">My Question Bank</h2>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by passage title or keyword..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2">
             Filter <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Passage Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {savedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">
                    No questions saved yet. Start by generating a new set!
                  </td>
                </tr>
              ) : (
                savedQuestions.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 truncate w-64">{item.title}</p>
                      <span className="text-xs text-slate-400">Questions: {item.questions.length} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded uppercase">{item.grade}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">{item.difficulty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Export">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Main Render Logic
  if (!isLoggedIn) {
    return <LandingScreen />;
  }

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentStep === 'input' && <InputScreen />}
        {currentStep === 'generate' && <GenerationScreen />}
        {currentStep === 'review' && <ValidationScreen />}
        {currentStep === 'bank' && <BankScreen />}
      </main>
    </div>
  );
};

export default App;