// app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      programName,
      title,
      description,
      severityLevel,
      files,
      walletAddress,
    } = body;

    // Validate input
    if (!programName || !title || !description || !severityLevel || !walletAddress) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { message: 'Title exceeds maximum length' },
        { status: 400 }
      );
    }

    if (description.split(/\s+/).length > 500) {
      return NextResponse.json(
        { message: 'Description exceeds maximum word count' },
        { status: 400 }
      );
    }

    if (files && files.length > 5) {
      return NextResponse.json(
        { message: 'Too many files' },
        { status: 400 }
      );
    }

    // Create submission
    const submission = await Submission.create({
      programName,
      title,
      description,
      severityLevel,
      files,
      walletAddress,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}