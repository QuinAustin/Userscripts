// ==UserScript==
// @name        Paragraph String Replacer
// @namespace   Violentmonkey Scripts
// @version     1.0.3
// @description Used for replacing words with different words
// @author      -
// @match       https://example.com/*
// @grant       none

// @description replace words and phrases in paragraphs, with corrections and replacements.
// ==/UserScript==


'use strict';

//input:
//[1] Element with textContent
//[2] the result of [1].textContent()
//[3] Words in list to replace
//[4] Replacement word to be used for .replace() [3]

//result:
//the textContent of [1] has all instances of [3] replaced with [4]
function replaceText(textElement, text, wordList, replacementWord) {
  wordList.forEach(word => {
    if (text.includes(word)) {
      textElement.textContent = text.replace(word, replacementWord);
    }
  });
}

function changeSpellings() {
    console.debug("Checking Text Element");
    //could use a switch case to determine what element or word list to use, based on the document url.
    const textElements = document.querySelectorAll(".overflow-visible p"); //Parent Element of Text Body
    textElements.forEach(textEl => {
        let text = textEl.textContent;
        replaceText(textEl, text, ["foo", "bar"], ("baz"));
      });
}

function paragraphsLoaded() {
    let content = document.querySelector(".overflow-visible p"); //Parent Element of Text Body
    if (content) {
        return true;
    }
    return false;
}
function observeQuery(query, funCondition, funFinish) {
    const observer = new MutationObserver(() => {
      if (funCondition()) {
        funFinish();
      }
    });
    observer.observe(query, { childList: true, subtree: true });
}
observeQuery(document.body, paragraphsLoaded, changeSpellings);