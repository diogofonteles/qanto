'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const uploadResult = await api.uploadCsv(file);
      setResult(uploadResult);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,priceCents,categoryId,description,brand,barcode,promoPriceCents,stock,unit
Arroz Integral 1kg,599,<category-id-here>,Arroz integral orgânico,Tio João,7891234567890,549,100,un
Feijão Preto 1kg,899,<category-id-here>,Feijão preto tipo 1,Camil,7891234567891,,50,un`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSV Upload</CardTitle>
        <CardDescription>Upload multiple products at once using a CSV file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
          <h4 className="font-semibold mb-2">CSV Format Instructions:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              <strong>Required columns:</strong> name, priceCents, categoryId
            </li>
            <li>
              <strong>Optional columns:</strong> description, brand, barcode, promoPriceCents, stock, unit
            </li>
            <li>Prices must be in cents (e.g., R$ 5.99 = 599)</li>
            <li>Use the category ID from your available categories</li>
            <li>Barcode must be 13 digits (EAN-13)</li>
            <li>Max file size: 5MB</li>
          </ul>
          <Button variant="link" onClick={downloadTemplate} className="mt-2 p-0 h-auto">
            Download CSV Template
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-md ${result.failed > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
            <h4 className="font-semibold mb-2">Upload Complete</h4>
            <div className="space-y-1 text-sm">
              <p className="text-green-700">✓ Successfully imported: {result.success} products</p>
              {result.failed > 0 && (
                <>
                  <p className="text-red-700">✗ Failed: {result.failed} products</p>
                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Errors:</p>
                      <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                        {result.errors.slice(0, 10).map((err, idx) => (
                          <li key={idx} className="text-red-600">
                            {err}
                          </li>
                        ))}
                        {result.errors.length > 10 && (
                          <li className="text-gray-600">
                            ... and {result.errors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            disabled={loading}
          />
          {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
        </div>

        <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
          {loading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </CardContent>
    </Card>
  );
}
