import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs - using local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const LoanUpload = ({ onDataExtracted }) => {
    const fileInputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const extractTextFromPDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        // Extract text from first 3 pages max
        const maxPages = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    };

    const extractTextFromExcel = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        return JSON.stringify(jsonData.slice(0, 20)); // First 20 rows
    };

    const analyzeWithAI = async (text) => {
        try {
            const response = await fetch('/api/extract-loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'API request failed');
            }

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('AI Analysis failed:', error);
            return null;
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('File selected:', file.name, file.type);
        setIsProcessing(true);
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                console.log('Extracting text from PDF...');
                text = await extractTextFromPDF(file);
                console.log('PDF text extracted, length:', text.length);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
                console.log('Extracting text from Excel...');
                text = await extractTextFromExcel(file);
                console.log('Excel text extracted, length:', text.length);
            } else {
                alert('Unsupported file type. Please upload PDF or Excel.');
                setIsProcessing(false);
                return;
            }

            console.log('Sending to AI for analysis...');
            let extractedData = await analyzeWithAI(text);
            console.log('AI response:', extractedData);

            if (!extractedData) {
                extractedData = {
                    name: file.name.split('.')[0],
                    type: 'personal',
                    principal: 0,
                    interestRate: 0,
                    emiAmount: 0,
                    startDate: new Date().toISOString().split('T')[0],
                    tenure: 0,
                    remainingBalance: 0,
                    tenureLeft: 0
                };
                alert("AI extraction failed. Switched to manual entry with filename.");
            }

            console.log('Calling onDataExtracted with:', extractedData);
            onDataExtracted(extractedData);
        } catch (error) {
            console.error('Processing error:', error);
            alert('Error processing file. Please try manual entry.');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="inline-block">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.xls,.csv"
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current.click()}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                {isProcessing ? 'Analyzing...' : 'Upload Document'}
            </button>
        </div>
    );
};

export default LoanUpload;
