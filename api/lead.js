export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, answers, luecke, gaps } = req.body;

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Missing env vars: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in Vercel' });
    }

    const kinderMap    = { '1': '1 Kind', '2': '2 Kinder', '3p': '3+ Kinder' };
    const einkommenMap = { u3k: 'bis 3.000 €', '3-5k': '3.000–5.000 €', '5-8k': '5.000–8.000 €', ue8k: 'über 8.000 €' };
    const buMap        = { eigene: '✅ eigene BU', ag: '⚠️ nur über AG', nein: '❌ keine BU', weiss: '❓ unbekannt' };
    const rlMap        = { ja: '✅ vorhanden', nein: '❌ keine', weiss: '❓ unbekannt' };

    const gapEmoji        = gaps === 0 ? '🟢' : gaps === 1 ? '🟡' : gaps === 2 ? '🟠' : '🔴';
    const lueckeNum       = Number(luecke) || 0;
    const lueckeFormatted = lueckeNum.toLocaleString('de-DE');

    // ── Telegram ──────────────────────────────────────────────────────────────
    const text = `🔔 <b>Neuer Lead – backupyourlife</b>

👤 <b>${name}</b>
📧 ${email}
📱 ${phone || '–'}

📋 <b>Angaben:</b>
• Kinder: ${kinderMap[answers?.kinder] || '–'}
• Einkommen: ${einkommenMap[answers?.einkommen] || '–'}

🛡 <b>Backup-Status:</b>
• BU: ${buMap[answers?.bu] || '–'}
• Risikoleben: ${rlMap[answers?.rl] || '–'}

💸 <b>Monatliche Lücke: −${lueckeFormatted} €</b>
${gapEmoji} <b>${gaps} offene Lücke${gaps !== 1 ? 'n' : ''}</b>

👉 Jetzt anrufen!`;

    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        });
        const data = await tgRes.json();
        if (!data.ok) throw new Error(data.description);
    } catch (err) {
        console.error('Telegram error:', err.message);
        return res.status(500).json({ error: err.message });
    }

    // ── Monday CRM (optional – nur wenn Env Vars gesetzt) ─────────────────────
    const mondayToken   = process.env.MONDAY_API_TOKEN;
    const mondayBoardId = process.env.MONDAY_BOARD_ID;

    if (mondayToken && mondayBoardId) {
        const notes = [
            `Kinder: ${kinderMap[answers?.kinder] || '–'}`,
            `Einkommen: ${einkommenMap[answers?.einkommen] || '–'}`,
            `BU: ${buMap[answers?.bu] || '–'}`,
            `Risikoleben: ${rlMap[answers?.rl] || '–'}`,
            `Monatliche Lücke: −${lueckeFormatted} €`,
            `Offene Lücken: ${gaps}`,
        ].join('\n');

        // Column-IDs passen zum Monday-CRM-Standard-Template.
        // Falls abweichend: Board → Spalteneinstellungen → ID anpassen.
        const columnValues = JSON.stringify({
            email:  { email, text: email },
            phone:  { phone: phone || '', countryShortName: 'DE' },
            status: { label: 'Neuer Lead' },
            text:   notes,
        });

        try {
            const mondayRes = await fetch('https://api.monday.com/v2', {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': mondayToken,
                    'API-Version':   '2024-01',
                },
                body: JSON.stringify({
                    query: `mutation ($boardId: ID!, $itemName: String!, $cols: JSON!) {
                        create_item(board_id: $boardId, item_name: $itemName, column_values: $cols) { id }
                    }`,
                    variables: { boardId: mondayBoardId, itemName: name, cols: columnValues },
                }),
            });
            const mondayData = await mondayRes.json();
            if (mondayData.errors) console.error('Monday errors:', JSON.stringify(mondayData.errors));
        } catch (err) {
            console.error('Monday error:', err.message);
            // nicht fatal – Lead wurde bereits per Telegram gesendet
        }
    }

    return res.status(200).json({ success: true });
}
