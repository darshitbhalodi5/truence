export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 5;

export async function uploadFiles(files: File[]): Promise<string[]> {
  if (files.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} files allowed`);
  }

  const uploadPromises = files.map(async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} exceeds maximum size of 5MB`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file ${file.name}`);
    }

    const data = await response.json();
    return data.url;
  });

  return Promise.all(uploadPromises);
}