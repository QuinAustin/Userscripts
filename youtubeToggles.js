// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.0.5
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



Changelog 1.0.5
    -more videos changed to Enable Zoom Out (more videos)
    -zooming out now scales shorts down with videos
    -zooming out now scales font size up, so you can still read titles
    -new menu made! it looks the exact same, but written way better
    -badge checking is slowly getting better, and should be getting better at adapting for any new badge rollouts
    -something I forgot (probably)


*/

(function() {
    'use strict';


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

    let debugMode               = localStorage.getItem('enhancer-debug-mode')       === 'false' ? false : true;

    let enableLogging           = localStorage.getItem('enhancer-logging')          === 'false' ? false : true;

    let showBreakingNews        = localStorage.getItem('enhancer-breaking-news')    === 'false' ? false : true;
    let showShorts              = localStorage.getItem('enhancer-show-shorts')      === 'false' ? false : true;
    let showGames               = localStorage.getItem('enhancer-show-games')       === 'false' ? false : true;

    let showExploreMoreTopics   = localStorage.getItem('enhancer-show-explore-more-topics') === 'false' ? false : true;

    let showAI                  = localStorage.getItem('enhancer-show-ai')          === 'false' ? false : true;
    let showWatched             = localStorage.getItem('enhancer-show-watched')     === 'false' ? false : true;
    let showPurchased           = localStorage.getItem('enhancer-show-purchased')   === 'false' ? false : true;
    let showNewToYou            = localStorage.getItem('enhancer=show-new-to-you')  === 'false' ? false : true;

    let showMusic               = localStorage.getItem('enhancer-show-music')       === 'false' ? false : true;
    let showPlaylists           = localStorage.getItem('enhancer-show-playlists')   === 'false' ? false : true;
    let showBanner              = localStorage.getItem('enhancer-show-banner')      === 'false' ? false : true;

    let showFreeMovies          = localStorage.getItem('enhancer-show-free-movies') === 'false' ? false : true;
    //not working yet
    let showMemberOnly          = localStorage.getItem('enhancer-show-member-only') === 'false' ? false : true;
    let showPosts               = localStorage.getItem('enchancer-show-posts')      === 'false' ? false : true;



//    let showChannelStore    = localStorage.getItem('enhancer-show-channel-store') === 'false' ? false : true;
//    let showMemberJoin      = localStorage.getItem('enhancer-show-member-join') === 'false' ? false : true;
//    let showThanksDonation  = localStorage.getItem('enhancer-show-thanks-donation') === 'false' ? false : true;

    let enableStreamerMode    = localStorage.getItem('enhancer-enable-streamer-mode') === 'false' ? false : true;

    let moreVideosPerRow      = localStorage.getItem('enchancer-more-videos-per-row') === 'false' ? false : true;

    //let new                 = localStorage.getItem('enchancer-new')                 === 'false' ? false : true;


    function toggleQuerySelector(selector, enabled) {
        try {
            const element = document.querySelector(selector);
            element.style.display = enabled;
        } catch(e) {}
    }


    function toggleGetElementById(id, enabled) {
        try {
            const element = document.getElementById(id);
            element.style.display = enabled;
        } catch(e) {}
    }




    function startShelfChecks() {
          //console.log("starting shelf checks");

        const container = document.getElementById('contents');
        if (container) {
            container.querySelectorAll('ytd-rich-section-renderer').forEach(query => {
                const title = query.querySelector('#title')?.textContent.trim().toLowerCase();

                if(debugMode) {
                    console.log("title: ",title);
                }

                switch (title) {
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
                            console.log("title not recognized: ",title);
                        }
                }
            });
        }
        else if (debugMode) {
            console.log("videos have not been loaded yet");
        }
    }


    function startItemChecks() {
        //console.log("starting item checks");
        const container = document.getElementById('contents');
        if (container) {
            container.querySelectorAll('ytd-rich-item-renderer').forEach(query => {

                //Playlist, Podcast, Etc. Item
                const playlistBadge = query.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();   //this is normally where video duration is placed. example is: <div class="yt-badge-shape__text">51 videos</div>
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
                if (title === 'Looking for something different?') {
                    query.style.display = showNewToYouPrompt ? '' : 'none';
                }


            });
        }
        else if (debugMode) {
            console.log("videos have not been loaded yet");
        }
    }


    function startVideoChecks() {
        //Videos: 'yt-lockup-view-model'
        //Shorts: 'ytd-reel-shelf-renderer'
        //Movies: 'ytd-compact-movie-renderer'


        //AI Summary Under Video Players
        try {
            const aiSummary = document.getElementById('expandable-metadata');
            aiSummary.style.display = showAI ? '' : 'none';
        } catch(e) {}


        try {
            const container = document.querySelector('#secondary #secondary-inner #related #items ytd-item-section-renderer #contents');
            if (debugMode) {
                console.log("container:", {container});
            }
        }catch(e){}





        try {
            if (container) {

                //Check For Shelfs
                container.querySelectorAll('ytd-reel-shelf-renderer').forEach(query => {
                    const title = query.querySelector('#title')?.textContent.trim().toLowerCase();
                    if (title === "shorts") {
                        query.style.display = showShorts ? '' : 'none';
                    }
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


    function startItemBadgeChecks() {
        container = document.getElementById('contents');
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
                        console.log('badgeTextAll[2]: ', badgeTextAll[1]?.textContent.trim().toLowerCase());

                        console.log('badgeIcon: ', badgeIcon);
                        console.log('badgeRenderer: ', badgeRenderer);
                    }




                    switch (badgeTextAll[0]?.textContent.trim().toLowerCase()) {  //mix: M3 3.657v16.689a1 1 0 001.466.883L8 19.369V4.632l-3.534-1.86A1 1 0 003 3.657ZM14 7.79l-4-2.105v12.631l4-2.106V7.79ZM22 12l-6-3.157v6.315L22 12Z
                        case 'mix':
                            query.style.display = showMusic ? '' : 'none';
                    }

                    switch (badgeTextAll[2]?.textContent.trim().toLowerCase()) {
                        case 'members only':
                            query.style.display = showMemberOnly ? '' : 'none';

                        case 'free':
                            query.style.display = showFreeMovies ? '' : 'none';
                    }

                    switch (iconPathStart) { //note: M5.5 1.383V6.88a2.25 2.25 0 101 1.871V4.6l2.743 1.647a.5.5 0 00.757-.43V3.485a.5.5 0 00-.243-.429l-3.5-2.1a.5.5 0 00-.757.427Z
                        case ('M5'):
                            query.style.display = showMusic ? '' : 'none';
                    }

                    switch(badgeRenderer) {
                        case 'purchased':
                            query.style.display = showPurchased ? '' : 'none';
                    }


                });
            }
    }


    function toggleBanner() {
        const banner = document.querySelector('ytd-statement-banner-renderer');
        if (banner) {
            banner.style.display = showBanner ? '' : 'none';
        }
    }


    function toggleStreamerMode() {
        const enabled = enableStreamerMode ? 'none' : '';

            toggleQuerySelector('ytd-merch-shelf-renderer', enabled);                //toggle Merch Under Videos
            toggleQuerySelector('ytd-comment-simplebox-renderer', enabled);          //toggle Commenting Under Videos
            toggleQuerySelector('ytd-topbar-menu-button-renderer', enabled);         //toggle top right profile picture
            toggleQuerySelector('ytd-guide-section-renderer:nth-child(2)', enabled); //toggle subscriptions on the left side menu on the homepage

            toggleGetElementById('country-code', enabled);                           //toggle users country on the top left logo

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
        if (moreVideosPerRow) {
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
                document.documentElement.style.fontSize = (10 + difference) + "px";

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
    const dcheckItemsPerRow = debounce(checkItemsPerRow, 1000);

    function startObservers() {
        const observer = new MutationObserver(() => {

            toggleStreamerMode();

            let currentURL = document.URL;

            if (currentURL === "https://www.youtube.com/") {
                toggleBanner();
                dcheckItemsPerRow();
                processVideos();
                startShelfChecks();
                startItemChecks();
                startItemBadgeChecks();
            }

            else if (currentURL.startsWith("https://www.youtube.com/watch?v=")) {
                startVideoChecks();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }






    function clicked(button, menu) {
        console.log("boop: ", button);

        //button.innerHTML = "changed"; this worked

        const rect = button.getBoundingClientRect();
        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';

    }


    function createMenuButton() {
        const voiceSearchButton = document.querySelector('#voice-search-button');

        let button = document.createElement('button'), btnStyle = button.style;
        button.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment"
        button.style.flex = 'revert';
        button.style.margin = '12px';


        document.querySelector('#voice-search-button').appendChild(button);
        button.innerHTML = "YTT Menu";


        let menu = createMenu();
        button.onclick = function() {clicked(button, menu)};

        voiceSearchButton.parentElement.appendChild(button);
    }


    function createMenu() {
        //font-size: 10px;font-family: Roboto, Arial, sans-serif;
        const menuContainer = document.createElement('div');
        menuContainer.style.position        = 'fixed';
        menuContainer.style.backgroundColor = '#222';
        menuContainer.style.color           = '#fff';
        menuContainer.style.padding         = '10px';
        menuContainer.style.display         = 'none';
        menuContainer.style.zIndex          = '9999';
        menuContainer.style.border          = '1px solid #555';
        menuContainer.style.boxShadow       = '0 2px 10px rgba(0,0,0,0.5)';
        menuContainer.style.whiteSpace      = 'nowrap';
        menuContainer.style.flexDirection   = 'column';
        menuContainer.style.gap             = '5px';
        menuContainer.style.borderRadius    = '4px';


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

        //Toggle Menu Options
        menuContainer.appendChild(createCheckbox('Debug Mode',                          'enhancer-debug-mode',            () => { debugMode          = !debugMode;                                      }));
        menuContainer.appendChild(createCheckbox('Log Metadata',                        'enhancer-logging',               () => { enableLogging      = !enableLogging;      processVideos();            }));
        menuContainer.appendChild(createCheckbox('Enable Streamer Mode',                'enhancer-enable-streamer-mode',  () => { enableStreamerMode = !enableStreamerMode; toggleStreamerMode();       }));
        menuContainer.appendChild(createCheckbox('Enable Zoom Out (more videos)',       'enhancer-more-videos-per-row',   () => { moreVideosPerRow   = !moreVideosPerRow;   checkItemsPerRow();         }));


        menuContainer.appendChild(createCheckbox('Show Watched Videos',                  'enhancer-show-watched',                    () => { showWatched             = !showWatched;             processVideos();        }));


        menuContainer.appendChild(createCheckbox('Show Breaking News',                   'enhancer-breaking-news',                   () => { showBreakingNews        = !showBreakingNews;        startShelfChecks();     }));
        menuContainer.appendChild(createCheckbox('Show Shorts',                          'enhancer-show-shorts',                     () => { showShorts              = !showShorts;              startShelfChecks();     }));
        menuContainer.appendChild(createCheckbox('Show Games',                           'enhancer-show-games',                      () => { showGames               = !showGames;               startShelfChecks();     }));
        menuContainer.appendChild(createCheckbox('Show Posts',                           'enhancer-show-posts',                      () => { showPosts               = !showPosts;               startShelfChecks();     }));
        /*untested*/menuContainer.appendChild(createCheckbox('Show Explore More Topics', 'enhancer-show-explore-more-topics',        () => { showExploreMoreTopics   = !showExploreMoreTopics;   startShelfChecks();     }));


        menuContainer.appendChild(createCheckbox('Show AI',                             'enhancer-show-ai',               () => { showAI             = !showAI;           startItemChecks();startVideoChecks();         }));
        menuContainer.appendChild(createCheckbox('Show Playlists and Podcasts',         'enhancer-show-playlists',        () => { showPlaylists      = !showPlaylists;    startItemChecks();                            }));
        menuContainer.appendChild(createCheckbox('Show Purchased Videos',               'enhancer-show-purchased',        () => { showPurchased      = !showPurchased;    startItemBadgeChecks();                       }));
        menuContainer.appendChild(createCheckbox('Show Music',                          'enhancer-show-music',            () => { showMusic          = !showMusic;        startItemBadgeChecks();                       }));
        menuContainer.appendChild(createCheckbox('Show Free Movies',                    'enhancer-show-free-movies',      () => { showFreeMovies     = !showFreeMovies;   startItemBadgeChecks();startVideoChecks();    }));
        menuContainer.appendChild(createCheckbox('Show Banner',                         'enhancer-show-banner',           () => { showBanner         = !showBanner;       toggleBanner();                               }));


        //Still Field Testing
        /*badgeTextAll[1? and 2?]*/menuContainer.appendChild(createCheckbox('Show Member Only (alpha)',             'enhancer-show-member-only',      () => { showMemberOnly     = !showMemberOnly;     startItemBadgeChecks();  }));
        /*untested*/menuContainer.appendChild(createCheckbox('Show New To You Message (alpha)',      'enhancer-show-new-to-you',       () => { showNewToYou       = !showNewToYou;       startItemChecks();      }));



      //menuContainer.appendChild(createCheckbox('Show New',                    'enhancer-show-new',         () => { showNew          = !showNew;          toggleNew();               }));


        document.body.appendChild(menuContainer);
        return menuContainer;
    }

    function waitForBody() {
        if (document.body) {
            console.log("script started");
            //createMenu();
            createMenuButton();
            startObservers();
        }
        else {
            setTimeout(waitForBody, 50);
        }
    }
    waitForBody();

})();
