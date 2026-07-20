// ==UserScript==
// @name         FiveM Docs Dark Mode
// @description  Dark theme for the FiveM docs website
// @namespace    http://tampermonkey.net/
// @version      1.02
// @match        https://docs.fivem.net/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    GM_addStyle(`
        * {
            background-color: #18181b !important;
            color: whitesmoke
            .docContent pre !important;
        }
        a, a * {
            color: #4EA1FF !important; /*improves visibility of links*/
        }
        .docContent pre {
            background-color: #1f1c24 !important;
            color: whitesmoke

        }
        body, nav {
            --fg: white !important;
        }
        body, sec {
            color: white
        }
    `);
})();
