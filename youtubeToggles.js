// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.0.9
// @description  Allows disabling a variety of YouTube features
// @author       -
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
//
// @updateURL   https://raw.githubusercontent.com/QuinAustin/Userscripts/main/youtubeToggles.js
// @downloadURL https://raw.githubusercontent.com/QuinAustin/Userscripts/main/youtubeToggles.js
//
// ==/UserScript==



/*
Changelog 1.0.9
    User Interface Toggles:
        *HomePage
            -Primary Header with tags are now able to be hidden from the UI 
            -Left Side Guide is now able to hidden as well (this is the place where Home, Shorts, Subscriptions, You, is also shown)

        *WatchPage 
            -Recommendations can be hidden
            -Everything below the video player can be hidden 

        *Toggle AI Update 
            -AI summaries in the subscriptions is once again hidden 
            -The newly added "Ask" buttons (in the player while in fullscreen, in the player buttons next to the save button, and in the description under the ai summary)

        *Code changes 
            -added url ids to filter more easily based on the different YouTube urls (Homepage, Watchpage, Channelpage, etc.)
            -corrected some more of the 'debug' messages to be filtered out unless toggled
            - 
*/


(function() {
    'use strict';
    let clonePossible = false;


    let prevURL = document.URL

    //########################
    //  Descriptions
    //########################
    /*
    enableLogging    | console logs metadata from every video that shows up in the DOM
    showBreakingNews | a "scrollable" shelf (row) of videos, usually multiple news channels covering important (local, national, international)  news and events
    showShorts       | as name implies
    showGames        | as name implies
    showWatched      | videos that show the red line on the timeline as being 100% full
    showPurchased    | videos (movies/shows/events) that show the "purchased" badge
    showAI           | the "AI" prompt that tells you to type what kind of videos to show you
    showMusic        | anything that shows "mix" or has the music note next to the duration
    showPlaylists    | playlists and podcasts that show on the homepage (sometimes called lessons when it comes from an educational channel)
    showBanner       | big banner at the top of the homepage, usually some YouTube Ad/Event
    */




    let debugMode               = localStorage.getItem('ytt-debug-mode')       === 'false' ? false : true;

    let enableLogging           = localStorage.getItem('ytt-logging')          === 'false' ? false : true;

    let showBreakingNews        = localStorage.getItem('ytt-breaking-news')    === 'false' ? false : true;
    let showShorts              = localStorage.getItem('ytt-show-shorts')      === 'false' ? false : true;
    let showGames               = localStorage.getItem('ytt-show-games')       === 'false' ? false : true;

    let showExploreMoreTopics   = localStorage.getItem('ytt-show-explore-more-topics') === 'false' ? false : true;

    let showAI                  = localStorage.getItem('ytt-show-ai')          === 'false' ? false : true;
    let showWatched             = localStorage.getItem('ytt-show-watched')     === 'false' ? false : true;
    let showPurchased           = localStorage.getItem('ytt-show-purchased')   === 'false' ? false : true;
    let showNewToYou            = localStorage.getItem('ytt=show-new-to-you')  === 'false' ? false : true;

    let showMusic               = localStorage.getItem('ytt-show-music')       === 'false' ? false : true;
    let showPlaylists           = localStorage.getItem('ytt-show-playlists')   === 'false' ? false : true;
    let showBanner              = localStorage.getItem('ytt-show-banner')      === 'false' ? false : true;

    let showFreeMovies          = localStorage.getItem('ytt-show-free-movies') === 'false' ? false : true;
    //not working yet
    let showMemberOnly          = localStorage.getItem('ytt-show-member-only') === 'false' ? false : true;
    let showPosts               = localStorage.getItem('ytt-show-posts')       === 'false' ? false : true;



//    let showChannelStore    = localStorage.getItem('ytt-show-channel-store') === 'false' ? false : true;
//    let showMemberJoin      = localStorage.getItem('ytt-show-member-join') === 'false' ? false : true;
//    let showThanksDonation  = localStorage.getItem('ytt-show-thanks-donation') === 'false' ? false : true;

    let enableStreamerMode    = localStorage.getItem('ytt-enable-streamer-mode') === 'false' ? false : true;

    let enableBetterZoom      = localStorage.getItem('ytt-enable-better-zoom')   === 'false' ? false : true;

    //let new                 = localStorage.getItem('ytt-new')                  === 'false' ? false : true;

    let showPrimaryHeader     = localStorage.getItem('ytt-show-primary-header')  === 'false' ? false : true;
    let showGuide             = localStorage.getItem('ytt-show-guide')           === 'false' ? false : true;



    let showRecommedations    = localStorage.getItem('ytt-show-recommendations')  === 'false' ? false : true;
    let showBelow             = localStorage.getItem('ytt-show-below')            === 'false' ? false : true;


//This is for example purposes
    let showToggle            = localStorage.getItem('ytt-show-toggle')          === 'false' ? false : true;












    /*
    HELPER FUNCTIONS
    */

    function toggleQuerySelector(selector, enabled) {
        try {
            const element = document.querySelector(selector);
            element.style.display = enabled;
        } catch(e) {}
    }
    function toggleQuerySelectorAll(selector, enabled) {
        try {
            document.querySelectorAll(selector).forEach(query => {
                query.style.display = enabled;
            });

        } catch(e) {}
    }


    function toggleGetElementById(id, enabled) {
        try {
            const element = document.getElementById(id);
            element.style.display = enabled;
        } catch(e) {}
    }

    function setElementProperty(ele, property, propertyValue, propertyType) {
        ele.style.setProperty(property, ( propertyValue + propertyType ));
    }

    function getURL_id() {
        let url = document.URL;
        if (url === "https://www.youtube.com/") { //Homepage
            return 0;
        }
        if (url.startsWith("https://www.youtube.com/watch?v=")) { //Video Link
            return 1;
        }
        if (url === "https://www.youtube.com/?bp=wgUCEAE%3D") { //Video Link that has redirected to Homepage
            return 2;
        }
        if (url.startsWith("https://www.youtube.com/@")) {  //A Channel Page
          return 3;
        }
        if (url.startsWith("https://www.youtube.com/channel/")) { //A Collab Video Link that has redirected to a Channel Page
          return 4;
        }

        return false;
    }




    function getContents() { //To solve issues pertaining to redirects
        try {
            let url_id = getURL_id();
            if (url_id === 0 || url_id === 2) {
                return document.querySelector('ytd-rich-item-renderer').parentElement; //homepage
            }
            else if (url_id === 1) {
                return document.querySelector('yt-lockup-view-model').parentElement; //video
            }
            else if (url_id === 3) {
                return document.querySelector('')
            }

        } catch(e) {
            if (debugMode) { console.log("exception: (getContents) Failed To Get Page Contents"); }
            setTimeout(getContents, 50)
        }
    }



    function getZoomOut() {
        return ((100 - Math.round(window.devicePixelRatio * 100 ) ) / 10); //i.e. 100% returns 0, 90% returns 1, ..., 30% returns 7
    }













//This is for example purposes
    function startToggleChecks() {
      if (showToggle) {
        console.log("Starting Toggle Check");
        return;
      }
      console.log("Ending Toggle Check");
    }





function toggleUIChecks() {
    let url_id = getURL_id();

    if (url_id === 0 || url_id === 2) { //Check that the user is on the Homepage
        const banner = document.querySelector('ytd-statement-banner-renderer');
        const primaryHeader = document.querySelector('ytd-feed-filter-chip-bar-renderer');
        const guide = document.querySelector('#guide');

        if (banner) {
            banner.parentElement.style.display = showBanner ? '' : 'none';
        }
        if (primaryHeader) {
                primaryHeader.parentElement.style.display = showPrimaryHeader ? '' : 'none';
                document.querySelector('#frosted-glass').style.height = showPrimaryHeader ? '112px' : '80px';
        }
        if (guide) {
              guide.style.display = showGuide ? '' : 'none';
              setElementProperty(document.querySelector('#content'), '--ytd-persistent-guide-width', showGuide ? '240' : '0', 'px');
        }
    }

    else if(getURL_id() === 1) { //Check that the user is on a Watchpage
        const below = document.querySelector('#below');
        const recommendations = document.querySelectorAll('#secondary');

        const askButton = document.querySelector('#flexible-item-buttons'); //Next to Save button
        const aiSummary = document.querySelector('#video-summary'); //Description
        const askButton2 = document.querySelector('yt-video-description-youchat-section-view-model');   //Description
        const askButton3 = document.querySelector('.you-chat-entrypoint-button'); //Fullscreen Video Player Overlay
        if (below) {
            below.style.display = showBelow ? '' : 'none';
        }


        if (askButton) {
          try {
              askButton.children[0].hidden = showAI ? false : true;
          } catch (e) {}
        }
        if (aiSummary) {
          aiSummary.style.display = showAI ? '' : 'none';
        }
        if (askButton2) {
          askButton2.style.display = showAI ? '' : 'none';
        }
        if (askButton3) {
          askButton3.style.display = showAI ? '' : 'none';
        }



        if (recommendations) {
          try {
            recommendations[0].style.display = showRecommedations ? '' : 'none';
            recommendations[1].style.display = showRecommedations ? '' : 'none';
          } catch(e) {
            if (debugMode) {
              console.log("exception: ", e)
            }
          }
        }

    }
}






    function toggleBelow() {
        const below = document.querySelector('#below');
        if (below) {
          below.style.display = showBelow ? '' : 'none';
        }
    }

    function toggleAI() {
        const askButton = document.querySelector('#flexible-item-buttons'); //Next to Save button
        const aiSummary = document.querySelector('#video-summary'); //Description
        const askButton2 = document.querySelector('yt-video-description-youchat-section-view-model');   //Description
        const askButton3 = document.querySelector('.you-chat-entrypoint-button'); //Fullscreen Video Player Overlay

        if (askButton) {
          try {
              askButton.children[0].hidden = showAI ? false : true;
          } catch (e) {}
        }
        if (aiSummary) {
          aiSummary.style.display = showAI ? '' : 'none';
        }
        if (askButton2) {
          askButton2.style.display = showAI ? '' : 'none';
        }
        if (askButton3) {
          askButton3.style.display = showAI ? '' : 'none';
        }
    }

    function toggleRecommendations() {
        const recommendations = document.querySelector('#secondary');
        if (recommendations) {
            recommendations.style.display = showRecommedations ? '' : 'none';
        }
    }





    function toggleBanner() {
        const banner = document.querySelector('ytd-statement-banner-renderer');
        if (banner) {
            banner.parentElement.style.display = showBanner ? '' : 'none';
        }
    }


    function togglePrimaryHeader() {
        const primaryHeader = document.querySelector('ytd-feed-filter-chip-bar-renderer');
        if (primaryHeader) {
            primaryHeader.parentElement.style.display = showPrimaryHeader ? '' : 'none';
            document.querySelector('#frosted-glass').style.height = showPrimaryHeader ? '112px' : '80px';
        }
    }

    function toggleGuide() {
        const guide = document.querySelector('#guide');
        if (guide) {
          guide.style.display = showGuide ? '' : 'none';
          setElementProperty(document.querySelector('#content'), '--ytd-persistent-guide-width', showGuide ? '240' : '0', 'px');
        }
    }






    function startShelfChecks() {
        try {
            //const container = document.querySelector('ytd-rich-item-renderer').parentElement
            const container = getContents();
            if (debugMode) {
                console.log("(shelf) container: ", container);
            }

            //document.querySelector('ytd-rich-item-renderer').parentElement.querySelectorAll('ytd-rich-section-renderer #title')
            if (container) {
                container.querySelectorAll('ytd-rich-section-renderer').forEach(query => {
                    const title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                    const title2 = query.querySelector('.yt-shelf-header-layout__title')?.textContent.trim().toLowerCase();

                    const title3 = query.querySelector('yt-shelf-header-layout')?.textContent.toLowerCase();


                    switch (title || title2 || title3) {
                        case 'shorts':
                            query.style.display = showShorts ? '' : 'none';
                        break;
                        case 'youtube playables':
                            query.style.display = showGames ? '' : 'none';
                        break;
                        case 'breaking news':
                            query.style.display = showBreakingNews ? '' : 'none';
                        break;
                        case 'latest youtube posts':
                            query.style.display = showPosts ? '' : 'none';
                        break;
                        case 'explore more topics':
                            query.style.display = showExploreMoreTopics ? ''  : 'none';
                        break;
                        default:
                            if(debugMode) {
                                console.log("title not recognized: title - ",title, " title2 - ", title2);
                            }
                        break;
                    }

                    if(debugMode) {
                        console.log("titles found: title - ",title, " title2 - ", title2, " title3 - ", title3);
                    }


                });
            }
        } //try
        catch (e) {
            console.log("(startShelfChecks) exception: Failed To Make Changes To Sections | ", e);
        }
    }



    function startItemChecks() {
        const container = getContents();
        if (container) {
            container.querySelectorAll('ytd-rich-item-renderer').forEach(query => {

                //Playlist, Podcast, Etc. Item
                const playlistBadge = query.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
                if (playlistBadge) {
                    if ( playlistBadge.includes('episodes') || playlistBadge.includes('lessons') || playlistBadge.includes('videos') ) {
                        query.style.display = showPlaylists ? '' : 'none';
                    }
                }

                //AI Recommendation Chat Prompt   (not tested)
                if (query.querySelector('ytd-talk-to-recs-flow-renderer')) {
                    query.style.display = showAI ? '' : 'none';
                }

                //video recommendation prompt that takes over a video spot to say "new to you"
                const title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                if (title === 'looking for something different?') {
                    query.style.display = showNewToYou ? '' : 'none';
                }


            });
        }
        else if (debugMode) {
            console.log("(startItemChecks) exception: Failed To Make Changes To Videos | ");
        }
    }


/* ZOOM SCALE
                            switch(trueDifference) {
                                case(0): //100
                                    break;
                                case(1): //90
                                    break;
                                case(2): //80
                                    break;
                                case(3): //70
                                    break;
                                case(4): //60
                                    break;
                                case(5): //50
                                    break;
                                case(6): //40
                                    break;
                                case(7): //30
                                    break;
                            }
*/
    function BetterZoomWatchPageChanges() {
        try {
            let zoom = Math.round(window.devicePixelRatio * 100);
            let trueDifference = ((100 - zoom)/10);
            let difference = ((100 - zoom)/10)*3;


                if (difference >= 0) {
                    let changeValue = 0;


                    try {
                    /*
                    MAIN DOCUMENT CHANGES
                    */
                        //main document font size

                        document.documentElement.style.fontSize = (10 + difference) + "px";             //document.documentElement.style.fontSize = (10) + "px";

                        //removes empty side borders
                        const columns = document.querySelector('#columns');
                        const secondary = columns.querySelector('#secondary');

                        //Resize the divide between primary and secondary columns
                        setElementProperty(columns, '--ytd-watch-flexy-sidebar-width', 100, "%");                   //setElementProperty(columns, '--ytd-watch-flexy-sidebar-width', 402, "px");
                        setElementProperty(secondary, '--ytd-watch-flexy-sidebar-width', 30, "%");                  //setElementProperty(secondary, '--ytd-watch-flexy-sidebar-width', 402, "px");
                        setElementProperty(secondary, '--ytd-watch-flexy-horizontal-page-margin', 32, "px");        //setElementProperty(secondary, '--ytd-watch-flexy-horizontal-page-margin', 16, "px");
                    } catch(e) {
                        console.log("(startVideoChecks) exception: Failed To Make Changes To Document");
                    }

                    try {
                        /*
                        RIBBON CHANGES
                        */

                        //toolbar size
                        document.getElementById('masthead').style.setProperty('height', (200) + '%');           //document.getElementById('masthead').style.setProperty('height', (100) + '%');


                        //toolbar logo size

                            let mainSvgs = document.querySelectorAll('svg'); //'svg' //'ytd-button-renderer'
                            changeValue = (100+difference*10);
                            for (let i = 6; i <= 12; i++) {
                                setElementProperty(mainSvgs[i], 'height', changeValue, "%");
                                setElementProperty(mainSvgs[i], 'width',  changeValue, "%");
                            }




                        //fixing logos background bubble


                        const container = document.getElementById('voice-search-button').parentNode.parentElement;
                            const containerCN = container.childNodes;
                                const start  = containerCN[1];
                                const center = containerCN[3];
                                const end    = containerCN[5];



                        //Container
                            const background  = document.getElementById('background');
                            changeValue = (2 + (trueDifference/20)); //default is around 2.35%
                            setElementProperty(background, 'height', ( 100 + trueDifference*30 ), '%');


                            const pageManager = document.getElementById('page-manager');

                            //setElementProperty(pageManager, 'margin-top', 'var(--ytd-masthead-height,var(--ytd-toolbar-height))', '');
                            if (pageManager.querySelector('ytd-watch-flexy').fullscreenValue) {
                                setElementProperty(pageManager, 'margin-top', '0', '%');
                            }
                            else{

                                switch(trueDifference) {
                                    case(0): //100
                                        setElementProperty(pageManager, 'margin-top', 'var(--ytd-masthead-height,var(--ytd-toolbar-height))', '');
                                        break;
                                    case(1): //90
                                        setElementProperty(pageManager, 'margin-top', '2.3%', '');
                                        break;
                                    case(2): //80
                                        setElementProperty(pageManager, 'margin-top', '2.6%', '');
                                        break;
                                    case(3): //70
                                        setElementProperty(pageManager, 'margin-top', '2.8%', '');
                                        break;
                                    case(4): //60
                                        setElementProperty(pageManager, 'margin-top', '2.8%', '');
                                        break;
                                    case(5): //50
                                        setElementProperty(pageManager, 'margin-top', '2.7%', '');
                                        break;
                                    case(6): //40
                                        setElementProperty(pageManager, 'margin-top', '2.4%', '');
                                        break;
                                    case(7): //30
                                        setElementProperty(pageManager, 'margin-top', '2%', '');
                                        break;
                                }
                            }







                        //Start
                            setElementProperty(start, 'margin-right', '20', '%');
                            const startCN = start.childNodes;
                                const guideButton = startCN[5];
                                const logoIcon    = startCN[8].querySelector('#logo-icon');

                            setElementProperty(guideButton, 'padding-right', (15 + trueDifference*5), '%');
                            setElementProperty(logoIcon, 'padding-left', (15 + trueDifference*5), '%');





                        //Center
                            setElementProperty(center, 'margin', '10', '%');
                            //setElementProperty(center, 'margin-left', '10', '%');
                            //setElementProperty(center, 'margin-right', '10', '%');

                            const centerCN = center.childNodes;
                            const searchBox         = centerCN[1];
                            const searchButtton     = centerCN[3];
                            const voiceSearchButton = centerCN[5];
                            const aiCompanionButton = centerCN[7];
                            const YTTMenuButton     = centerCN[9];

                            changeValue = 3 + trueDifference;
                            setElementProperty(center, 'height', changeValue, '%');
                            setElementProperty(center, 'width', changeValue, '%');
                            setElementProperty(center, 'display', 'contents','');




                            //setElementProperty(searchBox, 'margin-top', '10', 'px');
                            //setElementProperty(searchBox, 'width', 'fit-content', '');
                            //setElementProperty(searchBox, 'display', 'inline-flex', '');

                            switch(trueDifference) {
                                case(1):
                                    //setElementProperty(searchBox, 'margin-top', '10', 'px');
                                    setElementProperty(searchBox, 'height', (100), '%');
                                    break;
                                case(2):
                                    //setElementProperty(searchBox, 'margin-top', '20', 'px');
                                    setElementProperty(searchBox, 'height', (120), '%');
                                    break;
                                case(3):
                                    //setElementProperty(searchBox, 'margin-top', '30', 'px');
                                    setElementProperty(searchBox, 'height', (140), '%');
                                    break;
                            }

                            if (difference === 0) {
                                changeValue = 5.5;
                            }
                            else {
                                changeValue = 5.5 + difference;
                            }

                            //setElementProperty(voiceSearchButton, 'height', changeValue, "%");
                            //setElementProperty(voiceSearchButton, 'width', changeValue, "%");




                        //End
                        setElementProperty(end, 'margin-left', '20', '%');

                    } catch(e) {
                      if (debugMode) {
                          console.log("(startVideoChecks) exception: Failed To Make Changes To Ribbon: ", e);
                      }
                    }

                    try {
                    /*
                    MAIN VIDEO PLAYER
                    */
                        //progress bar size
                        document.querySelector('.ytp-progress-bar-container').style.setProperty('height', ( ( 6 + difference ) + 'px' ));

                    } catch(e) {
                        if (debugMode) {
                            console.log("(startVideoChecks) exception: Failed To Make Changes To Main Video Progress Bar");
                        }
                    }

                    try {
                    /*
                    COMMENT SECTION
                    */
                        //comment font size
                        changeValue = (14+difference);
                        document.querySelectorAll('.yt-spec-button-shape-next--size-m').forEach(query => {
                            query.style.setProperty('font-size', ( (changeValue) + "px" ));
                        });

                        const comments = document.querySelector('ytd-comment-thread-renderer').parentElement;

                        //comment author pngs size
                        changeValue = (40+difference);
                        comments.querySelectorAll('yt-img-shadow').forEach(query => {
                            query.style.setProperty('width',  ( ( changeValue ) + "px" ));
                            query.style.setProperty('height', ( ( changeValue ) + "px" ));
                        });

                        //comment emoji size
                        changeValue = (14+difference);
                        comments.querySelectorAll('#main img').forEach(query => {
                            query.style.setProperty('width', (  ( changeValue ) + "px" ));
                            query.style.setProperty('height', ( ( changeValue ) + "px" ));
                        });

                        //fix for the reply thread offset (caused by the script's scaling)
                        changeValue = (36 + difference + 2);
                        document.querySelectorAll('yt-sub-thread').forEach(query => {
                            query.childNodes[0].style.setProperty('width', ( ( changeValue ) + "px" ));
                        })
                    }
                    catch (e) {
                        if (debugMode) { //Comments Usually Throw Excpeitons Because They Are Not Loaded Yet (Scroll Down To See Them, And The Exception Should Go Away)
                            console.log("(startVideoChecks) exception: Failed To Make Changes To Comments");
                        }
                    }

                    try {
                    /*
                    SIDE PANEL VIDEO RECOMMENDATIONS
                    */
                        //video recommendation thumbnail size
                        changeValue = (168 + (difference*10 ))
                        document.querySelectorAll('.yt-lockup-view-model__content-image').forEach(query => {
                            query.style.setProperty('width', ( ( changeValue ) + "px" ));
                        });

                        //stops shorts from being spread out and weird looking
                        try {
                            columns.querySelector('ytd-reel-shelf-renderer').style.setProperty('--ytd-reel-item-compact-layout-width', 'initial');
                        } catch(e) {
                            if (debugMode) { //This Regularly Happens, Because Shorts Are Not Always Recommended
                                console.log("(startVideoChecks [Video Recommendation Side Panel]: exception: Failed To Make Chnages To Shorts");
                            }
                        }
                    } catch(e) {
                        if (debugMode) { //Exception From Missing Shorts Section Gets Caught Here
                            console.log("(startVideoChecks): exception: Failed To Make Changes To Video Recommendation Side Panel");
                        }
                    }

                }
                else if (difference >= 0) {
                    const background  = document.getElementById('background');
                    changeValue = (2 + (trueDifference/20)); //default is around 2.35%
                    setElementProperty(background, 'height', ( 100 + trueDifference*30 ), '%');
                }
            }
        catch(e){
            if (debugMode) {
                console.log("(startVideoChecks) exception: Failed To Make Changes To Watch Page", e);
            }
        }
    }


    function BetterZoomWatchPageReset() {
                    try {
                    /*
                    RESET MAIN DOCUMENT CHANGES
                    */
                        //Reset main document font size
                        document.documentElement.style.fontSize = (10) + "px";

                        //Reset to empty side borders
                        const columns = document.querySelector('#columns');
                        const secondary = columns.querySelector('#secondary');

                        //Reset the divide between primary and secondary columns
                        setElementProperty(columns, '--ytd-watch-flexy-sidebar-width', 402, "px");
                        setElementProperty(secondary, '--ytd-watch-flexy-sidebar-width', 402, "px");
                        setElementProperty(secondary, '--ytd-watch-flexy-horizontal-page-margin', 16, "px");
                    } catch(e) {
                        if (debugMode) {
                            console.log("(startVideoChecks) exception: Failed To Make Changes To Document");
                        }
                    }



                    try {
                        /*
                        RESET RIBBON CHANGES
                        */

                        //Reset toolbar size
                        document.getElementById('masthead').style.setProperty('height', (100) + '%');


                        //Reset toolbar logo size
                            let mainSvgs = document.querySelectorAll('svg'); //'svg' //'ytd-button-renderer'
                            for (let i = 6; i <= 12; i++) {
                                setElementProperty(mainSvgs[i], 'height', 100, "%");
                                setElementProperty(mainSvgs[i], 'width',  100, "%");
                            }


                        //Reset fixing logos background bubble
                        const container = document.getElementById('voice-search-button').parentNode.parentElement;
                            const containerCN = container.childNodes;
                                const start  = containerCN[1];
                                const center = containerCN[3];
                                const end    = containerCN[5];



                        //Reset Container
                            const background  = document.getElementById('background');
                            setElementProperty(background, 'height', (56), 'px');

                            const pageManager = document.getElementById('page-manager');
                            setElementProperty(pageManager, 'margin-top', 'var(--ytd-masthead-height,var(--ytd-toolbar-height))', '');







                        //Reset Start
                            setElementProperty(start, 'margin-right', '', '');
                            const startCN = start.childNodes;
                                const guideButton = startCN[5];
                                const logoIcon    = startCN[8].querySelector('#logo-icon');

                            //setElementProperty(guideButton, 'padding-right', (8), 'px');
                            setElementProperty(guideButton, 'padding-right', '', '');
                            setElementProperty(logoIcon,    'padding-left',  '', '');





                        //Center
                            setElementProperty(center, 'margin', '', '');
                            //setElementProperty(center, 'margin-left', '10', '%');
                            //setElementProperty(center, 'margin-right', '10', '%');

                            const centerCN = center.childNodes;
                            const searchBox         = centerCN[1];
                            const searchButtton     = centerCN[3];
                            const voiceSearchButton = centerCN[5];
                            const aiCompanionButton = centerCN[7];
                            const YTTMenuButton     = centerCN[9];

                            changeValue = 3 + trueDifference;
                            setElementProperty(center, 'height',  '', '');
                            setElementProperty(center, 'width',   '', '');
                            setElementProperty(center, 'display', '', '');


                            setElementProperty(searchBox, 'height', '', '');



                        //End
                        setElementProperty(end, 'margin-left', '', '');

                    } catch(e) {
                        if (debugMode) {
                            console.log("(startVideoChecks) exception: Failed To Make Changes To Ribbon");
                        }
                    }





    }
    function BetterZoomHomePageChanges() {

    }
    function BetterZoomHomePageReset() {

    }

    function startVideoChecks() {
        //Videos: 'yt-lockup-view-model'
        //Shorts: 'ytd-reel-shelf-renderer'
        //Movies: 'ytd-compact-movie-renderer'


        //Better Zoom

        if (enableBetterZoom) {
            BetterZoomWatchPageChanges();
        }
        else { //zoom is not enabled
            BetterZoomWatchPageReset();
        }





        let container;
        try {
            container = (document.querySelector('yt-lockup-view-model').parentElement);
        } catch(e){}

        try {
            if (container) {


                //Normal Video Checks

                //hidden one: <div id="contents" class="style-scope ytd-rich-grid-renderer">
                    //<ytd-rich-item-renderer class="style-scope ytd-rich-grid-renderer" items-per-row="3" lockup="true" rendered-from-rich-grid=""></ytd-rich-item-renderer>


                //real one:   <div id="contents" class=" style-scope ytd-item-section-renderer style-scope ytd-item-section-renderer">
                    //<yt-lockup-view-model class="ytd-item-section-renderer lockup yt-lockup-view-model--wrapper"></yt-lockup-view-model>




                container.querySelectorAll('yt-lockup-view-model').forEach(query => {
                    const progressSegment = query.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
                    let watchedPercent = progressSegment ? parseFloat(progressSegment.style.width) || 0 : 0;

                    if (debugMode) {
                        console.log("video: ",query, "watchedPercent: ", watchedPercent);
                    }

                    if (watchedPercent === 100) {
                        query.style.display = showWatched ? '' : 'none';
                    }
                });



                //Check For Shelfs
                document.querySelectorAll('ytd-reel-shelf-renderer').forEach(query => {
                    container = document.querySelector('ytd-reel-shelf-renderer').forEach(query => {
                        let title = query.querySelector('#title')?.textContent.trim().toLowerCase();

                        if (debugMode) {
                            console.log("section: ",query);
                        }

                        if (title === "shorts") {
                            query.style.display = showShorts ? '' : 'none';
                        }
                        else {
                            if (debugMode) {
                                console.log('title not used: ', title);
                            }
                        }
                    })
                });

                //Badge Checks
                container.querySelectorAll('ytd-compact-movie-renderer').forEach(query => {

                    const badgeTextAll  = query.querySelectorAll('.yt-badge-shape__text');
                    const badgeIcon     = query.querySelector('.yt-badge-shape__icon'); //this badge appears to the left of the duration
                    const badgeRenderer = query.querySelector('ytd-badge-supported-renderer p');


                    if (debugMode) {
                        console.log('badgeTextAll: ', {badgeTextAll});
                        console.log('badgeTextAll[0]: ', badgeTextAll[0]?.textContent.trim().toLowerCase());
                        console.log('badgeTextAll[1]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());
                        console.log('badgeTextAll[2]: ', badgeTextAll[2]?.textContent.trim().toLowerCase());

                        console.log('badgeIcon: ', badgeIcon);
                        console.log('badgeRenderer: ', badgeRenderer);
                    }


                    if (badgeTextAll[1]) {
                        if (debugMode) {
                            console.log("badgeTextAll[1] found");
                        }
                        //showFreeMovies
                        if (badgeTextAll[1]?.textContent.trim().toLowerCase() === 'free') {
                            query.style.display = showFreeMovies ? '' : 'none';
                        }
                    }
                });
            }
        } catch(e) {}
    }



    function processVideos() {

        if (getURL_id() === 0) {
            const items = document.querySelectorAll('ytd-rich-item-renderer');
            items.forEach(item => {
                if(item.hasAttribute('is-in-first-column')) {
                    item.removeAttribute('is-in-first-column');
                }
                else if (debugMode) {
                    console.log(item.getAttributeNames());
                }


                const progressSegment = item.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
                let watchedPercent = progressSegment ? parseFloat(progressSegment.style.width) || 0 : 0;

                if (watchedPercent === 100) { //can swap to being >= 50 if you want to also remove videos watched 50% of the way through
                    item.style.display = showWatched ? '' : 'none';
                }

                if (enableLogging && !item.dataset.logged) {
                    try {
                        item.dataset.logged = 'true';

                        //const title = item.querySelector('.yt-lockup-metadata-view-model-wiz__title span')?.textContent.trim();
                        const title       = item.querySelector('.yt-lockup-metadata-view-model__heading-reset')?.textContent.trim();
                        const channelName = item.querySelector('.yt-core-attributed-string__link')?.textContent.trim();
                        const channelURL  = item.querySelector('.yt-core-attributed-string__link')?.href;
                        const metadata    = item.querySelectorAll('.yt-content-metadata-view-model__metadata-row')[1]?.textContent.trim().split(' • ');
                        const views       = metadata[0];
                        const uploadDate  = metadata[1];
                        const duration    = item.querySelector('.yt-badge-shape__text')?.textContent.trim();

                        console.log({ title, channelName, channelURL, views, uploadDate, duration, watchedPercent});
                    }
                    catch (e) {
                        console.log('metadata could not be found');
                    }
                }
            });
        }



    }



    function startItemBadgeChecks() {
        //const container = document.getElementById('contents');
        const container = getContents();//document.querySelector('ytd-rich-item-renderer').parentElement


            if (container) {
                container.querySelectorAll('ytd-rich-item-renderer').forEach(query => {
                    const badgeTextAll  = query.querySelectorAll('.yt-badge-shape__text');
                    const badgeIcon     = query.querySelector('.yt-badge-shape__icon'); //this badge appears to the left of the duration
                    const badgeRenderer = query.querySelector('ytd-badge-supported-renderer p');
                    let iconPathStart = "xx";

                    if (badgeIcon !== null) {
                        try {
                            iconPathStart = badgeIcon.querySelector('path').getAttribute('d').substring(0,2);

                        } catch(e){}
                    }

                    if (debugMode) {
                        console.log('badgeTextAll: ', {badgeTextAll});
                        console.log('badgeTextAll[0]: ', badgeTextAll[0]?.textContent.trim().toLowerCase());
                        console.log('badgeTextAll[1]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());
                        console.log('badgeTextAll[2]: ', badgeTextAll[2]?.textContent.trim().toLowerCase());
                        console.log('badgeTextAll[3]: ', badgeTextAll[3]?.textContent.trim().toLowerCase());

                        console.log('badgeIcon: ', badgeIcon);
                        console.log('badgeRenderer: ', badgeRenderer);
                    }




                    switch (badgeTextAll[0]?.textContent.trim().toLowerCase()) {  //mix: M3 3.657v16.689a1 1 0 001.466.883L8 19.369V4.632l-3.534-1.86A1 1 0 003 3.657ZM14 7.79l-4-2.105v12.631l4-2.106V7.79ZM22 12l-6-3.157v6.315L22 12Z
                        case 'mix':
                            query.style.display = showMusic ? '' : 'none';
                            break;
                    }

                    switch (badgeTextAll[2]?.textContent.trim().toLowerCase()) {
                        case 'members only':
                            query.style.display = showMemberOnly ? '' : 'none';
                            break;

                        case 'free':
                            query.style.display = showFreeMovies ? '' : 'none';
                            break;
                    }

                    switch (badgeTextAll[3]?.textContent.trim().toLowerCase()) {    //youtube featured badge can take place of members only apparently?
                        case 'members only':
                            query.style.display = showMemberOnly ? '' : 'none';
                            break;

                        case 'free':
                            query.style.display = showFreeMovies ? '' : 'none';
                            break;
                    }

                    switch (iconPathStart) { //note: M5.5 1.383V6.88a2.25 2.25 0 101 1.871V4.6l2.743 1.647a.5.5 0 00.757-.43V3.485a.5.5 0 00-.243-.429l-3.5-2.1a.5.5 0 00-.757.427Z
                        case ('M5'):
                            query.style.display = showMusic ? '' : 'none';
                            break;
                    }

                    switch(badgeRenderer) {
                        case 'purchased':
                            query.style.display = showPurchased ? '' : 'none';
                            break;
                    }


                });
            }
    }






    function toggleStreamerMode() {
        const enabled = enableStreamerMode ? 'none' : '';
            try {
                toggleQuerySelectorAll('ytd-merch-shelf-renderer', enabled);             //toggle Merch Under Videos
                toggleQuerySelector('ytd-comment-simplebox-renderer', enabled);          //toggle Commenting Under Videos
                toggleQuerySelector('ytd-topbar-menu-button-renderer', enabled);         //toggle top right profile picture
                toggleQuerySelector('ytd-guide-section-renderer:nth-child(2)', enabled); //toggle subscriptions on the left side menu on the homepage
                toggleGetElementById('country-code', enabled);                           //toggle users country on the top left logo
                toggleQuerySelectorAll('#reply-button-end', enabled);                    //remove reply button in comments


            } catch (e) {
                setTimeout("streamer mode failed...retrying",toggleStreamerMode, 50);
            }
    }




  /*
    function toggleNew() {
        document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
            const text = item.querySelector('text-element')?.textContent.trim().toLowerCase();
            if (text && text.includes('youtube new_thing')) {
                item.style.display = showNew ? '' : 'none';
            }
        });
    }
  */



    function checkItemsPerRow() {
        if (enableBetterZoom) {
            let zoom = Math.round(window.devicePixelRatio * 100);
            const base = 3;
            let difference = (100 - zoom)/10;
            if (difference > 0) {
                const container = document.querySelector('ytd-rich-grid-renderer');
                if (container) {
                    container.style.setProperty('--ytd-rich-grid-items-per-row', (base+difference));
                }
                const container2 = document.querySelector('ytd-rich-shelf-renderer');
                if (container2) {
                    container2.style.setProperty('--ytd-rich-grid-items-per-row', ((base+3)+difference));
                }
                document.documentElement.style.fontSize = (10 + difference*2) + "px";

            }
        }
    }



    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
        //const dcheckItemsPerRow = debounce(checkItemsPerRow, 1000);

    function startObservers() {
        try {
        const observer = new MutationObserver(() => {
            let currentURL = document.URL;
            toggleStreamerMode();

            toggleUIChecks(); //checks homepage versus watchpage

            if (currentURL === "https://www.youtube.com/" || currentURL === "https://www.youtube.com/?bp=wgUCEAE%3D") {
                if (debugMode) {
                    console.log("Current URL (Homepage): ", currentURL);
                }
                togglePrimaryHeader();
                toggleGuide();
                toggleBanner();

                checkItemsPerRow();//dcheckItemsPerRow();
                processVideos();
                startShelfChecks();
                startItemChecks();
                startItemBadgeChecks();

            }

            else if (currentURL.startsWith("https://www.youtube.com/watch?v=")) {
                if (debugMode) {
                    console.log("Current URL (Watch Page): ", currentURL);
                }
                startVideoChecks();
            }


            //prevURL = currentURL; //global
        });
        observer.observe(document.body, { childList: true, subtree: true });
        } catch(e) {
            console.log("observers failed: ", e, " retrying...");
            startObservers();
        } //restart observers
        }






    function clicked(button, menu) {
        const startTime = performance.now()



        //console.log("boop: ", button);

        //button.innerHTML = "changed"; this worked

        const rect = button.getBoundingClientRect();

        //console.log ("Menu Button Rect: ", button.getBoundingClientRect());
        //console.log ("Menu Container Rect: ", menu.getBoundingClientRect());


        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';


      /*
        if (enableBetterZoom) {
            let zoom = getZoomOut();
            switch(zoom) {
                case(1): //90
                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(2): //80

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(3): //70

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(4): //60

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(5): //50

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(6): //40

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                case(7): //30

                    setElementProperty(menu, 'transform', 'scale('+(1.1), ')');
                    break;
                default:
                    setElementProperty(menu, 'transform', '', '');
                break;
            }
            //console.log ("Menu Button Rect (+): ", button.getBoundingClientRect());
            //console.log ("Menu Container Rect (+): ", menu.getBoundingClientRect());
            menu.style.top = rect.bottom * 2 + 'px';
            menu.style.left = rect.left + 'px';
            //console.log ("Menu Button Rect (++): ", button.getBoundingClientRect());
            //console.log ("Menu Container Rect (++): ", menu.getBoundingClientRect());

            //menu.style.transform = 'scale(' + ( (getZoomOut() > 0 ? getZoomOut() : 1) ) + ')';
        }
        */


      const endTime = performance.now()
      console.log(`Call to clicked() took ${endTime - startTime} milliseconds`)
    }





  /*
   *
   * TODO: memoisation
   *       fix/show the tooltip
   *
   */
    function createMenuButton() {
      const voiceSearchButton = document.querySelector('#voice-search-button');


        try {
        const voiceSearchButton = document.querySelector('#voice-search-button');


        const voice_shape = voiceSearchButton.querySelector('yt-button-shape');

        const voice_icon = voice_shape.querySelector('svg')
        const clone_i = voice_icon.cloneNode(false);
        //console.log(clone_i);

        const clone = voice_shape.cloneNode(true);
        //console.log("clone: ", clone);


        clonePossible = true;

        } catch(e) {
          if (debugMode) { console.log("Button Could Not Be Created: ", " retrying..."); }
            setTimeout(createMenuButton, 50);
        } //keep trying until it is made


        if (clonePossible) {

        let replicatedButton = document.createElement('div'), btnStyle = replicatedButton.style;
          replicatedButton.id = 'replicatedButton';
          replicatedButton.className = 'style-scope ytd-masthead';

        let ytd_button_renderer = document.createElement('ytd-button-renderer');
          ytd_button_renderer.className = 'style-scope ytd-masthead';

        let yt_button_shape = document.createElement('yt-button-shape')
          yt_button_shape.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment"





        replicatedButton.appendChild(ytd_button_renderer)
        voiceSearchButton.parentElement.appendChild(replicatedButton);


        let tp_yt_paper_tooltip = document.querySelector('#replicatedButton').querySelector('tp-yt-paper-tooltip')
        tp_yt_paper_tooltip.removeAttribute('disable-upgrade');


        document.querySelector('#replicatedButton').querySelector('tp-yt-paper-tooltip').querySelector('#tooltip').append('example text')

        let voice_shape = document.querySelector('#voice-search-button').querySelector('yt-button-shape');


        let rep_shape = document.querySelector('#replicatedButton').querySelector('yt-button-shape');
        let clone = voice_shape.cloneNode(true);
        rep_shape.after(clone);
        document.querySelector('#replicatedButton').querySelector('path').setAttribute('d', 'M21 5H3a1 1 0 000 2h18a1 1 0 100-2Zm-3 6H6a1 1 0 000 2h12a1 1 0 000-2Zm-3 6H9a1 1 0 000 2h6a1 1 0 000-2Z')
        replicatedButton.style.borderRadius = '100px';
        replicatedButton.style.marginLeft = '12px';
        replicatedButton.style.backgroundColor = 'var(--yt-spec-additive-background)';


        const menu = createMenu();
        replicatedButton.onclick = function() {clicked(replicatedButton, menu)};
        }

    }





    function createMenu() {
        //font-size: 10px;font-family: Roboto, Arial, sans-serif;
        const menuContainer = document.createElement('div');
        menuContainer.style.position        = 'fixed';
        menuContainer.style.backgroundColor = '#282828';
        menuContainer.style.color           = '#f1f1f1';
        menuContainer.style.padding         = '10px';
        menuContainer.style.display         = 'none';
        menuContainer.style.zIndex          = '9999';
        //menuContainer.style.border          = '1px solid #555';
        //menuContainer.style.boxShadow       = '0 2px 10px rgba(0,0,0,0.5)';
        menuContainer.style.whiteSpace      = 'nowrap';
        menuContainer.style.flexDirection   = 'column';
        //menuContainer.style.gap             = '5px';
        menuContainer.style.borderRadius    = '4px';
        menuContainer.style.userSelect      = 'none';



        const createCheckbox = (labelText, settingKey, onChange) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = localStorage.getItem(settingKey) !== 'false';
            checkbox.addEventListener('change', () => {
                localStorage.setItem(settingKey, checkbox.checked);
                onChange();
            });
            checkbox.style.cursor = 'pointer';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.marginLeft = '6px';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            return wrapper;
        };

        const createLabel = (labelText) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '5px';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.marginLeft = '6px';
            wrapper.appendChild(label);

            return wrapper;
        };

        const createToggle = (toggleName) => {
            let toggle = document.createElement(toggleName);
            toggle.id="options"
            toggle.className="style-scope ytd-settings-options-renderer"

            let ytd_settings_switch_renderer = document.createElement('ytd-settings-switch-renderer');
            ytd_settings_switch_renderer.className = "style-scope ytd-settings-options-renderer";
            ytd_settings_switch_renderer.style.margin = '0px';

            toggle.appendChild(ytd_settings_switch_renderer);



          return toggle;
        };

        const initToggle = (toggleName, key, onChange, title, subtitle) => {
          let toggle = document.querySelector(toggleName);
          let toggleButton = toggle.querySelector('tp-yt-paper-toggle-button');
          toggleButton.checked = localStorage.getItem(key) !== 'false';
          toggleButton.addEventListener('change', () => {
            localStorage.setItem(key, toggleButton.checked);
            onChange();
          });


          let yt_formatted_string = toggle.querySelector('yt-formatted-string');
          let yt_formatted_string2 = toggle.querySelectorAll('yt-formatted-string')[2];


          toggle.querySelector('yt-img-shadow').remove();
          yt_formatted_string.parentElement.style.display = 'ruby';


          yt_formatted_string.removeAttribute('is-empty');
          yt_formatted_string.textContent = title;
          yt_formatted_string2.removeAttribute('is-empty');
          yt_formatted_string2.textContent = subtitle;

        }




//This is for example purposes

        if (debugMode) {
          menuContainer.appendChild(createToggle('ShowToggle'));
        }


      menuContainer.appendChild(createLabel("General UI Toggles (homepage) - *more general changes to the ui as a whole, rather than filtering content"));
          menuContainer.appendChild(createToggle('ShowPrimaryHeader'));
          menuContainer.appendChild(createToggle('ShowGuide'));
          menuContainer.appendChild(createToggle('ShowBanner'));

      menuContainer.appendChild(createLabel("General UI Toggles (watchpage)"));
          menuContainer.appendChild(createToggle('ShowRecommendations'));
          menuContainer.appendChild(createToggle('ShowBelow'));




      menuContainer.appendChild(createLabel('Shelf Toggles - *This is the homepage content that have their own headers*'));
          menuContainer.appendChild(createToggle('ShowShorts'));
          menuContainer.appendChild(createToggle('ShowGames'));
          menuContainer.appendChild(createToggle('ShowBreakingNews'));
          menuContainer.appendChild(createToggle('ShowPosts'));
          menuContainer.appendChild(createToggle('showExploreMoreTopics'));


      menuContainer.appendChild(createLabel('Video Toggles - *This is the content inside normal video recommendation shelf*'));
          menuContainer.appendChild(createToggle('ShowMusic'));
          menuContainer.appendChild(createToggle('ShowPlaylistsandPodcasts'));
          menuContainer.appendChild(createToggle('ShowNewToYouMessage'));
          menuContainer.appendChild(createToggle('ShowWatchedVideos'));
          menuContainer.appendChild(createToggle('ShowPurchasedVideos'));
          menuContainer.appendChild(createToggle('ShowFreeMovies'));
          menuContainer.appendChild(createToggle('ShowMemberOnly'));

      menuContainer.appendChild(createLabel('Experimental - *These may or may not work correctly*'));
          menuContainer.appendChild(createToggle('EnableBetterZoom'));
          menuContainer.appendChild(createToggle('EnableStreamerMode'));
          menuContainer.appendChild(createToggle('ShowAI'));





      menuContainer.appendChild(createLabel('developer tools'));
          menuContainer.appendChild(createToggle('DebugMode'));
          menuContainer.appendChild(createToggle('LogMetadata'));






        //Still Field Testing
        /*badgeTextAll[1? and 2?]*///menuContainer.appendChild(createCheckbox('Show Member Only (alpha)',             'ytt-show-member-only',      () => { showMemberOnly     = !showMemberOnly;     startItemBadgeChecks();  }));

        //menuContainer.appendChild(createLabel('This is a label'));
        //menuContainer.appendChild(createCheckbox('Show New',                    'ytt-show-new',         () => { showNew          = !showNew;          toggleNew();               }));
        //getURL_id() === 0 = true ? fun1() : fun2();

        document.body.appendChild(menuContainer);






        //This is for example purposes
        if (debugMode) {
          initToggle("ShowToggle", "ytt-show-toggle", () => {showToggle=!showToggle;startToggleChecks();}, "This is a title", "This is a subtitle");
        }

        initToggle('ShowPrimaryHeader',         'ytt-show-primary-header',        () => { showPrimaryHeader     = !showPrimaryHeader;       togglePrimaryHeader();                                            }, "Show Primary Header",   "Tag header above homepage recommendations"                   );
        initToggle('ShowGuide',                 'ytt-show-guide',                 () => { showGuide             = !showGuide;               toggleGuide();                                                    }, "Show Guide",            "The right side (Subscriptions, You, Explore, etc.)"          );
        initToggle('ShowBanner',                'ytt-show-banner',                () => { showBanner            = !showBanner;              toggleBanner();                                                   }, "Show Banner",           "Turns on Banner"                                             );


        initToggle('ShowRecommendations',       'ytt-show-recommendations',       () => { showRecommedations    = !showRecommedations;      toggleRecommendations();                                          }, "Show Recommendations",  "Turns on recommendations on videos watch pages"              );
        initToggle('ShowBelow',                 'ytt-show-below',                 () => { showBelow             = !showBelow;               toggleBelow();                                                    }, "Show Below",            "Turns on information below watch page player"                );





        initToggle('ShowShorts',                'ytt-show-shorts',                () => { showShorts             = !showShorts;              startShelfChecks();                                               }, "Shorts",                "Turns Shorts On"                                             );
        initToggle('ShowGames',                 'ytt-show-games',                 () => { showGames              = !showGames;               startShelfChecks();                                               }, "Games",                 "Turns Games On"                                              );
        initToggle('ShowBreakingNews',          'ytt-breaking-news',              () => { showBreakingNews       = !showBreakingNews;        startShelfChecks();                                               }, "Breaking News",         "Turns Breaking News On"                                      );
        initToggle('ShowPosts',                 'ytt-show-posts',                 () => { showPosts              = !showPosts;               startShelfChecks();                                               }, "Creator Posts",         "Turns Creator Posts On"                                      );
        initToggle('ShowExploreMoreTopics',     'ytt-show-explore-more-topics',   () => { showExploreMoreTopics  = !showExploreMoreTopics;   startShelfChecks();                                               }, "Explore More Topics",   "Turns Explore Topics On"                                     );




        initToggle('ShowMusic',                 'ytt-show-music',                 () => { showMusic             = !showMusic;               startItemBadgeChecks();                                           }, "Music",                 "Turns on Music"                                              );
        initToggle('ShowPlaylistsandPodcasts',  'ytt-show-playlists',             () => { showPlaylists         = !showPlaylists;           startItemChecks();                                                }, "Playlists & Podcasts",  "Turns on Playlists & Podcasts"                               );
        initToggle('ShowNewToYouMessage',       'ytt-show-new-to-you',            () => { showNewToYou          = !showNewToYou;            startItemChecks();                                                }, "New To You Message",    "Turns on New To You Message"                                 );
        initToggle('ShowWatchedVideos',         'ytt-show-watched',               () => { showWatched           = !showWatched;             getURL_id() === 0 ? processVideos() : startVideoChecks();         }, "Watched Videos",        "Turns on Watched Videos"                                     );
        initToggle('ShowPurchasedVideos',       'ytt-show-purchased',             () => { showPurchased         = !showPurchased;           startItemBadgeChecks();                                           }, "Purchased Videos",      "Turns on Purchased Videos"                                   );
        initToggle('ShowFreeMovies',            'ytt-show-free-movies',           () => { showFreeMovies        = !showFreeMovies;          getURL_id() === 0 ? startItemBadgeChecks() : startVideoChecks();  }, "Free Movies",           "Turns on Free Movies"                                        );
        initToggle('ShowMemberOnly',            'ytt-show-member-only',           () => { showMemberOnly        = !showMemberOnly;          startItemBadgeChecks();                                           }, "Member Only",           "Turns on Members Only Videos"                                );

        initToggle('EnableBetterZoom',          'ytt-enable-better-zoom',         () => { enableBetterZoom      = !enableBetterZoom;        getURL_id() === 0 ? checkItemsPerRow(): startVideoChecks()        }, "Better Zoon",           "Allows content to fill the screen better when zooming out"   );
        initToggle('EnableStreamerMode',        'ytt-enable-streamer-mode',       () => { enableStreamerMode    = !enableStreamerMode;      toggleStreamerMode();                                             }, "Streamer Mode",         "Removes Identifying Information (some links will break this)");
        initToggle('ShowAI',                    'ytt-show-ai',                    () => { showAI                = !showAI;                  getURL_id() === 0 ? startItemChecks() : toggleAI();       }, "Show AI",               "Turns on AI"                                                 );

        initToggle('DebugMode',                 'ytt-debug-mode',                 () => { debugMode             = !debugMode;                                                                                 }, "DebugMode",             "Console Logs more step by step function calling"             );
        initToggle('LogMetadata',               'ytt-logging',                    () => { enableLogging         = !enableLogging; processVideos();                                                            }, "LogMetadata",           "Console Logs videos metadata loading in the DOM"             );


        return menuContainer;
    }





    function waitForBody() {
        if (document.body) {
            console.log("script started");
            //checks to make sure extension did not get restarted, as this creates a duplicate button
            if (!clonePossible) {
                console.log("creating ytt button");
                createMenuButton();
                startObservers();
            }

        }
        else {
            setTimeout(waitForBody, 50);
        }
    }
    waitForBody();

})();
