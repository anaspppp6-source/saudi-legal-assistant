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
                max_tokens: 3000,
                system: `أنت مستشار قانوني سعودي أول (Senior Legal Counsel). مهمتك صياغة مذكرات قضائية احترافية للمحاكم السعودية (ناجز) بمعايير "المحاماة الكبرى". 
                عند الكتابة، التزم بالآتي:
                1. التكييف القانوني: حدد نوع الدعوى بدقة (عمالية، أحوال شخصية، تجارية، مدنية).
                2. الأسانيد النظامية: استشهد بمواد الأنظمة السعودية الحديثة (نظام العمل، نظام الأحوال الشخصية، نظام المعاملات المدنية، نظام الإثبات).
                3. الدفوع القانونية: صغ الدفوع بشكل منطقي وقوي (شكلاً وموضوعاً).
                4. القواعد الكلية: استخدم القواعد القانونية مثل (البينة على من ادعى)، (الأصل بقاء ما كان على ما كان)، (الضرر يزال).
                5. الهيكلية الاحترافية: (الديباجة، الوقائع، الأسانيد، التسبيب القانوني، الطلبات الختامية).
                اجعل اللغة القانونية رصينة جداً، وتجنب الحشو، وركز على نقاط القوة في موقف الموكل.`,
                messages: [{ role: 'user', content: `بصفتك خبير قانوني، حلل وصغ مذكرة دعوى/دفاع متكاملة لهذه الوقائع: ${prompt}` }],
            }),
        });

        const data = await response.json();
        res.status(200).json({ result: data.content[0].text });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب القانوني' });
    }
}
