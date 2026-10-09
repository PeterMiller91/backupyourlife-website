(function () {
    const banner  = document.getElementById('cookie-banner');
    const accept  = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');
    const KEY     = 'byl_cookie_consent';

    if (localStorage.getItem(KEY)) return;

    // Kurze Verzögerung – erst zeigen wenn Seite geladen
    setTimeout(() => { banner.hidden = false; }, 800);

    accept.addEventListener('click', () => {
        localStorage.setItem(KEY, 'accepted');
        banner.hidden = true;
    });

    decline.addEventListener('click', () => {
        localStorage.setItem(KEY, 'declined');
        banner.hidden = true;
    });
}());
