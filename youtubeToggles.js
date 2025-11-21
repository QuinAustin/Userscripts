// ==UserScript==
// @name         YouTube Toggles
// @namespace    Violentmonkey Scripts
// @version      1.0
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




    let enableLogging =       localStorage.getItem('enhancer-logging')        === 'false' ? false : true;
    let showBreakingNews =    localStorage.getItem('enhancer-breaking-news')  === 'false' ? false : true;
    let showShorts =          localStorage.getItem('enhancer-show-shorts')    === 'false' ? false : true;
    let showGames =           localStorage.getItem('enhancer-show-games')     === 'false' ? false : true;
    let showWatched =         localStorage.getItem('enhancer-show-watched')   === 'false' ? false : true;
    let showPurchased =       localStorage.getItem('enhancer-show-purchased') === 'false' ? false : true;
    let showAI =              localStorage.getItem('enhancer-show-ai')        === 'false' ? false : true;
    let showMusic =           localStorage.getItem('enhancer-show-music')     === 'false' ? false : true;
    let showPlaylists =       localStorage.getItem('enhancer-show-playlists') === 'false' ? false : true;
    let showBanner =          localStorage.getItem('enhancer-show-banner')    === 'false' ? false : true;
  //let showNew = localStorage.getItem('enhancer-show-new') === 'false' ? false : true;

    let fullyWatchedElements = new WeakSet();

    function processVideos() {
        const items = document.querySelectorAll('ytd-rich-item-renderer');
        items.forEach(item => {
            const progressSegment = item.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
            let watchedPercent = progressSegment ? parseFloat(progressSegment.style.width) || 0 : 0;

            if (watchedPercent === 100) { //can swap to being >= 50 if you want to also remove videos watched 50% of the way through
                fullyWatchedElements.add(item);
            }

            if (!showWatched && fullyWatchedElements.has(item)) {
                item.style.display = 'none';
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
                const duration    = item.querySelector('.yt-badge-shape__text')?.textContent.trim();

                console.log({ title, channelName, channelURL, views, uploadDate, duration, watchedPercent});
              }
              catch (e) {
                console.log('metadata could not be found')
              }
            }
        });
    }

    function toggleBreakingNewsShelf() {
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
            if (title === 'breaking news') {
                shelf.style.display = showBreakingNews ? '' : 'none';
            }
        });
    }

    function toggleShortsShelf() {
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
            if (title && title.includes('shorts')) {
                shelf.style.display = showShorts ? '' : 'none';
            }
        });
    }

    function toggleGamesShelf() {
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
            if (title && title.includes('youtube playables')) {
                shelf.style.display = showGames ? '' : 'none';
            }
        });
    }

    function toggleAIShelf() {
        document.querySelectorAll('ytd-rich-section-renderer').forEach(section => {
          if (section.querySelector('ytd-talk-to-recs-flow-renderer')) {
            section.style.display = showAI ? '' : 'none';
          }
        });
    }


    function toggleMusic() {
      document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
        const mixBadge = item.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
        const mixBadge2 = item.querySelector('.yt-badge-shape__icon'); //this badge appears to the left of the duration

        if (!mixBadge && !mixBadge2) { return }; //i.e. not a music video

        let m5 = false;
        if (mixBadge2) {
          try {
            if (mixBadge2.querySelector('path').getAttribute('d').startsWith("M5")) { //might need to add an || d.startsWith("M2"), but it only happened once so not positive
              //console.log('M5 found');
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


    function togglePlaylists() {
      //might eventually need to add a check for the path M6 like in the music check.
      document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
        const playlistBadge = item.querySelector('.yt-badge-shape__text')?.textContent.trim().toLowerCase();
        if (playlistBadge && (playlistBadge.includes('episodes') || playlistBadge.includes('lessons'))) {
          item.style.display = showPlaylists ? '' : 'none';
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

  /*
    function toggleNew() {
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            const title = shelf.querySelector('#title')?.textContent.trim().toLowerCase();
            if (title && title.includes('youtube new_thing')) {
                shelf.style.display = showNew ? '' : 'none';
            }
        });
    }
  */


    function startObservers() {
        const observer = new MutationObserver(() => {
            processVideos();

            toggleBreakingNewsShelf();
            toggleShortsShelf();
            toggleGamesShelf();
            togglePurchased();
            toggleAIShelf();
            toggleMusic();
            togglePlaylists();
            toggleBanner();
            //toggleNew();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }




    function createMenu() {
        const voiceSearchButton = document.querySelector('#voice-search-button');
        if (!voiceSearchButton) return;

        const menuButton = document.createElement('yt-button');
        menuButton.className = 'yt-spec-button-shape-next--size-m';
        menuButton.textContent = 'Enhancer Menu';
        menuButton.style.cursor = 'pointer';
        menuButton.style.marginLeft = '10px';
        menuButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
        menuButton.style.color = '#f1f1f1';
        menuButton.style.padding = '6px 16px';
        menuButton.style.borderRadius = '9999px';
        menuButton.style.height = '32px';
        menuButton.style.minWidth = 'auto';
        menuButton.style.fontSize = '14px';
        menuButton.style.fontWeight = '500';
        menuButton.style.display = 'inline-flex';
        menuButton.style.alignItems = 'center';
        menuButton.style.justifyContent = 'center';

        menuButton.addEventListener('mouseenter', () => { menuButton.style.backgroundColor = 'rgba(255,255,255,0.15)'; });
        menuButton.addEventListener('mouseleave', () => { menuButton.style.backgroundColor = 'rgba(255,255,255,0.1)'; });
        menuButton.addEventListener('mousedown', () => { menuButton.style.transform = 'scale(0.95)'; });
        menuButton.addEventListener('mouseup', () => { menuButton.style.transform = 'scale(1)'; });

        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'fixed';
        menuContainer.style.backgroundColor = '#222';
        menuContainer.style.color = '#fff';
        menuContainer.style.padding = '10px';
        menuContainer.style.display = 'none';
        menuContainer.style.zIndex = '9999';
        menuContainer.style.border = '1px solid #555';
        menuContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        menuContainer.style.whiteSpace = 'nowrap';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.gap = '5px';
        menuContainer.style.borderRadius = '4px';

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

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.marginLeft = '6px';
            label.style.cursor = 'pointer';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            return wrapper;
        };

        // Menu options
        menuContainer.appendChild(createCheckbox('Log Metadata', 'enhancer-logging', () => { enableLogging = !enableLogging; processVideos(); }));
        menuContainer.appendChild(createCheckbox('Show Breaking News', 'enhancer-breaking-news', () => { showBreakingNews = !showBreakingNews; toggleBreakingNewsShelf(); }));
        menuContainer.appendChild(createCheckbox('Show Shorts', 'enhancer-show-shorts', () => { showShorts = !showShorts; toggleShortsShelf(); }));
        menuContainer.appendChild(createCheckbox('Show Games', 'enhancer-show-games', () => { showGames = !showGames; toggleGamesShelf()}))
        menuContainer.appendChild(createCheckbox('Show Purchased Videos', 'enhancer-show-purchased', () => { showPurchased = !showPurchased; togglePurchased(); }));
        menuContainer.appendChild(createCheckbox('Show Watched Videos', 'enhancer-show-watched', () => { showWatched = !showWatched; processVideos(); }));
        menuContainer.appendChild(createCheckbox('Show AI', 'enhancer-show-ai', () => { showAI = !showAI; toggleAIShelf()}))
        menuContainer.appendChild(createCheckbox('Show Music', 'enhancer-show-music', () => { showMusic = !showMusic; toggleMusic()}))
        menuContainer.appendChild(createCheckbox('Show Playlists and Podcasts', 'enhancer-show-playlists', () => { showPlaylists = !showPlaylists; togglePlaylists()}))
        menuContainer.appendChild(createCheckbox('Show Banner', 'enhancer-show-banner', () => { showBanner = !showBanner; toggleBanner()}))
      //menuContainer.appendChild(createCheckbox('Show New', 'enhancer-show-new', () => { showNew = !showNew; toggleNew()}))

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
