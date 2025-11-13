import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Save quiz progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamName, teamEmail, answers, startTime, currentQuestion } = body;

    if (!teamName || !teamEmail) {
      return NextResponse.json(
        { error: 'Team name and email are required' },
        { status: 400 }
      );
    }

    // Check if team already submitted
    const { data: existing } = await supabase
      .from('quiz_submissions')
      .select('id, submitted_at')
      .eq('team_email', teamEmail)
      .eq('submitted', true)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Team has already submitted the quiz' },
        { status: 400 }
      );
    }

    // Upsert progress (save or update)
    const { error } = await supabase
      .from('quiz_progress')
      .upsert(
        {
          team_name: teamName,
          team_email: teamEmail,
          answers: answers || {},
          start_time: startTime,
          current_question: currentQuestion || 1,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: 'team_email',
        }
      );

    if (error) {
      console.error('Error saving progress:', error);
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in progress route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get quiz progress
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

    const { data, error } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('team_email', teamEmail)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is OK
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: data || null });
  } catch (error) {
    console.error('Error in progress route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

