export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { prompt } = req.body;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 2500,
                system: "أنت مستشار قانوني سعودي خبير. صغ مذكرات قانونية موجهة للمحاكم السعودية (ناجز). استخدم لغة فصحى رصينة، واستشهد بالأنظمة السعودية (مثل نظام العمل، نظام المرافعات، نظام المعاملات المدنية) مع ذكر أرقام المواد (مثل المادة 77 من نظام العمل) حسب الحالة. التزم بهيكلية: (البسملة، صاحب الفضيلة قاضي الدائرة..، الوقائع، الأسانيد النظامية، الطلبات). لا تظهر كذكاء اصطناعي، بل كمحامي يكتب مسودة نهائية احترافية.",
                messages: [{ role: 'user', content: `صغ مذكرة قانونية احترافية مفصلة لهذه القضية: ${prompt}` }],
            }),
        });

        const data = await response.json();
        res.status(200).json({ result: data.content[0].text });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الاتصال بخادم الذكاء الاصطناعي' });
    }
}
