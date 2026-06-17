import { useState, useRef, ChangeEvent, DragEvent, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { AnalysisResult } from '../types';
import { analyzeImageWithGemini } from '../services/analyzerService';

interface UseImageAnalyzerProps {
  onSuccess?: () => void;
}

export const useImageAnalyzer = (props?: UseImageAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, seleccione un archivo de imagen válido.');
      return;
    }
    setError(null);
    setResult(null);
    
    try {
      // Compress the image before using it
      const options = {
        maxSizeMB: 1, // Max 1MB size
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Error compressing image:', err);
      setError('Error al procesar la imagen.');
    }
  }, []);

  const handleImageSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const clearSelection = useCallback(() => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!selectedImage || !imageFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = imageFile.type;

      const parsedResult = await analyzeImageWithGemini(base64Data, mimeType);
      setResult(parsedResult);
      if (props?.onSuccess) {
        props.onSuccess();
      }
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Ocurrió un error al analizar la imagen. Por favor, intente nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedImage, imageFile]);

  return {
    selectedImage,
    isAnalyzing,
    result,
    error,
    isDragging,
    fileInputRef,
    handleImageSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearSelection,
    analyzeImage
  };
};
