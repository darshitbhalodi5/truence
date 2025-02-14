import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  let client;
  try {
    client = await connectMongo();
    const bucket = new GridFSBucket(client.db());
    const rawFileId = (await params).fileId;
    const fileId = new ObjectId(rawFileId);
    
    const files = await bucket.find({ _id: fileId }).toArray();
    
    if (!files.length) {
      return new NextResponse('File not found', { status: 404 });
    }

    const file = files[0];

    return NextResponse.json({
      filename: file.filename,
      originalName: file.metadata?.originalName || file.filename,
      contentType: file.metadata?.type || 'application/octet-stream',
      size: file.length,
      uploadDate: file.uploadDate
    });
  } catch (error) {
    console.error('Error retrieving file metadata:', error);
    return NextResponse.json(
      { error: 'Error retrieving file metadata' },
      { status: 500 }
    );
  }
} 