module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
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
${text.substring(0, 5000)}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://expense-loan-trackerv2.vercel.app',
                'X-Title': 'Expense Management App'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const textContent = data.choices[0].message.content;

        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const extractedData = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, data: extractedData });
        }

        throw new Error('No JSON found in AI response');
    } catch (error) {
        console.error('Extraction error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to extract loan data'
        });
    }
};
