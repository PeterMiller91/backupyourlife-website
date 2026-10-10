<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$cfg = require __DIR__ . '/config.php';

$token  = $cfg['telegram_bot_token'];
$chatId = $cfg['telegram_chat_id'];

if (!$token || !$chatId) {
    http_response_code(500);
    echo json_encode(['error' => 'Telegram-Zugangsdaten fehlen in api/config.php']);
    exit;
}

// ── Request Body lesen ────────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültiger Request-Body']);
    exit;
}

$name    = htmlspecialchars($body['name']  ?? '', ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($body['email'] ?? '', ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($body['phone'] ?? '', ENT_QUOTES, 'UTF-8');
$answers = $body['answers'] ?? [];
$luecke  = $body['luecke']  ?? 0;
$gaps    = $body['gaps']    ?? 0;

// ── Mappings ─────────────────────────────────────────────────────────────────
$kinderMap    = ['1' => '1 Kind', '2' => '2 Kinder', '3p' => '3+ Kinder'];
$einkommenMap = ['u3k' => 'bis 3.000 €', '3-5k' => '3.000–5.000 €', '5-8k' => '5.000–8.000 €', 'ue8k' => 'über 8.000 €'];
$buMap        = ['eigene' => '✅ eigene BU', 'ag' => '⚠️ nur über AG', 'nein' => '❌ keine BU', 'weiss' => '❓ unbekannt'];
$rlMap        = ['ja' => '✅ vorhanden', 'nein' => '❌ keine', 'weiss' => '❓ unbekannt'];

$gapEmoji       = $gaps === 0 ? '🟢' : ($gaps === 1 ? '🟡' : ($gaps === 2 ? '🟠' : '🔴'));
$lueckeNum      = (float) $luecke;
$lueckeFormatted = number_format($lueckeNum, 0, ',', '.');

$kinder   = $kinderMap[$answers['kinder']    ?? ''] ?? '–';
$einkommen = $einkommenMap[$answers['einkommen'] ?? ''] ?? '–';
$bu       = $buMap[$answers['bu']             ?? ''] ?? '–';
$rl       = $rlMap[$answers['rl']             ?? ''] ?? '–';
$gapsText = $gaps !== 1 ? 'Lücken' : 'Lücke';

// ── Telegram ──────────────────────────────────────────────────────────────────
$text = "🔔 <b>Neuer Lead – backupyourlife</b>\n\n"
      . "👤 <b>{$name}</b>\n"
      . "📧 {$email}\n"
      . "📱 " . ($phone ?: '–') . "\n\n"
      . "📋 <b>Angaben:</b>\n"
      . "• Kinder: {$kinder}\n"
      . "• Einkommen: {$einkommen}\n\n"
      . "🛡 <b>Backup-Status:</b>\n"
      . "• BU: {$bu}\n"
      . "• Risikoleben: {$rl}\n\n"
      . "💸 <b>Monatliche Lücke: −{$lueckeFormatted} €</b>\n"
      . "{$gapEmoji} <b>{$gaps} offene {$gapsText}</b>\n\n"
      . "👉 Jetzt anrufen!";

$tgResponse = curlPost(
    "https://api.telegram.org/bot{$token}/sendMessage",
    ['chat_id' => $chatId, 'text' => $text, 'parse_mode' => 'HTML']
);

if (!($tgResponse['ok'] ?? false)) {
    http_response_code(500);
    echo json_encode(['error' => $tgResponse['description'] ?? 'Telegram-Fehler']);
    exit;
}

// ── Monday CRM (optional) ─────────────────────────────────────────────────────
$mondayToken   = $cfg['monday_api_token'];
$mondayBoardId = $cfg['monday_board_id'];

if ($mondayToken && $mondayBoardId) {
    $notes = implode("\n", [
        "Kinder: {$kinder}",
        "Einkommen: {$einkommen}",
        "BU: {$bu}",
        "Risikoleben: {$rl}",
        "Monatliche Lücke: −{$lueckeFormatted} €",
        "Offene Lücken: {$gaps}",
    ]);

    $columnValues = json_encode([
        'email'  => ['email' => $email, 'text' => $email],
        'phone'  => ['phone' => $phone ?: '', 'countryShortName' => 'DE'],
        'status' => ['label' => 'Neuer Lead'],
        'text'   => $notes,
    ]);

    $query = 'mutation ($boardId: ID!, $itemName: String!, $cols: JSON!) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $cols) { id }
    }';

    curlPost(
        'https://api.monday.com/v2',
        ['query' => $query, 'variables' => ['boardId' => $mondayBoardId, 'itemName' => $name, 'cols' => $columnValues]],
        ['Authorization: ' . $mondayToken, 'API-Version: 2024-01']
    );
    // Fehler hier sind nicht fatal – Lead wurde bereits per Telegram gesendet
}

echo json_encode(['success' => true]);

// ── Helper ────────────────────────────────────────────────────────────────────
function curlPost(string $url, array $data, array $extraHeaders = []): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($data),
        CURLOPT_HTTPHEADER     => array_merge(['Content-Type: application/json'], $extraHeaders),
        CURLOPT_TIMEOUT        => 10,
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result ?: '{}', true) ?? [];
}
