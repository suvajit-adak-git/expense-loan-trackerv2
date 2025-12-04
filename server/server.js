const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Anthropic API proxy endpoint
app.post('/api/extract-loan', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const apiKey = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured on server' });
        }

        const prompt = `Extract loan details from the following text/data. 
    Return ONLY a JSON object with these keys: 
    - name (string, guess a name like "Personal Loan" or "Home Loan")
    - type (string, one of: "personal", "car", "home")
    - principal (number)
    - interestRate (number)
    - emiAmount (number)
    - startDate (string, YYYY-MM-DD)
    - tenure (number, in months)
    - remainingBalance (number)
    - tenureLeft (number, in months)

    If a value is not found, use null or make a reasonable estimate based on context.
    
    Text/Data:
    ${text.substring(0, 5000)}
    `;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Expense Management App'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                max_tokens: 1000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const textContent = data.choices[0].message.content;

        // Extract JSON from response
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const extractedData = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, data: extractedData });
        }

        throw new Error('No JSON found in AI response');
    } catch (error) {
        console.error('Extraction error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to extract loan data'
        });
    }
});

// Groq API proxy endpoint for Portfolio Analysis
app.post('/api/analyze-portfolio', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Groq API key not configured on server' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsedContent = JSON.parse(content);

        return res.json(parsedContent);

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: error.message || 'Failed to analyze portfolio'
        });
    }
});

// Export the Express API
module.exports = app;

// Only listen if run directly (not imported)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Proxy server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}
