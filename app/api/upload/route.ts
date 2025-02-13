import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import { connectMongo } from '@/lib/mongodb';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/json',
  'application/zip',
  'application/x-zip-compressed'
];

// Helper function to validate file
function validateFile(file: File) {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }

  return errors;
}

export async function POST(request: NextRequest) {
  let client;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validate file
    const validationErrors = validateFile(file);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Create unique filename with original extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const originalExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${timestamp}-${randomString}-${sanitizedOriginalName}`;

    try {
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Connect to MongoDB
      client = await connectMongo();
      const bucket = new GridFSBucket(client.db());

      // Create upload stream
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          originalName: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date()
        }
      });

      // Write buffer to GridFS
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
        uploadStream.write(buffer);
        uploadStream.end();
      });

      // Return success response with file details
      return NextResponse.json({
        success: true,
        file: {
          url: `/api/files/${uploadStream.id}`, // URL to retrieve file
          fileId: uploadStream.id.toString(),
          filename: filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('File processing error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Error processing file',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      // Don't close the connection as it's cached
      // await client.close();
    }
  }
}

// Handle preflight requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}