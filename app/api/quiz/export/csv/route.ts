import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch all submissions
    const { data: submissions, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('submitted', true)
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    // Group by team_email and keep only first submission
    const firstSubmissions = (submissions || []).reduce((acc: any[], submission: any) => {
      const existing = acc.find(s => s.team_email === submission.team_email);
      if (!existing) {
        acc.push(submission);
      }
      return acc;
    }, []);

    // Sort by submitted_at descending
    firstSubmissions.sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    // Convert to CSV format
    const csvRows: string[] = [];
    
    // Header row
    csvRows.push([
      'Team Name',
      'Team Email',
      'Score',
      'Total Questions',
      'Time Taken (seconds)',
      'Time Taken (formatted)',
      'Submitted At',
      'Answers (JSON)'
    ].join(','));

    // Data rows
    firstSubmissions.forEach((submission) => {
      const timeMinutes = Math.floor(submission.time_taken / 60);
      const timeSeconds = submission.time_taken % 60;
      const timeFormatted = `${timeMinutes}m ${timeSeconds}s`;
      
      const answersJson = JSON.stringify(submission.answers || {}).replace(/"/g, '""');
      
      csvRows.push([
        `"${(submission.team_name || '').replace(/"/g, '""')}"`,
        `"${(submission.team_email || '').replace(/"/g, '""')}"`,
        submission.score || 0,
        Array.isArray(submission.questions) ? submission.questions.length : 0,
        submission.time_taken || 0,
        `"${timeFormatted}"`,
        `"${new Date(submission.submitted_at).toISOString()}"`,
        `"${answersJson}"`
      ].join(','));
    });

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="quiz-results-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV', details: error.message },
      { status: 500 }
    );
  }
}

