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
    let url = document.URL


    //SIGN-IN SCREEN
    if (url === "https://www.disneyplus.com/" ) {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) {
        main.hidden = true;
      }
      if (footer) {
        footer.hidden = true;
      }

    }

    //WHO'S WATCHING SCREEN
    else if (url === "https://www.disneyplus.com/select-profile") {
      document.querySelectorAll('.profile-avatar').forEach(profile => {
        let name = profile.parentElement.children[1];
        name.hidden = true;
      });
    }


    //ASSUME THEY JUST LOGGED IN
    else { //should remove the "Welcome, Name" notification
      let notification = document.querySelector('.sc-ebFjAB');
      if (notification) {
          try {
              notification.parentElement.hidden = true;
          }
          catch (e) {} //Could be gone at this point and throwing errors
      }
    }



    let profile = document.querySelector("#account-dropdown");

    if (profile) {
        profile.style.display = 'none';
    }



    const main = document.querySelector("#explore-ui-main-content-container")
    if (main) {
        main.querySelectorAll('._1kvuhyp1').forEach(query => {
            //console.log(query);
            //console.log(query.textContent);
            let text = query.textContent;
            let remove = false;
            if (text == "Continue Watching") {
              remove = true;
            }
            else if (text == "Recommended For You") {
              remove = true;
            }
            else if (text == "You May Also Like") {
              remove = true;
            }
            else if (text.includes("Because You Watched")) {
              remove = true;
            }
            else if (text.includes("Top")) { //Top 10 Series In The [Country You Live In] Today
              remove = true;
            }
            else if (text == "Watch Again") {
              remove = true;
            }
            else if (text == "Series For You") {
              remove = true;
            }
            else if (text.includes("Enjoy")) {
              remove = true;
            }
            else if (text.includes("Upgrade")) {
              remove = true;
            }


            if (remove) { query.parentElement.parentElement.hidden = true; }
        });
        const livestreams = document.querySelector('._1yo7dqz2')
        if(livestreams) {
          livestreams.parentElement.parentElement.hidden = true
        }
    }

    const footer = document.querySelector('#webAppFooter');
    if (footer) {
        footer.hidden = true;
    }

    try {
      let skipbutton = document.querySelector("#hudson-wrapper > div > div > div > div > div.btm-media-player.playback-experience-v2.btm-media-player-idle.has-interstitials > div > disney-web-player-ui > promo-overlay").shadowRoot.querySelector("div > skip-button").shadowRoot.querySelector("div > button")
      if (skipbutton) {
        console.log("skip button found");
        skipbutton.click();
        console.log("clicked skipbutton");
      }
    } catch(e) {}

    //_1kvuhyp1 _1kvuhyp0 r3t2ih20 r3t2ih4d


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