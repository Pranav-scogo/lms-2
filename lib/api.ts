// API utility functions for communicating with the backend

// Base URL for the API
export const API_BASE_URL = 'https://lms-backend-api-yuhp.onrender.com';

/**
 * Process a PDF file and return structured content
 * 
 * @param file - The PDF file to process
 * @returns The structured content from the PDF
 */
export async function processPdf(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/process-pdf`, {
      method: 'POST',
      body: formData,
      // No need to set Content-Type as it's automatically set with FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `Error processing PDF: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
} 