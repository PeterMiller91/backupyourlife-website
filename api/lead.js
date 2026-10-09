export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, answers, luecke, gaps } = req.body;

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Missing env vars' });
    }

    const alterMap    = { u35: 'unter 35', '35-44': '35–44', '45-54': '45–54', ue55: '55+' };
    const kinderMap   = { '1': '1 Kind', '2': '2 Kinder', '3p': '3+ Kinder' };
    const einkommenMap = { u3k: 'bis 3.000 €', '3-5k': '3.000–5.000 €', '5-8k': '5.000–8.000 €', ue8k: 'über 8.000 €' };
    const kreditMap   = { nein: 'kein Kredit', u200: 'bis 200.000 €', '200-400': '200–400.000 €', ue400: 'über 400.000 €' };
    const buMap       = { eigene: '✅ eigene BU', ag: '⚠️ nur über AG', nein: '❌ keine BU', weiss: '❓ unbekannt' };
    const rlMap       = { ja: '✅ vorhanden', nein: '❌ keine', weiss: '❓ unbekannt' };
    const skMap       = { ja: '✅ vorhanden', nein: '❌ keine', weiss: '❓ unbekannt' };

    const gapEmoji = gaps === 0 ? '🟢' : gaps === 1 ? '🟡' : gaps === 2 ? '🟠' : '🔴';
    const lueckeFormatted = (luecke ?? 0).toLocaleString('de-DE');

    const text = [
        `🔔 *Neuer Lead – backupyourlife*`,
        ``,
        `👤 *${name}*`,
        `📧 ${email}`,
        ``,
        `📋 *Angaben:*`,
        `• Alter: ${alterMap[answers?.alter] || '–'}`,
        `• Kinder: ${kinderMap[answers?.kinder] || '–'}`,
        `• Einkommen: ${einkommenMap[answers?.einkommen] || '–'}`,
        `• Kredit: ${kreditMap[answers?.kredit] || '–'}`,
        ``,
        `🛡️ *Backup-Status:*`,
        `• BU: ${buMap[answers?.bu] || '–'}`,
        `• Risikoleben: ${rlMap[answers?.rl] || '–'}`,
        `• Schwere Krankheiten: ${skMap[answers?.sk] || '–'}`,
        ``,
        `💸 *Monatliche Lücke: −${lueckeFormatted} €*`,
        `${gapEmoji} *${gaps} offene Lücke${gaps !== 1 ? 'n' : ''}*`,
        ``,
        `👉 Jetzt anrufen\\!`,
    ].join('\n');

    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2' }),
        });

        const data = await tgRes.json();
        if (!data.ok) throw new Error(data.description);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Telegram error:', err.message);
        return res.status(500).json({ error: 'Notification failed' });
    }
}
