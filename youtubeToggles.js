// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.0.3
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




    let enableLogging    = localStorage.getItem('enhancer-logging')          === 'false' ? false : true;
    let showBreakingNews = localStorage.getItem('enhancer-breaking-news')    === 'false' ? false : true;
    let showShorts       = localStorage.getItem('enhancer-show-shorts')      === 'false' ? false : true;
    let showGames        = localStorage.getItem('enhancer-show-games')       === 'false' ? false : true;
    let showWatched      = localStorage.getItem('enhancer-show-watched')     === 'false' ? false : true;
    let showPurchased    = localStorage.getItem('enhancer-show-purchased')   === 'false' ? false : true;
    let showAI           = localStorage.getItem('enhancer-show-ai')          === 'false' ? false : true;
    let showNewToYou     = localStorage.getItem('enhancer=show-new-to-you')  === 'false' ? false : true;

    let showMusic        = localStorage.getItem('enhancer-show-music')       === 'false' ? false : true;
    let showPlaylists    = localStorage.getItem('enhancer-show-playlists')   === 'false' ? false : true;
    let showBanner       = localStorage.getItem('enhancer-show-banner')      === 'false' ? false : true;

    let showFreeMovies   = localStorage.getItem('enhancer-show-free-movies') === 'false' ? false : true;
    //not working yet
    let showMemberOnly   = localStorage.getItem('enhancer-show-member-only') === 'false' ? false : true;




//    let showChannelStore    = localStorage.getItem('enhancer-show-channel-store') === 'false' ? false : true;
//    let showMemberJoin      = localStorage.getItem('enhancer-show-member-join') === 'false' ? false : true;
//    let showThanksDonation  = localStorage.getItem('enhancer-show-thanks-donation') === 'false' ? false : true;

    let enableStreamerMode    = localStorage.getItem('enhancer-enable-streamer-mode') === 'false' ? false : true;

    let moreVideosPerRow      = localStorage.getItem('enchancer-more-videos-per-row') === 'false' ? false : true;




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

    //function toggleQuerySelectorAll(selector) {
    //    document.querySelectorAll(selector).forEach(query => {
    //    })
    //}

    function startShelfChecks() {
          //console.log("starting shelf checks");

        container = document.getElementById('contents');
        if (container) {
            container.querySelectorAll('ytd-rich-shelf-renderer').forEach(query => {
                const title = query.querySelector('#title')?.textContent.trim().toLowerCase();

                if (title) {
                    //Shorts Shelf
                    if (title.includes('shorts')) {
                        query.style.display = showShorts ? '' : 'none';
                    }
                    //Games Shelf (not tested)
                    if (title.includes('youtube playables')) {
                        query.style.display = showGames ? '' : 'none';
                    }
                    //Breaking News Shelf (not tested)
                    if (title === 'breaking news') {
                        query.style.display = showBreakingNews ? '' : 'none';
                    }
                }
            });
        }
        else {
            console.log("videos have not been loaded yet");
        }
    }



    //function toggleShortsShelf() {
    //    document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
    //        const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
    //        if (title && title.includes('shorts')) {
    //            shelf.style.display = showShorts ? '' : 'none';
    //        }
    //    });
    //}

    //function toggleBreakingNewsShelf() {
    //    document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
    //        const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
    //        if (title === 'breaking news') {
    //            shelf.style.display = showBreakingNews ? '' : 'none';
    //        }
    //    });
    //}

    //function toggleGamesShelf() {
    //    document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
    //        const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
    //        if (title && title.includes('youtube playables')) {
    //            shelf.style.display = showGames ? '' : 'none';
    //        }
    //    });
    //}






    function startItemChecks() {
        //console.log("starting item checks");
        container = document.getElementById('contents');
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
        else {
            console.log("videos have not been loaded yet");
        }
    }



    function startVideoChecks() {



        //AI Summary Under Video Players
        try {
            const aiSummary = document.getElementById('expandable-metadata');
            aiSummary.style.display = showAI ? '' : 'none';
        } catch(e) {}





    }


   // function togglePlaylists() {
   //     //might eventually need to add a check for the path M6 like in the music check.
   //     document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
   //         const playlistBadge = item.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
   //         if (playlistBadge && (playlistBadge.includes('episodes') || playlistBadge.includes('lessons') || playlistBadge.includes('videos'))) {
   //           item.style.display = showPlaylists ? '' : 'none';
   //         }
   //     });
   // }

 //   function toggleAI() {
 //       document.querySelectorAll('ytd-rich-section-renderer').forEach(section => {
 //           if (section.querySelector('ytd-talk-to-recs-flow-renderer')) {
 //               section.style.display = showAI ? '' : 'none';
 //           }
 //       });
 //
 //       try {
 //           const aiSummary = document.getElementById('expandable-metadata');
 //           aiSummary.style.display = showAI ? '' : 'none';
 //       } catch(e) {}
 //   }













  //let showNew = localStorage.getItem('enhancer-show-new') === 'false' ? false : true;

    function processVideos() {
        const items = document.querySelectorAll('ytd-rich-item-renderer');
        items.forEach(item => {
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






/* TODO
    function toggleBadges() {
      document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
        const infoBadge =     item.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
        const overlayBadge =  item.querySelector('.yt-badge-shape__icon');
        let remove = false;

        if (!infoBadge && !overlayBadge) {
          return;
        } //i.e. video has no badges to be found


        //most common badge type
        if (infoBadge) {

          //music
          if (!showMusic && infoBadge === 'mix') {
            remove = true;
          }
          //playlist
          else if (!showPlaylists && infoBadge.includes('episodes') || infoBadge.includes('lessons') || infoBadge.includes('videos')) {
            remove = true;
          }
          //member only
          else if (!showMemberOnly && infoBadge.includes('members only')) {
            remove = true;
          }
        }

        //uncommon badge type
        else if (overlayBadge) {
          try {
            let svg = overlayBadge.querySelector('path').getAttribute('d');
          }
          catch (e) {
            //no message
          }
          //music
          if(!showMusic && svg.startsWith("M5")) {
            remove = true;
          }
        }

        item.style.display = !remove ? '' : 'none';
      });
    }
*/









    function toggleMusic() {
      document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
          const mixBadge  = item.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
          const mixBadge2 = item.querySelector('.yt-badge-shape__icon'); //this badge appears to the left of the duration

          if (!mixBadge && !mixBadge2) { return }; //i.e. not a music video

          let m5 = false;
          if (mixBadge2) {
              try {
                  if (mixBadge2.querySelector('path').getAttribute('d').startsWith("M5")) { //might need to add an || d.startsWith("M2"), but it only happened once so not positive
                      m5 = true;
                  }
              }
              catch (e) {
              }
          }
          if (mixBadge && mixBadge === 'mix' || m5 ) {
              item.style.display = showMusic ? '' : 'none';
          }
      });
    }



    function togglePurchased() {
        document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
            const purchasedBadge = item.querySelector('ytd-badge-supported-renderer p');
            if (purchasedBadge && purchasedBadge.textContent.trim().toLowerCase() === 'purchased') {
                item.style.display = showPurchased ? '' : 'none';
            }
        });
    }
    function toggleBanner() {
        const banner = document.querySelector('ytd-statement-banner-renderer');
        if (banner) {
            banner.style.display = showBanner ? '' : 'none';
        }
    }


    function toggleMemberOnly() {
        document.querySelectorAll('ytd-rich-item-renderer').forEach(shelfItem => {
            const text = shelfItem.querySelectorAll('.yt-badge-shape__text')[2]?.textContent.trim().toLowerCase();
            if (!text) { return };

            if (text === 'members only') {
                shelfItem.style.display = showMemberOnly ? '' : 'none';
            }
        });
    }



    function toggleFreeMovies() {
        document.querySelectorAll('ytd-rich-item-renderer').forEach(shelfItem => {
            const text = shelfItem.querySelectorAll('.yt-badge-shape__text')[2]?.textContent.trim().toLowerCase();
            if (!text) { return };

            if (text === 'free') {
                shelfItem.style.display = showFreeMovies ? '' : 'none';
            }
        });
    }



    //STREAMER MODE





    function toggleStreamerMode() { //for both private people looking to share their screens in discord and streamers watching videos on their personal or premium accounts, so no ads would be a better experience)
        const enabled = enableStreamerMode ? 'none' : '';

        //if (enabled === 'none') {
            toggleQuerySelector('ytd-merch-shelf-renderer', enabled);                //toggle Merch Under Videos
            toggleQuerySelector('ytd-comment-simplebox-renderer', enabled);          //toggle Commenting Under Videos
            toggleQuerySelector('ytd-topbar-menu-button-renderer', enabled);         //toggle top right profile picture
            toggleQuerySelector('ytd-guide-section-renderer:nth-child(2)', enabled); //toggle subscriptions on the left side menu on the homepage


//            document.querySelectorAll('ytd-merch-shelf-renderer', 'ytd-comment-simplebox-renderer', 'ytd-topbar-menu-button-renderer', 'ytd-guide-section-renderer:nth-child(2)').forEach(query => {
//                query.style.display = enabled;
//            });




            toggleGetElementById('country-code', enabled);                           //toggle users country on the top left logo
        //}










        //potentially an even stricter version (breaks watching videos)
        //try {
        //    const homepage = document.getElementById('contents');
        //    homepage.style.display = enableStreamerMode ? 'none' : '';
        //} catch(e) {}
      //
        //try {
        //    const filter = document.getElementById('primary');
        //    filter.style.display = enableStreamerMode ? 'none' : '';
        //} catch(e) {}
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
    const dToggleFreeMovies = debounce(toggleFreeMovies, 100);
    const dToggleMemberOnly = debounce(toggleMemberOnly, 100);
    const dToggleMusic      = debounce(toggleMusic,      100);
    const dcheckItemsPerRow = debounce(checkItemsPerRow, 1000);

    function startObservers() {
        const observer = new MutationObserver(() => {
            toggleStreamerMode();

            dcheckItemsPerRow();

            processVideos();

            //toggleBreakingNewsShelf();
            //toggleShortsShelf();
            //toggleGamesShelf();
            startShelfChecks();

            //togglePlaylists();
            //toggleAI(); //homepage prompt
            //new to you video prompt
            startItemChecks();

            //toggleAI(); //video summary
            startVideoChecks();



            togglePurchased();



            //toggleBadges();
            dToggleMusic();





            toggleBanner();
            dToggleFreeMovies();

            //TODO
            dToggleMemberOnly();



            //toggleNew();

        });
        observer.observe(document.body, { childList: true, subtree: true });
    }




    function createMenu() {
        const voiceSearchButton = document.querySelector('#voice-search-button');
        if (!voiceSearchButton) return;

        const menuButton = document.createElement('yt-button');
        menuButton.className             = 'yt-spec-button-shape-next--size-m';
        menuButton.textContent           = 'Enhancer Menu';
        menuButton.style.cursor          = 'pointer';
        menuButton.style.marginLeft      = '10px';
        menuButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
        menuButton.style.color           = '#f1f1f1';
        menuButton.style.padding         = '6px 16px';
        menuButton.style.borderRadius    = '9999px';
        menuButton.style.height          = '32px';
        menuButton.style.minWidth        = 'auto';
        menuButton.style.fontSize        = '14px';
        menuButton.style.fontWeight      = '500';
        menuButton.style.display         = 'inline-flex';
        menuButton.style.alignItems      = 'center';
        menuButton.style.justifyContent  = 'center';

        menuButton.addEventListener('mouseenter', () => { menuButton.style.backgroundColor = 'rgba(255,255,255,0.15)'; });
        menuButton.addEventListener('mouseleave', () => { menuButton.style.backgroundColor = 'rgba(255,255,255,0.1)'; });
        menuButton.addEventListener('mousedown',  () => { menuButton.style.transform       = 'scale(0.95)'; });
        menuButton.addEventListener('mouseup',    () => { menuButton.style.transform       = 'scale(1)'; });

        const menuContainer = document.createElement('div');
        menuContainer.style.position =        'fixed';
        menuContainer.style.backgroundColor = '#222';
        menuContainer.style.color =           '#fff';
        menuContainer.style.padding =         '10px';
        menuContainer.style.display =         'none';
        menuContainer.style.zIndex =          '9999';
        menuContainer.style.border =          '1px solid #555';
        menuContainer.style.boxShadow =       '0 2px 10px rgba(0,0,0,0.5)';
        menuContainer.style.whiteSpace =      'nowrap';
        menuContainer.style.flexDirection =   'column';
        menuContainer.style.gap =             '5px';
        menuContainer.style.borderRadius =    '4px';

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
        menuContainer.appendChild(createCheckbox('Log Metadata',                        'enhancer-logging',               () => { enableLogging      = !enableLogging;    processVideos();                          }));
        menuContainer.appendChild(createCheckbox('Show Breaking News',                  'enhancer-breaking-news',         () => { showBreakingNews   = !showBreakingNews; startShelfChecks();                       }));//toggleBreakingNewsShelf();
        menuContainer.appendChild(createCheckbox('Show Shorts',                         'enhancer-show-shorts',           () => { showShorts         = !showShorts;       startShelfChecks()                        }));//toggleShortsShelf();
        menuContainer.appendChild(createCheckbox('Show Games',                          'enhancer-show-games',            () => { showGames          = !showGames;        startShelfChecks();                       }));//toggleGamesShelf();
        menuContainer.appendChild(createCheckbox('Show Purchased Videos',               'enhancer-show-purchased',        () => { showPurchased      = !showPurchased;    togglePurchased();                        }));
        menuContainer.appendChild(createCheckbox('Show Watched Videos',                 'enhancer-show-watched',          () => { showWatched        = !showWatched;      processVideos();                          }));
        menuContainer.appendChild(createCheckbox('Show AI',                             'enhancer-show-ai',               () => { showAI             = !showAI;           startItemChecks();startVideoChecks();     }));
        menuContainer.appendChild(createCheckbox('Show Music',                          'enhancer-show-music',            () => { showMusic          = !showMusic;        toggleMusic();                            }));
        menuContainer.appendChild(createCheckbox('Show Playlists and Podcasts',         'enhancer-show-playlists',        () => { showPlaylists      = !showPlaylists;    startItemChecks();                        }));//togglePlaylists();
        menuContainer.appendChild(createCheckbox('Show Banner',                         'enhancer-show-banner',           () => { showBanner         = !showBanner;       toggleBanner();                           }));
        menuContainer.appendChild(createCheckbox('Show Free Movies',                    'enhancer-show-free-movies',      () => { showFreeMovies     = !showFreeMovies;   toggleFreeMovies();                       }));

        //Still Field Testing
        menuContainer.appendChild(createCheckbox('Show Member Only (beta)',             'enhancer-show-member-only',      () => { showMemberOnly     = !showMemberOnly;     toggleMemberOnly();      }));
        menuContainer.appendChild(createCheckbox('Enable Streamer Mode',                'enhancer-enable-streamer-mode',  () => { enableStreamerMode = !enableStreamerMode; toggleStreamerMode();    }));
        menuContainer.appendChild(createCheckbox('Show New To You Message (beta)',      'enhancer-show-new-to-you',       () => { showNewToYou       = !showNewToYou;       startItemChecks();       }));
        menuContainer.appendChild(createCheckbox('Enable More Videos Per Row (beta)',   'enhancer-more-videos-per-row',   () => { moreVideosPerRow   = !moreVideosPerRow;   checkItemsPerRow();      }));






      //menuContainer.appendChild(createCheckbox('Show New',                    'enhancer-show-new',         () => { showNew          = !showNew;          toggleNew();               }));

        document.body.appendChild(menuContainer);
        voiceSearchButton.parentElement.appendChild(menuButton);

        menuButton.addEventListener('click', e => {
            e.stopPropagation();
            const rect = menuButton.getBoundingClientRect();
            menuContainer.style.top = rect.bottom + 5 + 'px';
            menuContainer.style.left = rect.left + 'px';
            menuContainer.style.display = menuContainer.style.display === 'none' ? 'flex' : 'none';
        });
    }

    function waitForBody() {
        if (document.body) {
            createMenu();
            startObservers();
        }
        else {
            setTimeout(waitForBody, 50);
        }
    }
    waitForBody();

})();
