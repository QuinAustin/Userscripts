// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.1.7
// @description  Allows hiding a variety of YouTube webpage elements
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
 * for 1.1.7
   *  Summary:
   *    collapsible menu 
   *  Fixes:
   *    none
   *  Removals:
   *    unused functions, or replaced functions that do a similar thing
   *  Additions:
   *    guide sidebar is now able to have more things removed
   *  Changes:
 * /    child buttons are now collapsible when clicking on the parent button's text


/*
Known Issues:
-When Guide is turned off, if the first video in a row is under the location where the Guide WOULD be, the video will not autoplay.
  *Temporary Solution: Turning the Guide back on, OR zoom out so the video is no longer under where the Guide's area would be.

-GetMetadata() function is not able to parse every type of media yet. This means some toggles might not always work.
*/




(function() {
    'use strict';
    //function checkPerformance(fun) {
    //    const startTime = performance.now()
    //    fun();
    //    const endTime = performance.now()
    //    console.debug(`Call to ${fun.name} took ${endTime - startTime} milliseconds`)
    //}
    function checkPerformance(o){
      const n=performance.now();
      o();
      const e=performance.now();
      console.debug(`Call to ${o.name} took ${e-n} milliseconds`);
    }
    function checkPerformance1Arg(o, arg1){
      const n=performance.now();
      o(arg1);
      const e=performance.now();
      console.debug(`Call to ${o.name} took ${e-n} milliseconds`);
    }

    function keyAsBool(keyName) {
      if (localStorage.getItem(keyName) === "true") {
        return true;
      }
      return false;
    }

    function declareKey(keyName, defVal) {
      if (localStorage.getItem(keyName) === null) { //key is not in storage
          localStorage.setItem(keyName, defVal); //key is set to a default value
      }
      return keyAsBool(keyName); //return the value of the key as a boolean
    }

    function flipKey(keyName) {
      const val = localStorage.getItem(keyName); //string "true"
      if (val === "true") {
        localStorage.setItem(keyName, "false");
      }
      else {
        localStorage.setItem(keyName, "true");
      }
    }



/*
 *  Guide for making a new toggle:
 *  1. add a variable in the section below this guide
 *  2. go to the function 'BuildMenuContainer(menuContainer)'
    3. find the appropriate place in the menu, and add a new toggle with all the parameters filled in
    4.
 */

  //This is for example purposes
    let showToggle            = declareKey('ytt-show-toggle', false);
//Core UI
/*======================================================
*        GLOBAL TOGGLES
*======================================================*/
    let showCountryCode         = declareKey('ytt-show-country-code'  , true);
    let showAI                  = declareKey('ytt-show-ai'            , true);
    let showEndButtons          = declareKey('ytt-show-end-buttons'   , true);
        let showCreateButton        = declareKey('ytt-show-create-button' , true);
        let showNotifications       = declareKey('ytt-show-notifications' , true);
        let showPfp                 = declareKey('ytt-show-pfp'           , true);
/*======================================================
*        HOME PAGE TOGGLES
*======================================================*/
    let showPrimaryHeader       = declareKey('ytt-show-primary-header'            , true);
    let showGuide               = declareKey('ytt-show-guide'                     , true);
        let showShortsButton         = declareKey('ytt-show-shorts-button'        , true);
        let showSubscriptionsSection = declareKey('ytt-show-subscriptions-section', true);
        let showYouSection           = declareKey('ytt-show-you-section'          , true);
        let showExploreSection       = declareKey('ytt-show-explore-section'      , true);
        let showFromYouTubeSection   = declareKey('ytt-show-from-youtube-section' , true);
        let showReportHistoryButton  = declareKey('ytt-show-report-history-button', true);
        let showFooterSection        = declareKey('ytt-show-Footer-Section'       , true);





//Blocks of Content
    let showBanner              = declareKey('ytt-show-banners'             , true);
    let showShorts              = declareKey('ytt-show-shorts'              , true);
    let showGames               = declareKey('ytt-show-games'               , true);
    let showBreakingNews        = declareKey('ytt-breaking-news'            , true);
    let showPosts               = declareKey('ytt-show-posts'               , true);
    let showExploreMoreTopics   = declareKey('ytt-show-explore-more-topics' , true);
    let showWhatDidYouThink     = declareKey('ytt-what-did-you-think'       , true);

//Types of Videos
    let showMusic               = declareKey('ytt-show-music'       , true);
    let showPlaylists           = declareKey('ytt-show-playlists'   , true);
    let showNewToYou            = declareKey('ytt-show-new-to-you'  , true);
    let showWatched             = declareKey('ytt-show-watched'     , true);
    let showPurchased           = declareKey('ytt-show-purchased'   , true);
    let showFreeMovies          = declareKey('ytt-show-free-movies' , true);
    let showMemberOnly          = declareKey('ytt-show-member-only' , true);
    let showSponsored           = declareKey('ytt-show-sponsored'   , true);
    let showLivestreams         = declareKey('ytt-show-livestreams' , true);
    let showStreamed            = declareKey('ytt-show-streamed'    , true);
/*======================================================
*        WATCH PAGE TOGGLES
*======================================================*/
//Core UI
    let showRecommedations      = declareKey('ytt-show-recommendations'        , true);
    let showEndScreenVideos     = declareKey('ytt-show-end-screen-videos'      , true);
    let showBelow               = declareKey('ytt-show-below'                  , true);
        let showDescription         = declareKey('ytt-show-description'            , true);
        let showMerchStore          = declareKey('ytt-show-merch-store'            , true);
        let showComments            = declareKey('ytt-show-comments'               , true);
            let showCommentingField     = declareKey('ytt-show-commenting-field'       , true);
            let showReplyButton         = declareKey('ytt-show-reply-button'           , true);

/*======================================================
*        DEVELOPER TOGGLES
*======================================================*/
//Developer Tool Toggles
    //let debugMode               = declareKey('ytt-debug-mode'                     , false);
    let enableBetterZoom        = declareKey('ytt-enable-better-zoom'             , false);
    let enableStreamerMode      = declareKey('ytt-enable-streamer-mode'           , false);
    let showLabsFeature         = declareKey('ytt-show-labs-feature'              , false);
    let enableLogging           = declareKey('ytt-logging'                        , false);
    let enableExperimental      = declareKey('ytt-enable-experimental'            , false);






    /*
    HELPER FUNCTIONS
    */

    function toggleQuerySelector(e,t){const o=document.querySelector(e);o&&(o.style.display=t)}
    function hideQuerySelector(e,t){const o=document.querySelector(e);o&&(o.hidden=t)} //checks if element exists before hiding it


  //if child 0 is hidden and child 1 is not, child 1 will become child 0. use style.display = '':'none'

  //function hideQuerySelectorChild(e,n,t){const o=document.querySelector(e);if(o){const e=o.children[n];e&&(e.hidden=n)}}
   // function hideQuerySelectorChild(element, number, toggle) {
   //   const selector = document.querySelector(element);
   //   if (selector) {
   //       const child = selector.children[number]
   //       if (child) {
   //         child.hidden = toggle;
   //       }
   //   }
   // }

  function toggleQuerySelectorChild(e,n,t) {
    const selector = document.querySelector(e);
    if (selector) {
      const child = selector.children[n];
      if (child) {
        child.style.display = t ? 'none' : '';
      }
    }
  }

    function hideQuerySelectorAll(element,toggle) {
      document.querySelectorAll(element).forEach(query => {
        query.hidden = toggle;
      })
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
        const url = document.URL;
        //console.info("current url: ",url);
        if (url === "https://www.youtube.com/" || url === "https://www.youtube.com/?bp=wgUCEAE%3D") { //Homepage || Event Homepage
            return 0;
        }
        else if (url.startsWith("https://www.youtube.com/watch?v=")) { //Video Link
            return 1;
        }
        else if (url.startsWith("https://www.youtube.com/results?search_query=")) { //Search Page
            return 2;
        }
        else if (url.startsWith("https://www.youtube.com/@") || url.startsWith("https://www.youtube.com/channel/")) {  //A Channel Page || A Collab Video Link that has redirected to a Channel Page
          return 3;
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

/*
  function StopRecommendingChannelButton(video) {
      const drc = video.querySelector("yt-list-item-view-model.ytListItemViewModelHost:nth-child(7) > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)")
      if (drc) { //don't recommend channel button
          if (drc?.textContent === "Don't recommend channel") {
              video.querySelector("")
          }
      }
  }
*/


  function toggleLabsFeature() {
      //This is blocking channels

      /*
       * get the channel name attached to video element
       * compare channel name against list of blocked channel names
       * if channel name is blocked, hide video
       *
       * check blocked channel expiration time (the idea here would be that channels get blocked for around a week, that way it has time to cycle out, without having to think about removing them)
       *    this could potentially have further storage of a blocked counter, i.e this channel was blocked a second time, lets increase the expiration to 1 month. so 1st time = 1 week, 2nd time = 1 month, 3 times = one year (maybe less)

       * other idea, a dedicated one click button to send the "don't recommend channel" button
       */
  }



    function getContents() { //To solve issues pertaining to redirects
        try {
            let url = getURL_id();
            switch (url) {
              case 0: //Homepage
                return document.querySelector('ytd-rich-item-renderer').parentElement;
              break;
              case 1: //Watchpage
                return document.querySelector('#secondary yt-lockup-view-model').parentElement;
                //return document.querySelector('yt-lockup-view-model').parentElement;
              break;
              default:
                console.info("Url not used in GetContents: ",url);
              break;
            }
        } catch(e) {
            console.warn("Failed to getURL_id()")
            setTimeout(getContents, 50)
        }
    }



    function getZoomOut() {
        return ((100 - Math.round(window.devicePixelRatio * 100 ) ) / 10); //i.e. 100% returns 0, 90% returns 1, ..., 30% returns 7
    }


    function togglePrimaryHeader(){const e=document.querySelector("ytd-feed-filter-chip-bar-renderer");e&&(e.parentElement.style.display=showPrimaryHeader?"":"none",document.querySelector("#frosted-glass").style.height=showPrimaryHeader?"112px":"80px")}
    function toggleGuide(){const e=document.querySelector("#guide");e&&(e.style.display=showGuide?"":"none",setElementProperty(document.querySelector("#content"),"--ytd-persistent-guide-width",showGuide?"240":"0","px"))}


    function toggleBelow(){hideQuerySelector("#below",!showBelow)}
    function toggleRecommendations()  {
      if (!enableStreamerMode) { //disabled by streamer mode
          hideQuerySelector("#related",!showRecommedations)
      }
    }
    function toggleEndScreenVideos(){
      hideQuerySelector(".ytp-fullscreen-grid-stills-container",!showEndScreenVideos)
      hideQuerySelectorAll('.ytp-ce-video', !showEndScreenVideos)
    }
    function toggleComments(){hideQuerySelector("#comments",!showComments)}


    function toggleAskYouTube() {
        const askButton = document.querySelector('#center button')
        if (askButton) {
            if(askButton?.textContent === "Ask YouTube") {
                askButton.hidden = !showAI;
            }
            const text = document.querySelector('#center textarea')
            if (text.placeholder == "Search or ask a question") {
                text.placeholder = "Search";
            }
        }
    }


    function toggleAI() {
        if (getURL_id() === 0) {
            toggleAskYouTube();
        }

        else {
            const buttons = document.querySelectorAll('#flexible-item-buttons .ytSpecButtonShapeNextHost'); //Next to Save button
            const enabled = showAI ? '' : 'none';
            buttons.forEach(query => {
                if (query.textContent === "Ask") {
                    query.style.display = enabled;
                }
            })


            //Not Needed Anymore - Initially commented as it was hiding the report button on comments. Upon further investigation the gemini button was no longer in the location, so it will be left commented.
            //
            //toggleQuerySelector('ytd-menu-service-item-renderer', enabled); //gemini button in the video's 3 dot button's submenu [right of the share button] p.s. this gets unhidden every time the menu is reopened, so it needs a display change


            toggleQuerySelector('#video-summary',enabled) //AI summary in video descriptions
            toggleQuerySelector('yt-video-description-youchat-section-view-model',enabled) //gemini button in video description (pulls up a chat window)
            toggleQuerySelector('.you-chat-entrypoint-button',enabled)                     //gemini button in the video player (pulls up a chat window)
        }
    }

    function toggleUIChecks() {
        let url = getURL_id();

        if (url === 0) { //Check that the user is on the Homepage
            //toggleBanner();
            togglePrimaryHeader();
            checkGuideSection();
            toggleAI();
        }
        else if(url === 1) { //Check that the user is on a Watchpage
            toggleBelow();
            toggleRecommendations();
            toggleEndScreenVideos();
            toggleComments();
            toggleAI();
        }
    }


    //function togglePrimaryHeader() {
    //    const primaryHeader = document.querySelector('ytd-feed-filter-chip-bar-renderer');
    //    if (primaryHeader) {
    //        primaryHeader.parentElement.style.display = showPrimaryHeader ? '' : 'none';
    //        document.querySelector('#frosted-glass').style.height = showPrimaryHeader ? '112px' : '80px';
    //    }
    //}
//
    //function toggleGuide() {
    //    const guide = document.querySelector('#guide');
    //    if (guide) {
    //      guide.style.display = showGuide ? '' : 'none';
    //      setElementProperty(document.querySelector('#content'), '--ytd-persistent-guide-width', showGuide ? '240' : '0', 'px');
    //    }
    //}


    function toggleBanner() {
      let banner = document.querySelector("ytd-statement-banner-renderer");
      if (banner) {
          banner.hidden = !showBanner;
          let bp = banner.parent
          if (bp) {
            bp.hidden = !showBanner;
          }
      }
    }


    function startShelfChecks() {
        try {
            toggleBanner();
            const container = getContents();
            if (container) {
                container.querySelectorAll('ytd-rich-section-renderer').forEach(query => {
                    let title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                    let title2 = query.querySelector('span')?.textContent.toLowerCase();
                    //let title2 = query.querySelector('.yt-shelf-header-layout__title')?.textContent.trim().toLowerCase();
                    //let title3 = query.querySelector('yt-shelf-header-layout')?.textContent.toLowerCase();

                const checkTitle = (text) => {
                    switch(text) {
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
                        case 'free primetime movies':
                            query.style.display = showFreeMovies ? '' : 'none';
                        break;
                        case 'get more from memberships':
                            query.style.display = showMemberOnly ? '' : 'none';
                        break;

                        default:
                            if (enableLogging && !query.dataset.logged) {
                                console.info({
                                    query,
                                    text
                                });
                                query.dataset.logged = "true";
                            }
                        break;
                    }
                }
                checkTitle(title)
                checkTitle(title2)
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
                //video recommendation prompt that takes over a video spot to say "new to you"
                const title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                if (title === 'looking for something different?') {
                    query.style.display = showNewToYou ? '' : 'none';
                }
            });
        }
    }


    function toggleMembersOnly() {
        if (getURL_id() === 0) {
            startShelfChecks(); //removes 'get more from memberships' shelf on the homepage
        }
        startItemChecks();  //removes 'members only' tagged videos
    }



    function autoJumpAhead() {
      const ja = document.querySelector('.ytwTimelyActionViewModelHost > button-view-model:nth-child(1) > button:nth-child(1)');
      if (ja) { //if it is not showing on the player, this element does not exist
        ja.click();
      }
    }


    function toggleShowWatched() {
        getURL_id()===0 ? processVideos() : startVideoChecks();
    }


    function convertStringToNumber(num) {
        if (num.isInteger) {
            return num;
        }
        if (num.includes("K")) {
            return parseFloat(num) * 1e3;
        }
        if (num.includes("M")) {
            return parseFloat(num) * 1e6;
        }
        if (num.includes("B")) {
            return parseFloat(num) * 1e9;
        }
        return parseFloat(num);
    }


    function getMetadata(video) {
        //console.debug(video);
        const url           = video.querySelector(".ytLockupMetadataViewModelTitle");
        let title;
        try {
            title = video.querySelector("span").textContent;   //video.querySelector(".ytLockupMetadataViewModelHeadingReset").title;
        } catch { //Purchased media do this
            title = video.querySelector('#video-title-link').textContent
        }
        const otherMetadata = video.querySelectorAll(".ytContentMetadataViewModelMetadataRow");
        let channel;
        let views;
        let date;
        const duration = video.querySelector(".ytBadgeShapeText")?.textContent.trim();


        if (otherMetadata.length > 1) {
            try {
                channel = otherMetadata[0].textContent;

                if (duration == "LIVE") { //LIVE Video, does not use same nodes as normal videos
                    views = otherMetadata[1].children[0].textContent;
                }
                else {
                  switch (getURL_id()) {
                      case 0:
                          views = otherMetadata[1].children[0].textContent;
                          date  = otherMetadata[1].children[2].textContent;
                          break;
                      case 1:
                          views = otherMetadata[1].children[1].textContent;
                          date  = otherMetadata[1].children[3].textContent;
                          break;
                  }
                }
            }
            catch { //can occasionally fail to filter.
                console.warn({video, otherMetadata})
            }
        }
        //old locaiton of duration -> <-
        let   progress = video.querySelector(".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment");
        progress = progress ? progress.style.width : "0%"
        return({url, title, channel, views, date, duration, progress});
    }




    function startVideoChecks() {
        //Videos: 'yt-lockup-view-model'
        //Shorts: 'ytd-reel-shelf-renderer'
        //Movies: 'ytd-compact-movie-renderer'
        const container = getContents();
        try {
            if (container) {
                container.querySelectorAll('yt-lockup-view-model').forEach(query => {
                    let video = getMetadata(query);
                    if (enableLogging && !query.dataset.logged) {
                        console.info(video);
                        query.dataset.logged = "true";
                    }
                    let progressBlocked = false;
                    if (parseFloat(video.progress) >= localStorage.getItem('ytt-max-watch-percent')) { //conditions are met, check if it needs to be blocked
                        query.style.display = showWatched ? '' : 'none';
                        progressBlocked = true;
                    }
                    if (video.date.includes("Streamed") && (convertStringToNumber(video.views) < localStorage.getItem('ytt-streamed-value'))) { //was Streamed, and has low views
                        query.style.display = showStreamed ? '' : 'none';
                    }
                    else if (!progressBlocked) { //conditions not met, unblock it, unless it was already blocked by progress
                        query.style.display = '';
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
                    if (false) { //debugMode) {
                        console.info('badgeTextAll: ', {badgeTextAll});
                        console.info('badgeTextAll[0]: ', badgeTextAll[0]?.textContent.trim().toLowerCase());
                        console.info('badgeTextAll[1]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());
                        console.info('badgeTextAll[2]: ', badgeTextAll[2]?.textContent.trim().toLowerCase());

                        console.info('badgeIcon: ', badgeIcon);
                        console.info('badgeRenderer: ', badgeRenderer);
                    }
                    if (badgeTextAll[1]) {
                        console.info("badgeTextAll[1] found");
                        //showFreeMovies
                        if (badgeTextAll[1]?.textContent.trim().toLowerCase().startsWith('free')) {
                            query.style.display = showFreeMovies ? '' : 'none';
                        }
                    }
                });
            }
        }catch(e) {}
    }




    function processVideos() {
        const contents = getContents();
        if (contents) {
            const items = contents.querySelectorAll('ytd-rich-item-renderer');
            items.forEach(item => {
                //if (item.hasAttribute("is-shelf-item")) {
                //    return; //ignoring shelf items for now like shorts (these also have no href associated, so it gets checked first)
                //}
                //if (item.querySelector(".ytLockupMetadataViewModelTitle").href.endsWith("radio=1")) {
                //    return; //ignoring music videos for now
                //}


                let video = getMetadata(item);
                if (enableLogging && !item.dataset.logged) {
                    console.info(video);
                    item.dataset.logged = "true";
                }


                if (video.date) { //filters out shorts, which don't return a date
                    let progressBlocked = false;
                    if (parseFloat(video.progress) >= localStorage.getItem('ytt-max-watch-percent')) { //conditions are met, check if it needs to be blocked
                        item.style.display = showWatched ? '' : 'none';
                        progressBlocked = true;
                    }
                    if (video.date.includes("Streamed") && (convertStringToNumber(video.views) < localStorage.getItem('ytt-streamed-value'))) { //was Streamed, and has low views
                        item.style.display = showStreamed ? '' : 'none';
                    }
                    else if (!progressBlocked) { //conditions not met, unblock it, unless it was already blocked by progress
                        item.style.display = '';
                    }
                }
            });
        }
    }



    function startItemBadgeChecks() {
        //const container = document.getElementById('contents');
        const container = getContents();//document.querySelector('ytd-rich-item-renderer').parentElement
        const url = getURL_id();

        //if (url === 0) {
        let videoSelector = "ytd-rich-item-renderer";
        //}
        if (url === 1) {
          videoSelector = 'yt-lockup-view-model';
        }
        if (container) {
            container.querySelectorAll(videoSelector).forEach(query => {
                const badgeTextAll  = query.querySelectorAll('.ytBadgeShapeText');
                const badgeIcon     = query.querySelector('.ytBadgeShapeIcon'); //this badge appears to the left of the duration
                const badgeRenderer = query.querySelector('ytd-badge-supported-renderer p'); //@Deprecated
                let iconPathStart = "xx";

                if (badgeIcon !== null) {
                    try {
                        iconPathStart = badgeIcon.querySelector('path').getAttribute('d').substring(0,2);
                    } catch(e){}
                }

               //if (false) { //debugMode) {
               //    console.info('badgeTextAll: ', {badgeTextAll});
               //    console.info('badgeTextAll[0]: ', badgeTextAll[0]?.textContent.trim().toLowerCase());
               //    console.info('badgeTextAll[1]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());
               //    console.info('badgeTextAll[2]: ', badgeTextAll[2]?.textContent.trim().toLowerCase());
               //    console.info('badgeTextAll[3]: ', badgeTextAll[3]?.textContent.trim().toLowerCase());
               //
               //    console.info('badgeIcon: ', badgeIcon);
               //    console.info('badgeRenderer: ', badgeRenderer);
               //}


                const checkBadge = (text) => {
                  text = text?.textContent.trim().toLowerCase()
                  switch(text) {
                    case 'mix': //mix: M3 3.657v16.689a1 1 0 001.466.883L8 19.369V4.632l-3.534-1.86A1 1 0 003 3.657ZM14 7.79l-4-2.105v12.631l4-2.106V7.79ZM22 12l-6-3.157v6.315L22 12Z
                        query.style.display = showMusic ? '' : 'none';
                        break;
                    case 'sponsored':
                        query.style.display = showSponsored ? '' : 'none';
                        break;
                    case 'members only':  //youtube featured badge can take place of members only apparently?
                        query.style.display = showMemberOnly ? '' : 'none';
                        break;
                    case 'members first':
                        query.style.display = showMemberOnly ? '' : 'none';
                        break;
                    case 'free':
                        query.style.display = showFreeMovies ? '' : 'none';
                        break;
                    case "free with ads":
                        query.style.display = showFreeMovies ? '' : 'none';
                        break;
                    case "purchased":
                        query.style.display = showPurchased ? '' : 'none';
                        break;
                    case "live":
                        query.style.display = showLivestreams ? '' : 'none';
                    case undefined:
                        break;
                    case "": //<empty string>
                        break;
                    default:
                        if (text.includes(":") === false) { //timestamp
                          //if (text.includes("tv-14", "tv-pg", "tv-g", "tv-ma", "g", "pg", "r", "unrated") === false) { //still a movie/show
                              //console.log("new badge not accounted for: ", text);
                          //}
                        }
                  }
                }
                //badgeTextAll.forEach(badge => {
                for (const badge of badgeTextAll) {
                  if (checkBadge(badge) === true) {
                    break;
                  }
                }


                switch (iconPathStart) { //note: M5.5 1.383V6.88a2.25 2.25 0 101 1.871V4.6l2.743 1.647a.5.5 0 00.757-.43V3.485a.5.5 0 00-.243-.429l-3.5-2.1a.5.5 0 00-.757.427Z
                    case ('M5'):
                        query.style.display = showMusic ? '' : 'none';
                        break;
                }

            });
        }
    }



  //new toggles

  /*
   *
   *
   * toggle createButton //this one makes sense, because most people will never use this
   * toggle MerchStore //People complain about this showing up
   * the rest can probably stay for now under the streamerMode
   *
   *
   *
   *
  */




    function toggleCountryCode() {
      if (!enableStreamerMode) {
          hideQuerySelector('#country-code', !showCountryCode);
      }
    }

    function toggleCreateButton() {
      if (!enableStreamerMode) {
          toggleQuerySelectorChild('#end #buttons', 0, !showCreateButton);
      }
    }
    function toggleNotificationButton() {
      if (!enableStreamerMode) {
          toggleQuerySelectorChild('#end #buttons', 1, !showNotifications);
      }
    }
    function togglePFP() {
      if (!enableStreamerMode) {
          toggleQuerySelectorChild('#end #buttons', 2, !showPfp);
      }
    }
    function toggleEndButtons() {
      if (!enableStreamerMode) {
          document.querySelector('#end #buttons').hidden = !showEndButtons;
      }

    }


    function toggleShortsButton() {
        document.querySelectorAll('ytd-guide-section-renderer')[0].children[1].children[1].hidden = !showShortsButton;
    }
    function toggleSubscriptionsSection() {
        if (!enableStreamerMode) {
            document.querySelectorAll('ytd-guide-section-renderer')[1].hidden = !showSubscriptionsSection;
        }
    }
    function toggleYouSection() {

        document.querySelectorAll('ytd-guide-section-renderer')[2].hidden = !showYouSection;
    }
    function toggleExploreSection() {
        document.querySelectorAll('ytd-guide-section-renderer')[3].hidden = !showExploreSection;
    }
    function toggleFromYouTubeSection() {
        document.querySelectorAll('ytd-guide-section-renderer')[4].hidden = !showFromYouTubeSection;
    }
    function toggleReportHistoryButton() {
        document.querySelectorAll('ytd-guide-section-renderer')[5].hidden = !showReportHistoryButton;
    }
    function toggleFooterSection() {
        document.querySelector('ytd-guide-renderer #footer').hidden = !showFooterSection;
    }






    function checkGuideSection() {
        toggleGuide();
        toggleShortsButton();
        toggleSubscriptionsSection();
        toggleYouSection();
        toggleExploreSection();
        toggleFromYouTubeSection();
        toggleReportHistoryButton();
        toggleFooterSection();
    }











    function toggleMerchStore() {
        if (!enableStreamerMode) { //disabled by streamer mode
            //document.querySelector('ytd-merch-shelf-renderer').hidden = !showMerchStore;
            hideQuerySelectorAll('ytd-merch-shelf-renderer', !showMerchStore);
        }
    }

    function toggleCommentingField() {
        if (!enableStreamerMode) {  //disabled by streamer mode
            //document.querySelector('ytd-comment-simplebox-renderer').hidden = !showCommentingField;
            hideQuerySelector('ytd-comment-simplebox-renderer', !showCommentingField);
        }
    }
    function toggleReplyButton() { //NO TOGGLE EXISTS FOR THIS YET
        if (!enableStreamerMode) {
            //document.querySelector('#reply-button-end').hidden = false;//!showReplyButton;
            hideQuerySelectorAll('#reply-button-end', !showReplyButton);
        }

    }







    function setItemsPerRow(number) {
                const container = document.querySelector('ytd-rich-grid-renderer');
                if (container) {
                    container.style.setProperty('--ytd-rich-grid-items-per-row', (number));
                }

                //shelfs seem to make their own properties, or they have a different parent that was not found, so each shelf is checked
                const container2 = document.querySelectorAll('ytd-rich-shelf-renderer');
                if (container2) {
                    container2.forEach(query => {
                        query.style.setProperty('--ytd-rich-grid-items-per-row', (number));
                        //console.debug(query.style.getPropertyValue('--ytd-rich-grid-items-per-row'));
                    });
                }



                //document.documentElement.style.fontSize = (10 + difference*2) + "px";
    }

    function resetItemsPerRow() {
        const container = document.querySelector('ytd-rich-grid-renderer');
        if (container) {
            container.style.setProperty('--ytd-rich-grid-items-per-row', container.elementsPerRow); //elementsPerRow is a YouTube specific attribute
            console.debug("elements per row: ", container.elementsPerRow)
            //container.style.setProperty('--ytd-rich-grid-items-per-row', '');
        }
        const container2 = document.querySelectorAll('ytd-rich-shelf-renderer');
        if (container2) {
            container2.forEach(query => {
                query.style.setProperty('--ytd-rich-grid-items-per-row', (6));
                console.debug("property value: ", Math.round(container.style.getPropertyValue('--ytd-rich-grid-items-per-row')*1.5));
            });

        }
    }

    function toggleExperimental() {
        //console.debug("experimental toggle flipped", enableExperimental);
        const value = localStorage.getItem('ytt-experimental-value');
        //console.debug("experimental value: ", value);
        if (enableExperimental) {
            setItemsPerRow(value);
        }
        else {
            resetItemsPerRow();
        }
    }





    /*Streamer mode disables the following toggles from working
     *
     * toggleMerchStore
     * toggleRecommendations
     *
     *
     *
    */



    function toggleStreamerMode() {
        const enabled = enableStreamerMode ? 'none' : '';
            try {



                //Top Priority | The page loading is enough to see it
                enabled?toggleGetElementById('country-code', enabled):toggleCountryCode();                           //toggle users country abbreviation on the top left YouTube logo | reveals location of user
                enabled?toggleQuerySelector('#end #buttons', enabled):toggleEndButtons();                            //toggle user profile picture (as well as create button and notifications) | profile picture is the only reason for such a high priority
                enabled||(toggleCreateButton(),toggleNotificationButton(),togglePFP());


                enabled?toggleQuerySelector('ytd-guide-section-renderer:nth-child(2)', enabled):toggleGuide(); //toggle subscriptions on the left side menu on the homepage | Subscriptions can reveal channels that are either local to where a user lives, or talk about personal topics and beliefs



                //Medium Priority | User has to give input (scrolling) to see it



                if (getURL_id() === 1) { //WATCHPAGE ONLY
                    //MERCH STORE
                    //enabled?document.querySelector('ytd-merch-shelf-renderer').hidden=enabled:toggleMerchStore();
                    enabled?hideQuerySelectorAll('ytd-merch-shelf-renderer', enabled):toggleMerchStore(); //at least two different store elements




                    //RECOMMENDATIONS
                    //enabled?document.querySelector('#related').hidden=enabled:toggleRecommendations();
                    enabled?hideQuerySelector('#related', enabled):toggleRecommendations();
                    //COMMENTING
                    //enabled?document.querySelector('ytd-comment-simplebox-renderer').hidden=enabled:toggleCommentingField(); //toggleQuerySelector('ytd-comment-simplebox-renderer', enabled);          //toggle Commenting Under Videos | reveals profile picture, and name if something is submitted
                    enabled?hideQuerySelector('ytd-comment-simplebox-renderer', enabled):toggleCommentingField();
                    //REPLY BUTTON
                    enabled?hideQuerySelector('#reply-button-end', enabled):toggleReplyButton();
                    //toggleQuerySelectorAll('#reply-button-end', enabled);                    //remove reply button in comments | reveals profile picture, and name if something is submitted
                }


                //Low Priority | User has to hover or click something outside of common areas to see it


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
                console.debug(e);
                setTimeout("streamer mode failed...retrying",toggleStreamerMode, 50);
            }
    }


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



    function toggleBetterZoom() {
      getURL_id()===0&&enableBetterZoom?homepageZoomOn():homepageZoomOff();
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
        menu.hidden = !menu.hidden;

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



    function createMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.style.position        = 'fixed';    //stays on screen (messes up when zooming in and out)
        menuContainer.style.backgroundColor = '#282828';
        menuContainer.style.color           = '#f1f1f1';
        menuContainer.style.padding         = '10px';
        menuContainer.hidden = true;
        menuContainer.style.zIndex          = '9999';
        menuContainer.style.whiteSpace      = 'nowrap';
        menuContainer.style.flexDirection   = 'column';
        menuContainer.style.borderRadius    = '10px'; //more curved edges
        menuContainer.style.userSelect      = 'none'; //no highlighting text
        menuContainer.style.overflow        = 'scroll';
        menuContainer.style.maxWidth        = '30%';
        menuContainer.style.maxHeight       = '50%';
        menuContainer.style.clipPath        = 'inset(0px round 10px)';
        //menuContainer.style.resize = 'both'; //does not work
        return menuContainer;
    }



  //======================================================================================================


    function createBaseToggleButton(toggleName) {
        let toggle = document.createElement(toggleName);
        toggle.id="options"
        toggle.className="style-scope ytd-settings-options-renderer"
        toggle.style.marginLeft = '5px'; //was 25px
        let ytd_settings_switch_renderer = document.createElement('ytd-settings-switch-renderer');
        ytd_settings_switch_renderer.className = "style-scope ytd-settings-options-renderer";
        ytd_settings_switch_renderer.style.margin = '0px';
        toggle.appendChild(ytd_settings_switch_renderer);
        return toggle;
    }

    function createInitialzedToggleButton(toggleName, key, onChange, text, tooltip) {
        const toggle = document.querySelector(toggleName);
        const toggleButton = toggle.querySelector('tp-yt-paper-toggle-button');
        toggleButton.checked = localStorage.getItem(key) === "true";

        toggleButton.addEventListener('change', (e) => {
            //e.stopPropagation();
            //e.preventDefault();
            localStorage.setItem(key, toggleButton.checked);
            onChange();
        });

        const textEls = toggle.querySelectorAll('yt-formatted-string');
        const titleEl = textEls[0];
        //const subtitleEl = textEls[2];

        toggle.querySelector('yt-img-shadow').remove();

        titleEl.parentElement.style.display = 'ruby';
        titleEl.removeAttribute('is-empty');
        titleEl.textContent = text;

        //subtitleEl.removeAttribute('is-empty');
        //subtitleEl.textContent = subtitle;

        titleEl.title = tooltip;
    }

    function addToggle(menu, toggleName, key, onChange, text, tooltip) {
        let button = createBaseToggleButton(toggleName);
        menu.append(button);
        createInitialzedToggleButton(toggleName, key, onChange, text, tooltip);
    }

    function createBaseToggleButtonChild(toggleName) {
        let childToggle = document.createElement(toggleName);
            childToggle.id="options"
            childToggle.className="style-scope ytd-settings-options-renderer"
            childToggle.style.marginLeft = '20px'; //was 25px
        let ytd_settings_switch_renderer = document.createElement('ytd-settings-switch-renderer');
            ytd_settings_switch_renderer.className = "style-scope ytd-settings-options-renderer";
            ytd_settings_switch_renderer.style.margin = '0px';

        childToggle.appendChild(ytd_settings_switch_renderer);
        return childToggle;
    }

    function addToggleChild(parentToggleName, menu, toggleName, key, onChange, text, tooltip) {

        let childButton = createBaseToggleButtonChild(toggleName);
        menu.append(childButton);

        let parentButton = document.querySelector(parentToggleName);

        if (parentButton.childElementCount == 1) { //Creates a container for child toggles to be stored
            let parentText = parentButton.querySelectorAll('yt-formatted-string')[0].textContent


            let childSection = document.createElement("ytt-"+parentToggleName+"-child-section")
            parentButton.appendChild(childSection);
            parentButton.querySelectorAll('#title')[0].textContent = '▼ '+parentText;
            childSection.hidden = 'true';

            parentButton.querySelector('yt-formatted-string').addEventListener('click', (e) => {
                console.debug(e.target, e.currentTarget);
                if( e.target !== e.currentTarget ) {
                    return;
                }
                childSection.hidden = !childSection.hidden;
                let direction = childSection.hidden ?  '▼ ' : '▲ ' ;//' ˅' : ' ˄';
                parentButton.querySelectorAll('#title')[0].textContent = direction+parentText;

            });
        }
        parentButton.childNodes[1].appendChild(childButton);

        createInitialzedToggleButton(toggleName, key, onChange, text, tooltip);
    }



    function addToggleLabel(menu, labelText, fontSize) {
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
        menu.append(wrapper);
        //return wrapper;
    }

    function addToggleField(toggleName, key, onChange, min, max, dv, type, id, tooltip) {
        let toggleButton = document.querySelector(toggleName).querySelector('#title');
        let input = document.createElement("input");
        input.style.marginLeft = "10px";
        input.type = type;
        input.id   = id;
        input.name = id;
        input.min  = 0;
        input.max  = 1e6;
        input.value = localStorage.getItem(key);
        if (input.value === "") { //field key has no value
            input.value = localStorage.setItem(key, dv);
        }
        input.addEventListener('change', () => {
            localStorage.setItem(key, input.value);
            onChange();
        });
        input.title = tooltip;
        toggleButton.appendChild(input);
    }

//======================================================================================================
    function BuildMenuContainer(menuContainer) {
        document.body.appendChild(menuContainer);
        /*======================================================
        *        GLOBAL TOGGLES
        *======================================================*/

        addToggleLabel(menuContainer, "Global Toggles", "15px");
        addToggleLabel(menuContainer, "Core UI", '10px');
             addToggle(menuContainer,                           'showCountryCode',    'ytt-show-country-code',  () => { showCountryCode   = !showCountryCode;   toggleCountryCode();        }, "Country Code",        "top right of YouTube Logo");
             addToggle(menuContainer,                           'showAI',             'ytt-show-ai',            () => { showAI            = !showAI;            toggleAI();                 }, "AI Features",         "'AI' search, summaries, and buttons");
             addToggle(menuContainer,                           'showEndButtons',     'ytt-show-end-buttons',   () => { showEndButtons    = !showEndButtons;    toggleEndButtons();         }, "End Buttons",         "all buttons on the end");
                addToggleChild('showEndButtons', menuContainer, 'showCreateButton',   'ytt-show-create-button', () => { showCreateButton  = !showCreateButton;  toggleCreateButton();       }, "Create Button",       "button to create videos");
                addToggleChild('showEndButtons', menuContainer, 'showNotifications',  'ytt-show-notifications', () => { showNotifications = !showNotifications; toggleNotificationButton(); }, "notification button", "notification in the top right");
                addToggleChild('showEndButtons', menuContainer, 'showPfp',            'ytt-show-pfp',           () => { showPfp           = !showPfp;           togglePFP();                }, "PFP",                 "show profile picture button");
        /*======================================================
        *        HOME PAGE TOGGLES
        *======================================================*/
        addToggleLabel(menuContainer, "Homepage Toggles", '15px');
             addToggle(menuContainer,                      'showPrimaryHeader',       'ytt-show-primary-header',        () => { showPrimaryHeader        = !showPrimaryHeader;        togglePrimaryHeader();        }, "Primary Header",    "Tag header above homepage recommendations");
             addToggle(menuContainer,                      'showGuide',               'ytt-show-guide',                 () => { showGuide                = !showGuide;                toggleGuide();                }, "Guide",             "The left side (Subscriptions, You, Explore, etc.)");
                addToggleChild('showGuide', menuContainer, 'showShortsButton',        'ytt-show-shorts-button',         () => { showShortsButton         = !showShortsButton;         toggleShortsButton();         }, "Shorts Button",     "Button in Guide");
                addToggleChild('showGuide', menuContainer, 'showSubscriptions',       'ytt-show-subscriptions-section', () => { showSubscriptionsSection = !showSubscriptionsSection; toggleSubscriptionsSection(); }, "Subscriptions",     "Section in Guide");
                addToggleChild('showGuide', menuContainer, 'showYouSection',          'ytt-show-you-section',           () => { showYouSection           = !showYouSection;           toggleYouSection();           }, "You",               "Section in Guide");
                addToggleChild('showGuide', menuContainer, 'showExplore',             'ytt-show-explore-section',       () => { showExploreSection       = !showExploreSection;       toggleExploreSection();       }, "Explore",           "Section in Guide");
                addToggleChild('showGuide', menuContainer, 'showFromeYouTubeSection', 'ytt-show-from-youtube-section',  () => { showFromYouTubeSection   = !showFromYouTubeSection;   toggleFromYouTubeSection();   }, "More From YouTube", "Section In Guide");
                addToggleChild('showGuide', menuContainer, 'showReportHistory',       'ytt-show-report-history-button', () => { showReportHistoryButton  = !showReportHistoryButton;  toggleReportHistoryButton();  }, "Report History",    "Button In Guide");
                addToggleChild('showGuide', menuContainer, 'showFooterSection',       'ytt-show-Footer-Section',        () => { showFooterSection        = !showFooterSection;        toggleFooterSection();        }, "Footer",            "Section In Guide");


        addToggleLabel(menuContainer, "Blocks of Content", '10px');
             addToggle(menuContainer, 'showBanners',           'ytt-show-banners',              () => { showBanner            = !showBanner            ;startShelfChecks(); }, "Banners",             "Turns on Banners");
             addToggle(menuContainer, 'showShorts',            'ytt-show-shorts',               () => { showShorts            = !showShorts            ;startShelfChecks(); }, "Shorts",              "Homepage Shorts");
             addToggle(menuContainer, 'showGames',             'ytt-show-games',                () => { showGames             = !showGames             ;startShelfChecks(); }, "Playables",           "Homepage Games");
             addToggle(menuContainer, 'showBreakingNews',      'ytt-breaking-news',             () => { showBreakingNews      = !showBreakingNews      ;startShelfChecks(); }, "Breaking News",       "Breaking News On");
             addToggle(menuContainer, 'showPosts',             'ytt-show-posts',                () => { showPosts             = !showPosts             ;startShelfChecks(); }, "Creator Posts",       "Creator Posts On");
             addToggle(menuContainer, 'showExploreMoreTopics', 'ytt-show-explore-more-topics',  () => { showExploreMoreTopics = !showExploreMoreTopics ;startShelfChecks(); }, "Explore More Topics", "Explore Topics On");
             addToggle(menuContainer, 'showWhatDidYouThink',   'ytt-what-did-you-think',        () => { showWhatDidYouThink   = !showWhatDidYouThink   ;startShelfChecks(); }, "Rating Videos",       "The 'What did you think of this video?' messages");

        addToggleLabel(menuContainer, "Types of Videos", '10px');
             addToggle(menuContainer, 'showMusic',                'ytt-show-music',       () => { showMusic     = !showMusic;     startItemBadgeChecks(); }, "Music",                "Music in video format");
             addToggle(menuContainer, 'showPlaylistsandPodcasts', 'ytt-show-playlists',   () => { showPlaylists = !showPlaylists; startItemChecks();      }, "Playlists & Podcasts", "Turns on Playlists & Podcasts");
             addToggle(menuContainer, 'showNewToYouMessage',      'ytt-show-new-to-you',  () => { showNewToYou  = !showNewToYou;  startItemChecks();      }, "New To You Message",   "Turns on New To You / Looking for something different Message");
             addToggle(menuContainer, 'showWatchedVideos',        'ytt-show-watched',     () => { showWatched   = !showWatched;   toggleShowWatched();    }, "Watched Videos",       "(When off) Videos Above This Watch Percentage Are Hidden: ");
                       addToggleField('showWatchedVideos',        'ytt-max-watch-percent',() => { toggleShowWatched()}, 0, 100, 100, "number", "ytt-watched-id",                     "Percent (Greater Than Equal Gets Hidden)");
             addToggle(menuContainer, 'showPurchasedVideos',      'ytt-show-purchased',   () => { showPurchased   = !showPurchased;     startItemBadgeChecks(); }, "Purchased Media",  "Turns on Purchased Media");
             addToggle(menuContainer, 'showFreeMovies',           'ytt-show-free-movies', () => { showFreeMovies  = !showFreeMovies;    startItemBadgeChecks(); }, "Free Movies",      "Turns on Free & Primetime Movies");
             addToggle(menuContainer, 'showMemberOnly',           'ytt-show-member-only', () => { showMemberOnly  = !showMemberOnly;    toggleMembersOnly();    }, "Member Only",      "Turns on Members Only Videos");
             addToggle(menuContainer, 'showSponsored',            'ytt-show-sponsored',   () => { showSponsored   = !showSponsored;     startItemBadgeChecks(); }, "Sponsored",        "Turns on Sponsored Video Ads");
             addToggle(menuContainer, 'showLivestreams',          'ytt-show-livestreams', () => { showLivestreams = !showLivestreams;   startItemBadgeChecks(); }, "Livestreams",      "Turns on Livestreams");
             addToggle(menuContainer, 'showStreamed',             'ytt-show-streamed',    () => { showStreamed    = !showStreamed;      startVideoChecks();     }, "Past Livestreams", "Turns on Past Livestreams (streamed)");
                       addToggleField('showStreamed',             'ytt-streamed-value',   () => { startVideoChecks()}, 0, 1e12, 1e12, "number", "ytt-streamed-id", "Views (Less Than Equal Gets Hidden)");
            //_inputField('ShowStreamed'          ,'ytt-streamed-value', 1e12, "number", "ytt-streamed-id");
      /*======================================================
       *        WATCH PAGE TOGGLES
       *======================================================*/
        addToggleLabel(menuContainer, "Watchpage Toggles", '15px');
        addToggleLabel(menuContainer, "Core UI");
             addToggle(menuContainer,                             'showRecommendations', 'ytt-show-recommendations',   () => { showRecommedations  = !showRecommedations;  toggleRecommendations(); }, "Recommendations",   "Recommendation section on video watchpages");
             addToggle(menuContainer,                             'showEndScreenVideos', 'ytt-show-end-screen-videos', () => { showEndScreenVideos = !showEndScreenVideos; toggleEndScreenVideos(); }, "End Screen Videos", "Videos recommended when a video ends");
             addToggle(menuContainer,                             'showBelow',           'ytt-show-below',             () => { showBelow           = !showBelow;           toggleBelow();           }, "Below Player",      "Everything below the video's player");
                addToggleChild('showBelow', menuContainer,        'showMerchStore',      'ytt-show-merch-store',       () => { showMerchStore      = !showMerchStore;      toggleMerchStore();      }, "Merch Store",       "The Shop Section under videos");
                addToggleChild('showBelow', menuContainer,        'showComments',        'ytt-show-comments',          () => { showComments        = !showComments;        toggleComments();        }, "Comments",          "The entire comment section");
                    addToggleChild('showComments', menuContainer, 'showCommentingField', 'ytt-show-commenting-field',  () => { showCommentingField = !showCommentingField; toggleCommentingField(); }, "Commenting Field",  "The place that you type and submit comments");
                    addToggleChild('showComments', menuContainer, 'showReplyButton',     'ytt-show-reply-button',      () => { showReplyButton     = !showReplyButton;     toggleReplyButton();     }, "Reply Button",      "reply buttons in comments");
      /*======================================================
       *        DEVELOPER TOGGLES
       *======================================================*/
        addToggleLabel(menuContainer, "Developer Tool Toggles", '15px');
          addToggleLabel(menuContainer, "Experimental Toggles", '10px');
            //initToggle('DebugMode',                 'ytt-debug-mode',                 () => { debugMode             = !debugMode;                                               }, "DebugMode"             ,"Console Logs more step by step function calling"          );
            addToggle(menuContainer, 'enableBetterZoom',   'ytt-enable-better-zoom',   () => { enableBetterZoom   = !enableBetterZoom;   toggleBetterZoom();   }, "Better Zoon",   "Allows content to fill the screen better when zooming out");                                                                                                                               /*if (getURL_id() === 0 && enableBetterZoom) {homepageZoomOn();} else{homepageZoomOff();}*/
            addToggle(menuContainer, 'enableStreamerMode', 'ytt-enable-streamer-mode', () => { enableStreamerMode = !enableStreamerMode; toggleStreamerMode(); }, "Streamer Mode", "Tries Removing Identifying Information (*not perfect*)");
            addToggle(menuContainer, 'showLabsFeature',    'ytt-show-labs-feature',    () => { showLabsFeature    = !showLabsFeature;    toggleLabsFeature();  }, "Labs Feature",  "Currently Does Nothing");
            addToggle(menuContainer, 'logMetadata',        'ytt-logging',              () => { enableLogging      = !enableLogging;      processVideos();      }, "LogMetadata",   "Console Logs videos metadata loading in the DOM");
            addToggle(menuContainer, 'enableExperimental', 'ytt-enable-experimental',  () => { enableExperimental = !enableExperimental; toggleExperimental(); }, "Experimental",  "Experimental toggles (read source code)");
                      addToggleField('enableExperimental', 'ytt-experimental-value',   () => { toggleExperimental()}, 0, 1e6, -1, "number", "ytt-experiemental-id", "Videos (Per Row On Homepage)");
    }


    function createMenuButton() {
        const voiceSearchButton = document.querySelector('#voice-search-button');


        let yttButton = document.createElement('div'), btnStyle = yttButton.style;
          yttButton.id = 'yttButton';
          yttButton.className = 'style-scope ytd-masthead';

        let ytd_button_renderer = document.createElement('ytd-button-renderer');
          ytd_button_renderer.className = 'style-scope ytd-masthead';

        yttButton.appendChild(ytd_button_renderer)

        document.querySelector("#center").appendChild(yttButton);




        let tp_yt_paper_tooltip = yttButton.querySelector('tp-yt-paper-tooltip');
        tp_yt_paper_tooltip.removeAttribute('disable-upgrade');
        tp_yt_paper_tooltip.querySelector('#tooltip').append('Toggle Features');
        tp_yt_paper_tooltip.style.opacity = "0.9";


       yttButton.onmouseover = function() {
            yttButton.querySelector('#tooltip').className = "show style-scope tp-yt-paper-tooltip";
            let rect = yttButton.getBoundingClientRect();
            tp_yt_paper_tooltip.style.left = rect.x - rect.width + 'px';
            tp_yt_paper_tooltip.style.top = rect.y + rect.height + 6 + 'px';
       }
       yttButton.onmouseout = function() {
           yttButton.querySelector('#tooltip').className = "hidden style-scope tp-yt-paper-tooltip";
       }







        yttButton.querySelector('yt-button-shape').after(voiceSearchButton.querySelector('yt-button-shape').cloneNode(true));
        yttButton.querySelector('path').setAttribute('d', 'M21 5H3a1 1 0 000 2h18a1 1 0 100-2Zm-3 6H6a1 1 0 000 2h12a1 1 0 000-2Zm-3 6H9a1 1 0 000 2h6a1 1 0 000-2Z');

        yttButton.style.borderRadius = '100px';
        yttButton.style.marginLeft = '12px';
        yttButton.style.backgroundColor = 'var(--yt-sys-color-baseline--additive-background)';

        const menu = createMenu();
        BuildMenuContainer(menu);

        setMenuButtonEl(yttButton);
        setMenuEl(menu);
        window.onresize = updateMenu;

        yttButton.onclick = function() {
          toggleMenu();
        };

    }

    function clearLocalStorage() {
        localStorage.clear();
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




  /*
  TOGGLE CALLERS
  */

      function defaultCalls() {
          toggleStreamerMode();
          toggleUIChecks(); //checks homepage versus watchpage
          toggleLabsFeature();
      }





      function homepageCalls() {
          checkItemsPerRow();
          processVideos();
          startShelfChecks();
          startItemChecks();
          startItemBadgeChecks();
      }

      function watchpageCalls() {
          startVideoChecks();
          startItemBadgeChecks();
      }

      function channelpageCalls() {

      }

      function searchPageCalls() {
          //toggleLabsFeature();
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
        //console.log("Observers Started");
        try {
            const observer = new MutationObserver(() => {
                let url = getURL_id();
                //console.debug({url});
                toggleExperimental();
                defaultCalls();

                if (url === 0) {
                    homepageCalls();
                    //checkPerformance(homepageCalls);
                }
                else if (url === 1) {
                    watchpageCalls();
                }
                else if (url === 2) {
                    searchPageCalls();
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
          //console.log("script button created");
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
  }

  function observeQuery(query, funCondition, funFinish) {
      const observer = new MutationObserver(() => {
        if (funCondition()) {
          observer.disconnect();
          funFinish();
          //console.log("Query Condition Met");
          return true;
        }
      });
      observer.observe(query, { childList: true, subtree: true });
  }


  function HideAllNotifications() {
    //let menu = document.querySelector('#contentWrapper').querySelector('#container').querySelector('#items')
    //menu.querySelectorAll('ytd-notification-renderer')[0].querySelector('button').click()

    //let menu = document.querySelector('#contentWrapper').querySelector('#container').querySelector('#items').querySelectorAll('ytd-notification-renderer')[0].querySelector('button')

    //get the notification
    //click notification ... button
    //click hide notification button
    //repeat, until all notifications are gone

    let menu = document.querySelector('#contentWrapper').querySelector('#container').querySelector('#items').querySelectorAll('ytd-notification-renderer').forEach(item => {
        item.querySelector('button').click()
        let hideButton = document.querySelector('.ytd-menu-service-item-renderer')
        while (!hideButton) {
            hideButton = document.querySelector('.ytd-menu-service-item-renderer')
        }
        hideButton.click()
    });

    //let hideButton = document.querySelector('.ytd-menu-service-item-renderer')
  }




  function main() {
      observeQuery(document.body, tryClone, createMenuButton);
      startObservers();
  }



  document.addEventListener('DOMContentLoaded', function () {
      console.log("script started");
      main();
  });



})();
