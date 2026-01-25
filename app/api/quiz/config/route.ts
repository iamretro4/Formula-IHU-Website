import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export const revalidate = 30; // Revalidate every 30 seconds (optimized)

export async function GET() {
  try {
    // Check if Sanity client is configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
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
        type,
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
        },
        file {
          asset-> {
            _id,
            url,
            originalFilename,
            size,
            mimeType
          }
        }
      },
      instructions
    }`).catch(() => {
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
          type,
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
          },
          file {
            asset-> {
              _id,
              url,
              originalFilename,
              size,
              mimeType
            }
          }
        },
        instructions
      }`).catch(() => {
        return null;
      });
    }

    if (!quiz) {
      // Check if there are any quizzes at all
      const allQuizzes = await client.fetch(groq`*[_type == "registrationQuiz"] { _id, title, isActive }`).catch(() => []);
      
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
    // SECURITY: Do not send correctOption to client - score is calculated server-side
    const transformedQuestions = (quiz.questions || []).map((q: any, index: number) => ({
      id: index + 1,
      text: q.text,
      type: q.type || 'multiple_choice', // Default to multiple_choice for backward compatibility
      options: q.options || [],
      // correctOption is NOT sent to client for security
      image: q.image?.asset?.url || null,
      file: q.file?.asset ? {
        url: q.file.asset.url,
        filename: q.file.asset.originalFilename || 'download',
        size: q.file.asset.size,
        mimeType: q.file.asset.mimeType,
      } : null,
      category: q.category || 'common',
    }));

    const response = NextResponse.json({
      id: quiz._id,
      title: quiz.title || 'Formula IHU Registration Quiz',
      scheduledStartTime: quiz.scheduledStartTime,
      durationMinutes: 120, // Fixed 2 hours (120 minutes) - kept for backward compatibility
      questions: transformedQuestions,
      instructions: quiz.instructions || '',
    });

    // Add caching headers for scalability (30 seconds cache, stale-while-revalidate for better UX)
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch quiz configuration' },
      { status: 500 }
    );
  }
}

