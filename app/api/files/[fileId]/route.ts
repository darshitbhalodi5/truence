import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  let client;
  try {
    // Connect to MongoDB
    client = await connectMongo();
    const bucket = new GridFSBucket(client.db());
    const rawFileId = (await params).fileId;
    // Get file info
    const fileId = new ObjectId(rawFileId);
    const files = await bucket.find({ _id: fileId }).toArray();
    
    if (!files.length) {
      return new NextResponse('File not found', { status: 404 });
    }

    const file = files[0];

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', file.metadata?.type || 'application/octet-stream');
    headers.set('Content-Disposition', `inline; filename="${file.metadata?.originalName}"`);
    
    // Create readable stream
    const downloadStream = bucket.openDownloadStream(fileId);

    // Create a transform stream that will accumulate the file data
    const chunks: Buffer[] = [];
    
    // Read the stream
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    
    // Concatenate all chunks
    const fileData = Buffer.concat(chunks);

    // Return the file
    return new NextResponse(fileData, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error retrieving file' }),
      { status: 500 }
    );
  } finally {
    if (client) {
      // Don't close the connection as it's cached
      // await client.close();
    }
  }
} 