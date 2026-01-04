import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export const revalidate = 30; // Revalidate every 30 seconds (optimized)

export async function GET() {
  try {
    // Check if Sanity client is configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
      return NextResponse.json(
        { error: 'Sanity client not configured' },
        { status: 500 }
      );
    }

    // First try to get an active quiz
    let quiz = await client.fetch(groq`*[_type == "registrationQuiz" && isActive == true][0] {
      _id,
      title,
      isActive,
      scheduledStartTime,
      questions[] {
        text,
        options,
        correctOption,
        category,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        }
      },
      instructions
    }`).catch((error) => {
      console.error('Error fetching active quiz from Sanity:', error);
      return null;
    });

    // If no active quiz, get the latest quiz (active or not) so teams can prepare
    if (!quiz) {
      quiz = await client.fetch(groq`*[_type == "registrationQuiz"] | order(_createdAt desc)[0] {
        _id,
        title,
        isActive,
        scheduledStartTime,
        questions[] {
          text,
          options,
          correctOption,
          category,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              }
            }
          }
        },
        instructions
      }`).catch((error) => {
        console.error('Error fetching latest quiz from Sanity:', error);
        return null;
      });
    }

    if (!quiz) {
      // Check if there are any quizzes at all (for debugging)
      const allQuizzes = await client.fetch(groq`*[_type == "registrationQuiz"] { _id, title, isActive }`).catch(() => []);
      console.log('No quiz found. Available quizzes:', allQuizzes);
      
      return NextResponse.json(
        { 
          error: 'No quiz found',
          availableQuizzes: allQuizzes.length,
          message: allQuizzes.length === 0 
            ? 'No quiz documents exist in Sanity. Please create one in the Studio.'
            : 'No quiz is currently available.'
        },
        { status: 404 }
      );
    }

    // Transform questions to match expected format
    const transformedQuestions = (quiz.questions || []).map((q: any, index: number) => ({
      id: index + 1,
      text: q.text,
      options: q.options || [],
      correctOption: q.correctOption,
      image: q.image?.asset?.url || null,
      category: q.category || 'common',
    }));

    return NextResponse.json({
      id: quiz._id,
      title: quiz.title || 'Formula IHU Registration Quiz',
      scheduledStartTime: quiz.scheduledStartTime,
      durationMinutes: 120, // Fixed 2 hours (120 minutes) - kept for backward compatibility
      questions: transformedQuestions,
      instructions: quiz.instructions || '',
    });
  } catch (error) {
    console.error('Error fetching quiz config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz configuration' },
      { status: 500 }
    );
  }
}

