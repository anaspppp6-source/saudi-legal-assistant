export default async function handler(req, res) {
    // 1. التأكد من نوع الطلب
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. الحصول على البيانات (تعديل مفصلي هنا)
        const { prompt } = req.body;

        // 3. الاتصال بـ Claude
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1500,
                messages: [{ role: 'user', content: `أنت محامي سعودي خبير. صغ لي مذكرة قانونية رصينة بناءً على الوقائع التالية: ${prompt}` }],
            }),
        });

        const data = await response.json();

        // 4. إرسال النتيجة للمتصفح
        if (data.content && data.content[0]) {
            res.status(200).json({ result: data.content[0].text });
        } else {
            console.error('Claude API Error:', data);
            res.status(500).json({ result: "عذراً، المحرك لم يرد بشكل صحيح. تأكد من الرصيد والمفتاح." });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ result: "حدث خطأ داخلي في الاتصال." });
    }
}
