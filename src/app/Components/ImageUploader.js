'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ImageUploader({ onImageUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/uploads/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Call the callback with the image URL
      if (onImageUploaded) {
        onImageUploaded(response.data.imageUrl);
      }

      // Clear the form
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {preview ? (
            <img 
              src={preview || "/placeholder.svg"} 
              alt="Preview" 
              className="h-40 mx-auto object-contain mb-4" 
            />
          ) : (
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Click to upload an image</p>
            </div>
          )}
        </label>
        
        {file && (
          <div className="text-sm text-gray-500 mt-1">
            {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}