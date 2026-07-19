// ==UserScript==
// @name        DisneyPlus Privacy Script
// @namespace   Violentmonkey Scripts
// @match       https://www.disneyplus.com/*
// @icon        https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/C4B6DBE53E267BDFA8722D622A80835A3B8286C49EC5A9EA63B22BE3D73F2B35/compose?format=webp&width=150
// @grant       none
// @version     1.0
// @author      -
// @description This is a script to make it so when sharing your screen, people can not see names, icons, emails, or anything else that could dox you or someone else. Meant For: Netflix & Disney+
// @run-at       document-start
// ==/UserScript==


'use strict';


(function() {



function startRemoving() {

    //SKIP ADs WHEN STARTING MEDIA
    try {
      let skipbutton = document.querySelector("#hudson-wrapper > div > div > div > div > div.btm-media-player.playback-experience-v2.btm-media-player-idle.has-interstitials > div > disney-web-player-ui > promo-overlay").shadowRoot.querySelector("div > skip-button").shadowRoot.querySelector("div > button")
      if (skipbutton) {
        console.log("skip button found");
        skipbutton.click();
        console.log("clicked skipbutton");
      }
    } catch(e) {}
}


    function startObservers() {
        try {
        const observer = new MutationObserver(() => {
           startRemoving();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        } catch(e) {
            console.log("observers failed: ", e, " retrying...");
            startObservers();
        } //restart observers
        }


    function waitForBody() {
        if (document.body) {
            console.log("script started");
            //checks to make sure extension did not get restarted, as this creates a duplicate button
                startObservers();
        }
        else {
            setTimeout(waitForBody, 50);
        }
    }
    waitForBody();
})();