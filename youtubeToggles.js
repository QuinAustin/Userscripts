// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.1.01
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
Changelog 1.1.0

      YouTube Changed Class Names:
        .yt-badge-shape__text     ->    .ytBadgeShapeText
        .yt-badge-shape__icon     ->    .ytBadgeShapeIcon

    - Variables for Keys boolean are simplified a little better
    - The first time the program is used, or when localStorage does not contain keys, will now correctly set certain keys to being false by default instead of true.
    - Used minified js in some locations to simplify some logic.
    - The better zoom function is now able to keep the menu tracked to the button using an observer
    - The wait for document.body is simplified, and when completed it will call main() to start the observer for calling different functions
    - The menu is more in line with what YouTube looks like, and is also resizeable
    - The logic for watched videos is now able to be set to a different value
    - Menu creation has less nesting, but still longer than it probably needs to be.
    - Console messages are now separated into different categories like, log, debug, warn, and error
    - Before the menu is created, an observer is now checking to make sure the dynamic changes to voice-search-button are completed, before calling the function.

*/
/*
HOTFIX 1.1.01
  - backgroundColor updated from 'var(--yt-spec-additive-background)' -> 'var(--yt-sys-color-baseline--additive-background)'
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





//    let showChannelStore    = localStorage.getItem('ytt-show-channel-store') !== "false";
//    let showMemberJoin      = localStorage.getItem('ytt-show-member-join') !== "false";
//    let showThanksDonation  = localStorage.getItem('ytt-show-thanks-donation') !== "false";




  //This is for example purposes
    let showToggle            = localStorage.getItem('ytt-show-toggle')          !== "false";



  /*======================================================
   *        HOME PAGE TOGGLES
   *======================================================*/

    let showPrimaryHeader     = localStorage.getItem("ytt-show-primary-header") !== "false";
    let showGuide             = localStorage.getItem('ytt-show-guide')          !== "false";
    let showBanner              = localStorage.getItem('ytt-show-banner')       !== "false";

    let showShorts              = localStorage.getItem('ytt-show-shorts')              !== "false";
    let showGames               = localStorage.getItem('ytt-show-games')               !== "false";
    let showBreakingNews        = localStorage.getItem('ytt-breaking-news')            !== "false";
    let showPosts               = localStorage.getItem('ytt-show-posts')               !== "false";
    let showExploreMoreTopics   = localStorage.getItem('ytt-show-explore-more-topics') !== "false";
    let showWhatDidYouThink     = localStorage.getItem('ytt-what-did-you-think')       !== "false";

    let showMusic               = localStorage.getItem('ytt-show-music')       !== "false";
    let showPlaylists           = localStorage.getItem('ytt-show-playlists')   !== "false";
    let showNewToYou            = localStorage.getItem('ytt=show-new-to-you')  !== "false";
    let showWatched             = localStorage.getItem('ytt-show-watched')     !== "false";
    let showPurchased           = localStorage.getItem('ytt-show-purchased')   !== "false";

    let showFreeMovies          = localStorage.getItem('ytt-show-free-movies') !== "false";
    let showMemberOnly          = localStorage.getItem('ytt-show-member-only') !== "false";

  /*======================================================
   *        WATCH PAGE TOGGLES
   *======================================================*/
    let showRecommedations    = localStorage.getItem('ytt-show-recommendations')  !== "false";
    let showBelow             = localStorage.getItem('ytt-show-below')            !== "false";
    let showComments          = localStorage.getItem('ytt-show-comments')         !== "false";
    let showAI                = localStorage.getItem('ytt-show-ai')               !== "false";

  /*======================================================
   *        DEVELOPER TOGGLES
   *======================================================*/
    if (localStorage.getItem('ytt-enable-better-zoom') === null) { //in the localStorage.clear() gets run or cleared through developer tools. Does not prevent specific clearing of the other inner keys
        localStorage.setItem('ytt-enable-better-zoom', false);
        localStorage.setItem('ytt-enable-streamer-mode', false);
        localStorage.setItem('ytt-debug-mode', false);
        localStorage.setItem('ytt-logging', false);
    }

    let enableBetterZoom      = localStorage.getItem('ytt-enable-better-zoom')   !== "false";
    let enableStreamerMode    = localStorage.getItem('ytt-enable-streamer-mode') !== "false";

    let debugMode               = localStorage.getItem('ytt-debug-mode')       !== "false";
    let enableLogging           = localStorage.getItem('ytt-logging')          !== "false";








    /*
    HELPER FUNCTIONS
    */

    function toggleQuerySelector(e,t){const o=document.querySelector(e);o&&(o.style.display=t)}




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


    /*
    TOGGLE FUNCTIONS
    */





//This is for example and debug purposes
    function startToggleChecks() {
      if (showToggle) {
        console.debug("Starting Toggle Check");
        return;
      }
      console.debug("Ending Toggle Check");
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
            console.warn("Failed to getURL_id()")
            setTimeout(getContents, 50)
        }
    }



    function getZoomOut() {
        return ((100 - Math.round(window.devicePixelRatio * 100 ) ) / 10); //i.e. 100% returns 0, 90% returns 1, ..., 30% returns 7
    }















    function toggleBanner(){toggleQuerySelector("ytd-statement-banner-renderer",showBanner)}
    function togglePrimaryHeader(){const e=document.querySelector("ytd-feed-filter-chip-bar-renderer");e&&(e.parentElement.style.display=showPrimaryHeader?"":"none",document.querySelector("#frosted-glass").style.height=showPrimaryHeader?"112px":"80px")}
    function toggleGuide(){const e=document.querySelector("#guide");e&&(e.style.display=showGuide?"":"none",setElementProperty(document.querySelector("#content"),"--ytd-persistent-guide-width",showGuide?"240":"0","px"))}


    function toggleBelow(){toggleQuerySelector("#below",showBelow)}
    function toggleRecommendations(){toggleQuerySelector("#related",showRecommedations)}
    function toggleComments(){toggleQuerySelector("#comments",showComments)}



    function toggleAI() {

        const buttons = document.querySelectorAll('#flexible-item-buttons .ytSpecButtonShapeNextHost'); //Next to Save button

        buttons.forEach(query => {
            if (query.textContent === "Ask") {
                toggleQuerySelector(query, showAI);
            }
        })


        //Looking for "Ask"




        toggleQuerySelector("#video-summary",showAI) //AI summary in video descriptions
        toggleQuerySelector("yt-video-description-youchat-section-view-model",showAI) //gemini button in video description (pulls up a chat window)
        toggleQuerySelector(".you-chat-entrypoint-button",showAI)                     //gemini button in the video player (pulls up a chat window)


    }


    function toggleUIChecks() {
        let url_id = getURL_id();

        if (url_id === 0 || url_id === 2) { //Check that the user is on the Homepage
            toggleBanner();
            togglePrimaryHeader();
            toggleGuide();
        }

        else if(getURL_id() === 1) { //Check that the user is on a Watchpage
            toggleBelow();
            toggleRecommendations();
            toggleComments();
            toggleAI();
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
            const container = getContents();

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
                        case 'what did you think of this video?':
                            query.style.display = showWhatDidYouThink ? '' : 'none';
                        break;
                        default:
                            console.info(
                                "Shelf Titles Found:",
                                "title  - ", title,
                                "title2 - ", title2,
                                "title3 - ", title3,
                            );
                        break;
                    }
                });
            }
        } //try
        catch (e) {
            console.error("(startShelfChecks) exception: Failed To Make Changes To Sections | ", e);
        }
    }



    function startItemChecks() {
        const container = getContents();
        if (container) {
            container.querySelectorAll('ytd-rich-item-renderer').forEach(query => {

                //Playlist, Podcast, Etc. Item
                const playlistBadge = query.querySelector('.ytBadgeShapeText')?.textContent.trim().toLowerCase();

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
    }



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
          //                  setElementProperty(start, 'margin-right', '20', '%');
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
              //          setElementProperty(end, 'margin-left', '20', '%');

                    } catch(e) {

                          console.warn("(startVideoChecks) exception: Failed To Make Changes To Ribbon: ", e);

                    }

                    try {
                    /*
                    MAIN VIDEO PLAYER
                    */
                        //progress bar size
                        document.querySelector('.ytp-progress-bar-container').style.setProperty('height', ( ( 6 + difference ) + 'px' ));

                    } catch(e) {

                            console.warn("(startVideoChecks) exception: Failed To Make Changes To Main Video Progress Bar");

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
                        //Comments Usually Throw Excpeitons Because They Are Not Loaded Yet (Scroll Down To See Them, And The Exception Should Go Away)
                            console.warn("(startVideoChecks) exception: Failed To Make Changes To Comments");

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
                            //This Regularly Happens, Because Shorts Are Not Always Recommended
                                console.warn("(startVideoChecks [Video Recommendation Side Panel]: exception: Failed To Make Chnages To Shorts");

                        }
                    } catch(e) {
                         //Exception From Missing Shorts Section Gets Caught Here
                            console.warn("(startVideoChecks): exception: Failed To Make Changes To Video Recommendation Side Panel");

                    }

                }
                else if (difference >= 0) {
                    const background  = document.getElementById('background');
                    changeValue = (2 + (trueDifference/20)); //default is around 2.35%
                    setElementProperty(background, 'height', ( 100 + trueDifference*30 ), '%');
                }
            }
        catch(e){

                console.warn("(startVideoChecks) exception: Failed To Make Changes To Watch Page", e);

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
            console.warn("(startVideoChecks) exception: Failed To Make Changes To Document");
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
        }
        catch(e) {
            console.warn("(startVideoChecks) exception: Failed To Make Changes To Ribbon");
        }





    }




    function startVideoChecks() {
        //Videos: 'yt-lockup-view-model'
        //Shorts: 'ytd-reel-shelf-renderer'
        //Movies: 'ytd-compact-movie-renderer'


        //Better Zoom




        let container;
        try {
            container = (document.querySelector('yt-lockup-view-model').parentElement);
        } catch(e){}

        try {
            if (container) {
                container.querySelectorAll('yt-lockup-view-model').forEach(query => {
                    const progressSegment = query.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
                    let watchedPercent = progressSegment ? parseFloat(progressSegment.style.width) || 0 : 0;
                    console.info("video: ",query, "watchedPercent: ", watchedPercent);
                    let max = localStorage.getItem('ytt-max-watch-percent');
                    if (watchedPercent >= max) {
                        query.style.display = showWatched ? '' : 'none';
                    }
                });

                //Check For Shelfs
                document.querySelectorAll('ytd-reel-shelf-renderer').forEach(query => {
                    container = document.querySelector('ytd-reel-shelf-renderer').forEach(query => {
                        let title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                        console.info("section: ",query);
                        if (title === "shorts") {
                            query.style.display = showShorts ? '' : 'none';
                        }
                        else {
                            console.info('title not used: ', title);
                        }
                    })
                });

                //Badge Checks
                container.querySelectorAll('ytd-compact-movie-renderer').forEach(query => {
                    const badgeTextAll  = query.querySelectorAll('.ytBadgeShapeText');//
                    const badgeIcon     = query.querySelector('.ytBadgeShapeIcon');   //('.ytBadgeShapeIcon'); //this badge appears to the left of the duration
                    const badgeRenderer = query.querySelector('ytd-badge-supported-renderer p');
                    //if (debugMode) {
                        console.info('badgeTextAll: ', {badgeTextAll});
                        console.info('badgeTextAll[0]: ', badgeTextAll[0]?.textContent.trim().toLowerCase());
                        console.info('badgeTextAll[1]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());
                        console.info('badgeTextAll[2]: ', badgeTextAll[2]?.textContent.trim().toLowerCase());

                        console.info('badgeIcon: ', badgeIcon);
                        console.info('badgeRenderer: ', badgeRenderer);
                    //}
                    if (badgeTextAll[1]) {
                        console.info("badgeTextAll[1] found");
                        //showFreeMovies
                        if (badgeTextAll[1]?.textContent.trim().toLowerCase() === 'free') {
                            query.style.display = showFreeMovies ? '' : 'none';
                        }
                    }
                });
            }
        }catch(e) {}
    }


    function autoJumpAhead() {
      const ja = document.querySelector('.ytwTimelyActionViewModelHost > button-view-model:nth-child(1) > button:nth-child(1)');
      if (ja) { //if it is not showing on the player, this element does not exist
        ja.click();
      }
    }




    function processVideos() {

        if (getURL_id() === 0) {
            const items = document.querySelectorAll('ytd-rich-item-renderer');
            items.forEach(item => {
                if(item.hasAttribute('is-in-first-column')) {
                    item.removeAttribute('is-in-first-column');
                }
                const progressSegment = item.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
                const watchedPercent = progressSegment ? parseFloat(progressSegment.style.width) || 0 : 0;
                const max = localStorage.getItem('ytt-max-watch-percent');

                if (watchedPercent >= max) { //if max was 50, it would hide videos watched 50% or more, but conversely it also unhides videos below the threshold, unhiding things hidden by other toggles
                    item.style.display = showWatched ? '' : 'none';

                }
                else {
                    item.style.display = '';
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
                        const duration    = item.querySelector('.ytBadgeShapeText')?.textContent.trim();

                        console.info({ title, channelName, channelURL, views, uploadDate, duration, watchedPercent});
                    }
                    catch (e) {
                        console.warn('metadata could not be found');
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
                const badgeTextAll  = query.querySelectorAll('.ytBadgeShapeText');
                const badgeIcon     = query.querySelector('.ytBadgeShapeIcon'); //this badge appears to the left of the duration
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






                //Top Priority | The page loading is enough to see it
                toggleGetElementById('country-code', enabled);                           //toggle users country abbreviation on the top left YouTube logo | reveals location of user
                toggleQuerySelector('#end #buttons', enabled)                            //toggle user profile picture (as well as create button and notifications) | profile picture is the only reason for such a high priority
                toggleQuerySelector('ytd-guide-section-renderer:nth-child(2)', enabled); //toggle subscriptions on the left side menu on the homepage | Subscriptions can reveal channels that are either local to where a user lives, or talk about personal topics and beliefs



                //Medium Priority | User has to give input (scrolling) to see it
                toggleQuerySelectorAll('ytd-merch-shelf-renderer', enabled);             //toggle Merch Under Videos      | reveals account's currency, which reveals location
                toggleQuerySelector('ytd-comment-simplebox-renderer', enabled);          //toggle Commenting Under Videos | reveals profile picture, and name if something is submitted


                //Low Priority | User has to hover or click something outside of common areas to see it
                toggleQuerySelectorAll('#reply-button-end', enabled);                    //remove reply button in comments | reveals profile picture, and name if something is submitted


                //remove items from the left side bar
                document.querySelectorAll('ytd-mini-guide-entry-renderer.style-scope .yt-simple-endpoint').forEach(query => {
                    const title = query.title;

                    switch (title) {
                        case 'Home':
                            //do nothing for now
                        break;
                        case 'Shorts':
                            //do nothing for now
                        break;
                        case 'Subscriptions':
                            query.style.display = enabled ? 'none' : '';
                        break;
                        case 'You':
                            query.style.display = enabled ? 'none' : '';
                        break;
                    }
                });


                const container = getContents()























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

    function homepageZoomOn() {

            let zoom = Math.round(window.devicePixelRatio * 100);
            const base = 3;
            let difference = (100 - zoom)/10;
            if (difference > 0) {
                const container = document.querySelector('ytd-rich-grid-renderer');
                if (container) {
                    container.style.setProperty('--ytd-rich-grid-items-per-row', (base+difference));
                }
                //shelfs seem to make their own properties, or they have a different parent that was not found, so each shelf is checked
                const container2 = document.querySelectorAll('ytd-rich-shelf-renderer');
                if (container2) {
                    container2.forEach(query => {
                        query.style.setProperty('--ytd-rich-grid-items-per-row', ((base+3)+difference));
                    });
                }
                document.documentElement.style.fontSize = (10 + difference*2) + "px";
            }

    }
    function homepageZoomOff() {
        const base = 4;
        const container = document.querySelector('ytd-rich-grid-renderer');
        if (container) {
            container.style.setProperty('--ytd-rich-grid-items-per-row', (base));
        }
        //shelfs seem to make their own properties, or they have a different parent that was not found, so each shelf is checked
        const container2 = document.querySelectorAll('ytd-rich-shelf-renderer');
        if (container2) {
            container2.forEach(query => {
                query.style.setProperty('--ytd-rich-grid-items-per-row', ((base+3)));
            });
        }
        document.documentElement.style.fontSize = (10) + "px";

    }


    function checkItemsPerRow() {
        if (enableBetterZoom) {
            homepageZoomOn();
        }
    }







    function setMenuEl(menu) {
        globalThis.menuEl = menu;
    }
    function getMenuEl() {
       return globalThis.menuEl;
    }
    function setMenuButtonEl(button) {
        globalThis.menuButtonEl = button;
    }
    function getMenuButtonEl() {
        return globalThis.menuButtonEl;
    }

    function toggleMenu() {
        const button = getMenuButtonEl();
        const menu = getMenuEl();


        const rect = button.getBoundingClientRect();
        menu.style.top = rect.bottom + 0 + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';


    }

    function updateMenu() {
        try {
            const button = getMenuButtonEl();
            const menu = getMenuEl();
            const rect = button.getBoundingClientRect();
            menu.style.top = rect.bottom + 0 + 'px';
            menu.style.left = rect.left + 'px';
            menu.style.borderRadius = '10px'; //curves get removed when cutoff from window size

        } catch {}
    }

/*
    //let initialDPR = window.devicePixelRatio;
    const observer = new ResizeObserver((entries) => {
      //console.log('zoom observer fired');
      //const currentDPR = window.devicePixelRatio;
      //if (Math.abs(currentDPR - initialDPR) > 0.01) {
      //  console.log(`Zoom detected via ResizeObserver. DPR: ${currentDPR}`);
      //  initialDPR = currentDPR;
        try {
        updateMenu();
        } catch{};
      //}
    });

    // Observe the root element (viewport)
    observer.observe(document.documentElement);

  */



  /*
   *
   * TODO: memoisation
   *       fix/show the tooltip
   *
   */
    function createMenuButton() {
        const voiceSearchButton = document.querySelector('#voice-search-button');


        let replicatedButton = document.createElement('div'), btnStyle = replicatedButton.style;
          replicatedButton.id = 'replicatedButton';
          replicatedButton.className = 'style-scope ytd-masthead';

        let ytd_button_renderer = document.createElement('ytd-button-renderer');
          ytd_button_renderer.className = 'style-scope ytd-masthead';

        replicatedButton.appendChild(ytd_button_renderer)

        document.querySelector("#center").appendChild(replicatedButton);

        const tp_yt_paper_tooltip = replicatedButton.querySelector('tp-yt-paper-tooltip')
          tp_yt_paper_tooltip.removeAttribute('disable-upgrade');
          tp_yt_paper_tooltip.querySelector('#tooltip').append('example text')

        replicatedButton.querySelector('yt-button-shape').after(voiceSearchButton.querySelector('yt-button-shape').cloneNode(true));
        replicatedButton.querySelector('path').setAttribute('d', 'M21 5H3a1 1 0 000 2h18a1 1 0 100-2Zm-3 6H6a1 1 0 000 2h12a1 1 0 000-2Zm-3 6H9a1 1 0 000 2h6a1 1 0 000-2Z')
        replicatedButton.style.borderRadius = '100px';
        replicatedButton.style.marginLeft = '12px';
        replicatedButton.style.backgroundColor = 'var(--yt-sys-color-baseline--additive-background)';//'var(--yt-spec-additive-background)';

        const menu = createMenu();
        populateMenuContainer(menu);
        initializeToggleButtons();

        setMenuButtonEl(replicatedButton);
        setMenuEl(menu);
        window.onresize = updateMenu;
        replicatedButton.onclick = function() {toggleMenu()};
    }





    function createMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.style.position        = 'fixed';    //stays on screen (messes up when zooming in and out)
        menuContainer.style.backgroundColor = '#282828';
        menuContainer.style.color           = '#f1f1f1';
        menuContainer.style.padding         = '10px';
        menuContainer.style.display         = 'none';
        menuContainer.style.zIndex          = '9999';
        menuContainer.style.whiteSpace      = 'nowrap';
        menuContainer.style.flexDirection   = 'column';
        menuContainer.style.borderRadius    = '10px'; //more curved edges
        menuContainer.style.userSelect      = 'none'; //no highlighting text
        menuContainer.style.overflow = 'scroll';
        menuContainer.style.maxWidth = '30%';
        menuContainer.style.maxHeight = '50%';
        menuContainer.style.clipPath = 'inset(0px round 10px)';
        //menuContainer.style.resize = 'both'; //does not work

        return menuContainer;
    }


    function populateMenuContainer(menuContainer) {


        const createLabel = (labelText, fontSize) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '5px';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.marginLeft = '0px';
            label.style.fontSize = fontSize;
            label.style.fontWeight = 'bold';
            wrapper.appendChild(label);

            return wrapper;
        };



        const createToggle = (toggleName) => {
            let toggle = document.createElement(toggleName);
            toggle.id="options"
            toggle.className="style-scope ytd-settings-options-renderer"
            toggle.style.marginLeft = '25px';



            let ytd_settings_switch_renderer = document.createElement('ytd-settings-switch-renderer');
            ytd_settings_switch_renderer.className = "style-scope ytd-settings-options-renderer";
            ytd_settings_switch_renderer.style.margin = '0px';
            toggle.appendChild(ytd_settings_switch_renderer);

            return toggle;
        };



        //This is for example purposes
        if (debugMode) {
          menuContainer.appendChild(createToggle('ShowToggle'));
        }

      /*======================================================
       *        HOME PAGE TOGGLES
       *======================================================*/
      menuContainer.appendChild(createLabel("Homepage Toggles", '15px'));
          menuContainer.appendChild(createLabel("Core UI", '10px'));  //These are the bigger UI elements hence "Core UI"
              menuContainer.appendChild(createToggle('ShowPrimaryHeader'));
              menuContainer.appendChild(createToggle('ShowGuide'));
              menuContainer.appendChild(createToggle('ShowBanner'));


          menuContainer.appendChild(createLabel("Blocks of Content", '10px')); //These are internally known as a "Shelf"
              menuContainer.appendChild(createToggle('ShowShorts'));
              menuContainer.appendChild(createToggle('ShowGames'));
              menuContainer.appendChild(createToggle('ShowBreakingNews'));
              menuContainer.appendChild(createToggle('ShowPosts'));
              menuContainer.appendChild(createToggle('ShowExploreMoreTopics'));
              menuContainer.appendChild(createToggle('ShowWhatDidYouThink'));

          menuContainer.appendChild(createLabel("Types of Videos", '10px'));
              menuContainer.appendChild(createToggle('ShowMusic'));
              menuContainer.appendChild(createToggle('ShowPlaylistsandPodcasts'));
              menuContainer.appendChild(createToggle('ShowNewToYouMessage'));
              menuContainer.appendChild(createToggle('ShowWatchedVideos'));
              menuContainer.appendChild(createToggle('ShowPurchasedVideos'));
              menuContainer.appendChild(createToggle('ShowFreeMovies'));
              menuContainer.appendChild(createToggle('ShowMemberOnly'));

      /*======================================================
       *        WATCH PAGE TOGGLES
       *======================================================*/
      menuContainer.appendChild(createLabel("Watchpage Toggles", '15px'));
          menuContainer.appendChild(createLabel("Core UI"));
              menuContainer.appendChild(createToggle('ShowRecommendations'));
              menuContainer.appendChild(createToggle('ShowBelow'));
              menuContainer.appendChild(createToggle('ShowComments'));
              menuContainer.appendChild(createToggle('ShowAI'));



      /*======================================================
       *        DEVELOPER TOGGLES
       *======================================================*/
      menuContainer.appendChild(createLabel("Developer Tool Toggles", '15px'))
          menuContainer.appendChild(createLabel("Experimental Toggles", '10px'));
              menuContainer.appendChild(createToggle('EnableBetterZoom'));
              menuContainer.appendChild(createToggle('EnableStreamerMode'));

          menuContainer.appendChild(createLabel("Console Logs", '10px'));
              menuContainer.appendChild(createToggle('DebugMode'));
              menuContainer.appendChild(createToggle('LogMetadata'));

        document.body.appendChild(menuContainer);
    }





    function initializeToggleButtons() {



        const initToggle = (toggleName, key, onChange, title, subtitle) => {
            const toggle = document.querySelector(toggleName);
            const toggleButton = toggle.querySelector('tp-yt-paper-toggle-button');
            toggleButton.checked = localStorage.getItem(key) !== 'false';

            toggleButton.addEventListener('change', () => {
                localStorage.setItem(key, toggleButton.checked);
                onChange();
            });

            const textEls = toggle.querySelectorAll('yt-formatted-string')
            const titleEl = textEls[0];
            const subtitleEl = textEls[2];

            toggle.querySelector('yt-img-shadow').remove();

            titleEl.parentElement.style.display = 'ruby';
            titleEl.removeAttribute('is-empty');
            titleEl.textContent = title;

            subtitleEl.removeAttribute('is-empty');
            subtitleEl.textContent = subtitle;
        }






        const inputField = (toggleName, key) => {   //This is really only for the WatchedPercent variable, so function might need a new 'default value' parameter
            let toggle = document.querySelector(toggleName);
            let toggleSubtitle = toggle.querySelector('#subtitle')
            let input = document.createElement("input");
            input.type = "number";
            input.id   = "maxWatchProgress";
            input.name = "maxWatchProgress";
            input.min  = "0";
            input.max  = "100";
            input.value = localStorage.getItem(key)
            if (input.value === "") {
                input.value = localStorage.setItem(key, 100)
            }
            input.addEventListener('change', () => {
                localStorage.setItem(key, input.value)
            });
            toggleSubtitle.appendChild(input);
        }

        //This is for example purposes
        if (debugMode) {
          initToggle('ShowToggle','ytt-show-toggle',()=>{showToggle=!showToggle,startToggleChecks()},"This is a title","This is a subtitle");


          //inputField('ShowToggle', 'ytt-show-toggle-field-variable');
        }

        initToggle('ShowPrimaryHeader',         'ytt-show-primary-header',        () => { showPrimaryHeader     = !showPrimaryHeader;       togglePrimaryHeader();                                            }, "Primary Header",   "Tag header above homepage recommendations"                   );
        initToggle('ShowGuide',                 'ytt-show-guide',                 () => { showGuide             = !showGuide;               toggleGuide();                                                    }, "Guide",            "The left side (Subscriptions, You, Explore, etc.)"          );
        initToggle('ShowBanner',                'ytt-show-banner',                () => { showBanner            = !showBanner;              toggleBanner();                                                   }, "Banners",          "Turns on Banner"                                             );


        initToggle('ShowRecommendations',       'ytt-show-recommendations',       () => { showRecommedations    = !showRecommedations;      toggleRecommendations();                                          }, "Recommendations",       "Turns on recommendations on videos watch pages"              );
        initToggle('ShowBelow',                 'ytt-show-below',                 () => { showBelow             = !showBelow;               toggleBelow();                                                    }, "Below Player",          "Turns on information below watch page player"                );
        initToggle('ShowComments',              'ytt-show-comments',              () => { showComments          = !showComments;            toggleComments();                                                 }, "Comments",              "Turns on comment section"                                    );
        initToggle('ShowAI',                    'ytt-show-ai',                    () => { showAI                = !showAI;                  getURL_id() === 0 ? startItemChecks() : toggleAI();               }, "AI Summmary",           "Turns on YouTube's 'AI' features (including buttons)"                                                 );



        initToggle('ShowShorts',                'ytt-show-shorts',                () => { showShorts             = !showShorts;              startShelfChecks();                                               }, "Shorts",                "Homepage Shorts"                                             );
        initToggle('ShowGames',                 'ytt-show-games',                 () => { showGames              = !showGames;               startShelfChecks();                                               }, "Playables",             "Homepage Games"                                              );
        initToggle('ShowBreakingNews',          'ytt-breaking-news',              () => { showBreakingNews       = !showBreakingNews;        startShelfChecks();                                               }, "Breaking News",         "Breaking News On"                                      );
        initToggle('ShowPosts',                 'ytt-show-posts',                 () => { showPosts              = !showPosts;               startShelfChecks();                                               }, "Creator Posts",         "Creator Posts On"                                      );
        initToggle('ShowExploreMoreTopics',     'ytt-show-explore-more-topics',   () => { showExploreMoreTopics  = !showExploreMoreTopics;   startShelfChecks();                                               }, "Explore More Topics",   "Explore Topics On"                                     );
        initToggle('ShowWhatDidYouThink',       'ytt-what-did-you-think',         () => { showWhatDidYouThink    = !showWhatDidYouThink;     startShelfChecks();                                               }, "Rating Videos",         "The 'What did you think of this video?' messages")



        initToggle('ShowMusic',                 'ytt-show-music',                 () => { showMusic             = !showMusic;               startItemBadgeChecks();                                           }, "Music",                 "Music in video format"                                       );
        initToggle('ShowPlaylistsandPodcasts',  'ytt-show-playlists',             () => { showPlaylists         = !showPlaylists;           startItemChecks();                                                }, "Playlists & Podcasts",  "Turns on Playlists & Podcasts"                               );
        initToggle('ShowNewToYouMessage',       'ytt-show-new-to-you',            () => { showNewToYou          = !showNewToYou;            startItemChecks();                                                }, "New To You Message",    "Turns on New To You Message"                                 );
        initToggle('ShowWatchedVideos',         'ytt-show-watched',               () => { showWatched           = !showWatched;             getURL_id() === 0 ? processVideos() : startVideoChecks();         }, "Watched Videos",        "(When off) Videos Above This Watch Percentage Are Hidden: "                                     );
            inputField('ShowWatchedVideos',         'ytt-max-watch-percent');

        initToggle('ShowPurchasedVideos',       'ytt-show-purchased',             () => { showPurchased         = !showPurchased;           startItemBadgeChecks();                                           }, "Purchased Videos",      "Turns on Purchased Videos"                                   );
        initToggle('ShowFreeMovies',            'ytt-show-free-movies',           () => { showFreeMovies        = !showFreeMovies;          getURL_id() === 0 ? startItemBadgeChecks() : startVideoChecks();  }, "Free Movies",           "Turns on Free Movies"                                        );
        initToggle('ShowMemberOnly',            'ytt-show-member-only',           () => { showMemberOnly        = !showMemberOnly;          startItemBadgeChecks();                                           }, "Member Only",           "Turns on Members Only Videos"                                );

        initToggle('EnableBetterZoom',          'ytt-enable-better-zoom',         () => { enableBetterZoom      = !enableBetterZoom;        getURL_id()===0&&enableBetterZoom?homepageZoomOn():homepageZoomOff();       }, "Better Zoon",           "Allows content to fill the screen better when zooming out"   );
                                                                                                                                            /*if (getURL_id() === 0 && enableBetterZoom) {homepageZoomOn();} else{homepageZoomOff();}*/
        initToggle('EnableStreamerMode',        'ytt-enable-streamer-mode',       () => { enableStreamerMode    = !enableStreamerMode;      toggleStreamerMode();                                             }, "Streamer Mode",         "Tries Removing Identifying Information (*not perfect*)");

        initToggle('DebugMode',                 'ytt-debug-mode',                 () => { debugMode             = !debugMode;                                                                                 }, "DebugMode",             "Console Logs more step by step function calling"             );
        initToggle('LogMetadata',               'ytt-logging',                    () => { enableLogging         = !enableLogging; processVideos();                                                            }, "LogMetadata",           "Console Logs videos metadata loading in the DOM"             );

    }



function clearLocalStorage() {
    localStorage.clear();
}


//function checkPerformance(fun) {
//    const startTime = performance.now()
//    fun();
//    const endTime = performance.now()
//    console.debug(`Call to ${fun.name} took ${endTime - startTime} milliseconds`)
//}
function checkPerformance(o){const n=performance.now();o();const e=performance.now();console.debug(`Call to ${o.name} took ${e-n} milliseconds`)}



    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }





  /*
  TOGGLE CALLERS
  */

      function defaultCalls() {
          toggleStreamerMode();
          toggleUIChecks(); //checks homepage versus watchpage
      }





      function homepageCalls() {
          togglePrimaryHeader();
          toggleGuide();
          toggleBanner();
          checkItemsPerRow();
          processVideos();
          startShelfChecks();
          startItemChecks();
          startItemBadgeChecks();
      }

      function watchpageCalls() {
          startVideoChecks();
      }

      function channelpageCalls() {

      }

      function debugCalls() {
        startToggleChecks();
      }




  /*
   *
   * STARTUP FUNCTIONS
   *
  */

    function startObservers() {
        console.log("Observers Started");
        try {
            const observer = new MutationObserver(() => {
                let currentURL = document.URL;
                defaultCalls();

                if (currentURL === "https://www.youtube.com/" || currentURL === "https://www.youtube.com/?bp=wgUCEAE%3D") {
                    homepageCalls();
                    //checkPerformance(homepageCalls);
                }
                else if (currentURL.startsWith("https://www.youtube.com/watch?v=")) {
                    watchpageCalls();
                }
            });
            //observer.observe(document.body, { childList: true, subtree: true });
            observer.observe(document.querySelector('ytd-app'), { childList: true, subtree: true });



        } catch(e) {
            console.error("observers failed: ",e," retrying...");
            startObservers();
        } //restart observers
    }


  function tryClone() {
      const vsb_shape_svg = document.querySelector('#voice-search-button yt-button-shape svg');//document.querySelector('#voice-search-button').querySelector('yt-button-shape').querySelector('svg');
      if (vsb_shape_svg) {
          vsb_shape_svg.cloneNode(false);
          return true;
      }
      return false;
  }

  function tryCloneObserver() { //The observer will only disconnect when tryClone() returns true
      const observer = new MutationObserver(() => {
        if (tryClone()) {
          observer.disconnect();
          createMenuButton();
          console.log("script button created");
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
  }


  function main() {
      tryCloneObserver();
      startObservers();
  }



  document.addEventListener('DOMContentLoaded', function () {
      console.log("script started");
      main();
  });



})();
