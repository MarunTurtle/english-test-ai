import type { Question } from '@/types/question';

export function getMockQuestions(): Question[] {
  return [
    {
      id: '1',
      type: 'Main Idea',
      difficulty: 'Medium',
      question_text: 'What is the main idea of the passage?',
      options: [
        'The importance of conservation',
        'The history of wildlife',
        'The impact of climate change',
        'The role of technology'
      ],
      correct_answer: 0,
      evidence: 'Conservation efforts are crucial for preserving biodiversity.',
      validation_status: 'PASS'
    },
    {
      id: '2',
      type: 'Detail',
      difficulty: 'Easy',
      question_text: 'According to the passage, what year was mentioned?',
      options: ['2020', '2021', '2022', '2023'],
      correct_answer: 2,
      evidence: 'The study was conducted in 2022.',
      validation_status: 'PASS'
    },
    {
      id: '3',
      type: 'Inference',
      difficulty: 'Hard',
      question_text: 'What can be inferred from the author\'s tone?',
      options: [
        'The author is optimistic',
        'The author is pessimistic',
        'The author is neutral',
        'The author is confused'
      ],
      correct_answer: 0,
      evidence: 'Despite challenges, the future looks promising.',
      validation_status: 'NEEDS_FIX',
      validation_note: 'Evidence does not strongly support the inference'
    },
    {
      id: '4',
      type: 'Vocabulary',
      difficulty: 'Medium',
      question_text: 'In the context of the passage, what does "mitigate" mean?',
      options: ['Worsen', 'Reduce', 'Ignore', 'Celebrate'],
      correct_answer: 1,
      evidence: 'Efforts to mitigate the effects have been successful.',
      validation_status: 'PASS'
    },
    {
      id: '5',
      type: 'Main Idea',
      difficulty: 'Medium',
      question_text: 'What is the author\'s purpose in writing this passage?',
      options: [
        'To inform readers about a topic',
        'To persuade readers to take action',
        'To entertain with a story',
        'To describe a personal experience'
      ],
      correct_answer: 1,
      evidence: 'We must act now to protect our environment.',
      validation_status: 'PASS'
    }
  ];
}
