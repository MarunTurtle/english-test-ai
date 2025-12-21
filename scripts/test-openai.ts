/**
 * OpenAI API Connection Test Script
 * 
 * This script tests the OpenAI API connection and validates the response.
 * Run with: npm run test:openai
 */

// Load environment variables from .env.local FIRST (before any imports that use it)
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

// Import OpenAI directly to avoid module-level initialization issue
import OpenAI from 'openai';
import { GENERATION_SYSTEM_PROMPT, buildGenerationUserPrompt } from '../lib/ai/prompts';

// Test passage
const TEST_PASSAGE = `
The solar system is a collection of planets, moons, asteroids, and other celestial bodies 
that orbit around the Sun. There are eight planets in our solar system: Mercury, Venus, Earth, 
Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has unique characteristics. For example, 
Jupiter is the largest planet, while Mercury is the smallest. Earth is the only planet known 
to support life. The planets closer to the Sun, like Mercury and Venus, are very hot, while 
those farther away, like Neptune, are extremely cold.
`.trim();

async function testOpenAIConnection() {
  console.log('🔍 Testing OpenAI API Connection...\n');

  // Check environment variable
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY is not set in environment variables');
    console.log('\nPlease set your OpenAI API key:');
    console.log('1. Create a .env.local file in the project root');
    console.log('2. Add: OPENAI_API_KEY=sk-your-api-key-here\n');
    process.exit(1);
  }

  console.log('✅ OPENAI_API_KEY is set');
  console.log(`   Key preview: ${process.env.OPENAI_API_KEY.substring(0, 7)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}\n`);

  try {
    console.log('📝 Test Configuration:');
    console.log('   - Model: gpt-4o-mini');
    console.log('   - Grade Level: M2');
    console.log('   - Difficulty: Medium');
    console.log('   - Question Count: 2');
    console.log('   - Question Types: Main Idea, Detail\n');

    console.log('🚀 Sending request to OpenAI...\n');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const userPrompt = buildGenerationUserPrompt({
      passage: TEST_PASSAGE,
      gradeLevel: 'M2',
      difficulty: 'Medium',
      count: 2,
      questionTypes: ['Main Idea', 'Detail'],
    });

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('✅ Response received successfully!\n');

    console.log('📊 Response Details:');
    console.log(`   - Response ID: ${completion.id}`);
    console.log(`   - Model: ${completion.model}`);
    console.log(`   - Duration: ${duration}s`);
    
    if (completion.usage) {
      console.log(`   - Prompt Tokens: ${completion.usage.prompt_tokens}`);
      console.log(`   - Completion Tokens: ${completion.usage.completion_tokens}`);
      console.log(`   - Total Tokens: ${completion.usage.total_tokens}`);
    }

    console.log('\n📄 Extracting JSON from response...\n');

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const parsedJson = JSON.parse(content);

    console.log('✅ JSON parsed successfully!\n');

    console.log('📋 Generated Questions:');
    if (parsedJson.questions && Array.isArray(parsedJson.questions)) {
      console.log(`   - Total Questions: ${parsedJson.questions.length}\n`);
      
      parsedJson.questions.forEach((q: any, index: number) => {
        console.log(`   Question ${index + 1}:`);
        console.log(`   - Type: ${q.type || 'N/A'}`);
        console.log(`   - Difficulty: ${q.difficulty || 'N/A'}`);
        
        if (q.question) {
          const questionText = String(q.question);
          console.log(`   - Question: ${questionText.substring(0, 80)}${questionText.length > 80 ? '...' : ''}`);
        }
        
        if (q.options && Array.isArray(q.options)) {
          console.log(`   - Options: ${q.options.length}`);
          q.options.forEach((opt: any, i: number) => {
            console.log(`     ${String.fromCharCode(65 + i)}. ${String(opt).substring(0, 50)}${String(opt).length > 50 ? '...' : ''}`);
          });
        }
        
        console.log(`   - Correct Answer: ${q.correct_answer || 'N/A'}`);
        
        if (q.explanation) {
          const explText = String(q.explanation);
          console.log(`   - Explanation: ${explText.substring(0, 60)}${explText.length > 60 ? '...' : ''}`);
        }
        
        console.log('');
      });
    }

    console.log('✅ Test completed successfully!');
    console.log('\n🎉 OpenAI API is working correctly!\n');

  } catch (error) {
    console.error('\n❌ Test Failed!\n');
    
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      
      if (error.message.includes('401')) {
        console.error('\n💡 This looks like an authentication error.');
        console.error('   Please check that your OPENAI_API_KEY is valid and active.\n');
      } else if (error.message.includes('429')) {
        console.error('\n💡 Rate limit exceeded.');
        console.error('   Please wait a moment and try again.\n');
      } else if (error.message.includes('model')) {
        console.error('\n💡 Model not found or not accessible.');
        console.error('   Make sure you have access to gpt-4o-mini model.\n');
      }
    } else {
      console.error('Error:', error);
    }

    process.exit(1);
  }
}

// Run the test
testOpenAIConnection();

