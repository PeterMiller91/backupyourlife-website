<?php
/**
 * Vorlage für api/config.php (die echte Datei liegt nur auf dem Server und ist nicht im Repository).
 * Kopieren: cp api/config.example.php api/config.php – dann die Werte eintragen.
 * Niemals echte Schlüssel in dieses Beispiel oder ins Repository schreiben.
 */
return [
    // Lead-Benachrichtigung (api/lead.php)
    'telegram_bot_token' => '',
    'telegram_chat_id'   => '',
    'monday_api_token'   => '',
    'monday_board_id'    => '',

    // Newsletter "Backup-Briefing" (api/newsletter.php)
    'brevo_api_key'            => '',   // Brevo → SMTP & API → API-Schlüssel
    'brevo_newsletter_list_id' => 0,    // ID der Liste "BYL Newsletter"
    'brevo_doi_template_id'    => 0,    // ID der Double-Opt-in-Vorlage (Tag "optin")
    'brevo_doi_redirect_url'   => 'https://backupyourlife.de/notfallordner.html?newsletter=bestaetigt',
];
