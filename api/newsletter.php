<?php
/**
 * Newsletter-Anmeldung "Backup-Briefing" über Brevo mit Double-Opt-in.
 *
 * Der Browser schickt nur die E-Mail-Adresse. Der Brevo-API-Schlüssel bleibt auf dem Server
 * (api/config.php, nicht im Repository). Brevo schickt die Bestätigungs-Mail; erst nach dem
 * Klick auf den Link landet die Adresse in der Liste "BYL Newsletter".
 *
 * Benötigte Einträge in api/config.php:
 *   'brevo_api_key'           => 'xkeysib-…',
 *   'brevo_newsletter_list_id'=> 22,          // ID der Liste "BYL Newsletter"
 *   'brevo_doi_template_id'   => 32,          // ID der Double-Opt-in-Vorlage (Tag "optin")
 *   'brevo_doi_redirect_url'  => 'https://backupyourlife.de/notfallordner.html?newsletter=bestaetigt',
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$cfg = require __DIR__ . '/config.php';

$apiKey     = $cfg['brevo_api_key']            ?? '';
$listId     = (int) ($cfg['brevo_newsletter_list_id'] ?? 0);
$templateId = (int) ($cfg['brevo_doi_template_id']    ?? 0);
$redirect   = $cfg['brevo_doi_redirect_url']   ?? 'https://backupyourlife.de/notfallordner.html?newsletter=bestaetigt';

if (!$apiKey || !$listId || !$templateId) {
    http_response_code(503);
    echo json_encode(['error' => 'not_configured']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'bad_request']);
    exit;
}

// Spam-Schutz: verstecktes Feld muss leer bleiben, Formular nicht schneller als 2 Sekunden abgeschickt
$honeypot = trim((string) ($body['website'] ?? ''));
$elapsed  = (int) ($body['elapsed'] ?? 0);
if ($honeypot !== '' || $elapsed < 2000) {
    // Für Bots so tun, als hätte es geklappt
    echo json_encode(['success' => true]);
    exit;
}

$email   = trim((string) ($body['email'] ?? ''));
$consent = ($body['consent'] ?? false) === true;

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    http_response_code(422);
    echo json_encode(['error' => 'invalid_email']);
    exit;
}
if (!$consent) {
    http_response_code(422);
    echo json_encode(['error' => 'no_consent']);
    exit;
}

$payload = [
    'email'          => $email,
    'includeListIds' => [$listId],
    'templateId'     => $templateId,
    'redirectionUrl' => $redirect,
];

$ch = curl_init('https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: application/json',
        'api-key: ' . $apiKey,
    ],
    CURLOPT_TIMEOUT        => 10,
]);
$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status >= 200 && $status < 300) {
    echo json_encode(['success' => true]);
    exit;
}

// Bereits vorhandene Kontakte nicht als Fehler zeigen
$data = json_decode($result ?: '{}', true) ?: [];
if ($status === 400 && stripos((string) ($data['message'] ?? ''), 'already') !== false) {
    echo json_encode(['success' => true, 'already' => true]);
    exit;
}

http_response_code(502);
echo json_encode(['error' => 'brevo_error']);
