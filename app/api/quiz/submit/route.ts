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
  } catch {
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
      return NextResponse.json(
        { error: 'Database not configured. Please contact support.' },
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

    // Use database-level transaction to prevent race conditions
    // First, try to insert with conflict handling - this is atomic
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
      // Check if it's a unique constraint violation (duplicate email) - race condition detected
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        // Another submission happened simultaneously - fetch the first one
        const { data: firstSubmission } = await supabase
          .from('quiz_submissions')
          .select('id, submitted_at, time_taken, score')
          .eq('team_email', teamEmail)
          .order('submitted_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        return NextResponse.json(
          { 
            error: 'Team has already submitted the quiz. Only the first submission is kept.',
            submissionId: firstSubmission?.id,
            alreadySubmitted: true,
            submission: firstSubmission || null
          },
          { status: 400 }
        );
      }
      
      // For other errors, log but don't expose internal details
      return NextResponse.json(
        { 
          error: 'Failed to save submission. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  } catch {
    // Log error for monitoring but don't expose details to client
    return NextResponse.json(
      { error: 'An error occurred while submitting. Please try again.' },
      { status: 500 }
    );
  }
}

