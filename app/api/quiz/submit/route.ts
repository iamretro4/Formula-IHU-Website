import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Check if team submitted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamEmail = searchParams.get('teamEmail');

    if (!teamEmail) {
      return NextResponse.json(
        { error: 'Team email is required' },
        { status: 400 }
      );
    }

    // Get the first submission (ordered by submitted_at ASC to get the earliest)
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('id, submitted_at, submitted, time_taken, score')
      .eq('team_email', teamEmail)
      .eq('submitted', true)
      .order('submitted_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to check submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submitted: !!data, submission: data || null });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      console.error('Supabase not configured:', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });
      return NextResponse.json(
        { error: 'Database not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { teamName, teamEmail, vehicleCategory, preferredTeamNumber, alternativeTeamNumber, fuelType, answers, timeTaken, score, questions } = body;

    if (!teamName || !teamEmail || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields', received: { teamName: !!teamName, teamEmail: !!teamEmail, answers: !!answers } },
        { status: 400 }
      );
    }

    // Check if team already submitted (get the first submission only)
    const { data: existing, error: checkError } = await supabase
      .from('quiz_submissions')
      .select('id, submitted_at, submitted')
      .eq('team_email', teamEmail)
      .order('submitted_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing submission:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing submission', details: checkError.message },
        { status: 500 }
      );
    }

    // If team already submitted, return the existing submission (keep only first)
    if (existing) {
      return NextResponse.json(
        { 
          error: 'Team has already submitted the quiz. Only the first submission is kept.',
          submissionId: existing.id,
          alreadySubmitted: true
        },
        { status: 400 }
      );
    }

    // Save submission - use upsert with ON CONFLICT to ensure only first submission is kept
    // If email already exists, this will fail due to UNIQUE constraint, which is what we want
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert([
        {
          team_name: teamName,
          team_email: teamEmail,
          vehicle_category: vehicleCategory,
          preferred_team_number: preferredTeamNumber,
          alternative_team_number: alternativeTeamNumber,
          fuel_type: fuelType,
          time_taken: timeTaken,
          score: score,
          questions: questions,
          answers: answers,
          submitted: true,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving submission:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a unique constraint violation (duplicate email)
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        // Team already has a submission - fetch the first one
        const { data: firstSubmission } = await supabase
          .from('quiz_submissions')
          .select('id, submitted_at')
          .eq('team_email', teamEmail)
          .order('submitted_at', { ascending: true })
          .limit(1)
          .single();
        
        return NextResponse.json(
          { 
            error: 'Team has already submitted the quiz. Only the first submission is kept.',
            submissionId: firstSubmission?.id,
            alreadySubmitted: true
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save submission',
          details: error.message || error.code || 'Unknown error',
          hint: error.hint || null,
          code: error.code || null
        },
        { status: 500 }
      );
    }

    // Delete progress after successful submission
    await supabase
      .from('quiz_progress')
      .delete()
      .eq('team_email', teamEmail);

    return NextResponse.json({ success: true, submissionId: data.id });
  } catch (error) {
    console.error('Error in submit route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

