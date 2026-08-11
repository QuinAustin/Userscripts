// ==UserScript==
// @name        Paragraph String Replacer
// @namespace   Violentmonkey Scripts
// @version     1.0.0
//
// @match       https://example.com/*
// @grant       none
//
// @author      -
// @description replace words and phrases in paragraphs, with corrections and replacements. 
// ==/UserScript==


'use strict';
function tryReplacing(paragraph, text, findString, replaceString) {
     if (text.includes(findString)) {
        paragraph.textContent = text.replace(findString, replaceString);
    }
}

function changeSpellings() {
    console.debug("checking paragraphs");
    const paragraphs = document.querySelectorAll(".overflow-visible p"); //use the parent element of 'p' here as well.
    paragraphs.forEach(paragraph => {
        let text = paragraph.textContent
        tryReplacing(paragraph, text, "mispeling", "misspelling") //call function with the word to be replaced, and the word it is to be replaced with.
        tryReplacing(paragraph, text, "foo", "bar") //consecutive functions can use the same text variable for memoisation purposes.
    })
}

function paragraphsLoaded() {
    let content = document.querySelector(".overflow-visible p"); //replace with parent element of "p" elements, so they have time to load.  it also helps narrow down the scope of the query.
    if (content) {
        return true;
    }
    return false;
}
function observeQuery(query, funCondition, funFinish) {
    const observer = new MutationObserver(() => {
      if (funCondition()) {
        observer.disconnect();
        console.debug("Query Condition Met");
        funFinish();
        return true;
      }
    });
    observer.observe(query, { childList: true, subtree: true });
}

console.log("script started");
observeQuery(document.body, paragraphsLoaded, changeSpellings);