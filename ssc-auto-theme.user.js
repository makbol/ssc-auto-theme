// ==UserScript==
// @name         SSC auto theme
// @namespace    ssc
// @version      1.0.0
// @description  Automatically switches between dark and light theme
// @author       https://github.com/makbol
// @match        https://www.skyscrapercity.com/*
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.min.js
// ==/UserScript==

(function() {
    'use strict';

    const MODE_DARK = 'dark';
    const MODE_LIGHT = 'light';
    const position = {
        // Middle of Poland
        lat: 52.0692968,
        lng: 19.4797635
    }
    const styleMapping = {
        'Teal': MODE_LIGHT,
        'DarkMode': MODE_DARK
    };

    const currentMode = styleMapping[unsafeWindow.adConfig.currentStyle];

    const now = new Date();
    const tomorrow = new Date(dateFns.addMinutes(dateFns.startOfTomorrow(), 5));
    const timesToday = SunCalc.getTimes(now, position.lat, position.lng);
    const timesTomorrow = SunCalc.getTimes(tomorrow, position.lat, position.lng);

    if(dateFns.isAfter(now, timesToday.sunset) && dateFns.isBefore(now, timesTomorrow.sunrise)) {
        // Night
        if(currentMode !== MODE_DARK) {
            setMode(MODE_DARK);
        }
    }

    if(dateFns.isAfter(now, timesToday.sunrise) && dateFns.isBefore(now, timesToday.sunset)) {
       // Day
       if(currentMode !== MODE_LIGHT) {
           setMode(MODE_LIGHT);
       }
    }

    function setMode(mode) {
        const styleToId = {
            [MODE_LIGHT]: 9,
            [MODE_DARK]:  2
        }
        const hash = unsafeWindow.XF.config.csrf;
        const url = `https://www.skyscrapercity.com/misc/style?style_id=${styleToId[mode]}&t=${hash}`;

        document.location = url;
    }
})();
