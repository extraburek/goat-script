// ==UserScript==
// @name         The Goatscript
// @namespace    http://0chan.cf/
// @version      0.2.1
// @description  Shows hidden posts on www.0-chan.ru
// @icon         https://raw.github.com/Juribiyan/goat-script/master/icon.png
// @updateURL    https://raw.github.com/Juribiyan/goat-script/master/goatscript.meta.js
// @author       Snivy
// @match        http://www.0-chan.ru/*
// @grant        none
// ==/UserScript==
'use strict';

var injector = {
  inject: function(alias, css) {
    var head = document.head || document.getElementsByTagName('head')[0], 
    style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'injector:' + alias;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  },
  remove: function(alias) {
    var style = document.getElementById('injector:' + alias);
    if(style) {
      var head = document.head || document.getElementsByTagName('head')[0];
      if(head)
        head.removeChild(document.getElementById('injector:' + alias));
    }
  }
};

var logo = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 183818 183818"><path fill="white" d="M118953 51378c-2145,-1711 773,5871 2214,7790 1468,1937 -1762,8667 -2214,8216 -478,-461 0,-9058 0,-9058 0,0 -1199,-4169 -4612,-9119 -7712,-11151 -25046,-34721 -26106,-34504 -1545,321 -4168,4056 -3682,7356 487,3300 24378,38412 22059,40435 -14703,-7347 -15450,-18784 -18377,-18376 -9987,1363 -5514,199 -10760,2796 -1398,686 -4611,3083 -6409,5037 -1815,1954 -9744,14755 -16579,22146 -6826,7382 -30083,22424 -34677,25620 -4586,3195 -2311,6009 -1433,6895 877,895 10013,-1381 11029,0 1025,1381 -7347,7356 -17534,9814 -8494,4464 556,9084 2240,9318 1685,243 20991,-7408 22650,-8102 1806,-756 3587,-964 3673,0 79,955 -14668,8771 -22058,11029 -7382,2275 1954,5697 11333,7946 9371,2250 8207,-4038 13774,-4038 5575,0 11003,5723 14069,10717 3065,5011 -3735,30821 556,33010 4290,2189 17143,-18186 18793,-18099 1650,78 -2979,10239 -1112,10717 1868,469 11985,-22432 11560,-28694 -417,-6253 -8364,-12532 5019,-16431 10570,-6157 27392,-25290 28955,-24534 1563,773 -7929,20704 -11030,25732 -3074,5011 10891,18855 12558,20383 1668,1537 9050,-842 24647,-13930 15598,-13088 29163,-40027 28972,-45811 -200,-5793 -55382,-32559 -57518,-34261zm-11012 -17282c0,0 13374,-13279 31759,-12037 18394,1259 25950,9692 29415,14703 3483,5020 -12150,-8580 -29415,-7356 -17256,1216 -29397,7200 -29397,7200l-2362 -2510zm-10995 -12662c0,0 15771,-14643 35407,-14087 19636,556 25663,-2753 40436,11030 14790,11342 -9970,-365 -17500,-982 -7521,-1667 -26618,-6366 -37647,4664 -12115,9892 -11091,11081 -11091,11081l-9605 -11706zm-7799 51108c-833,1399 -7269,3266 -10447,3492 -3179,199 -3752,234 -4316,-982 -574,-1207 2918,-5549 7025,-5801 4126,-252 8581,1902 7738,3291z"/></svg>';

injector.inject('GS_UI', 
'#gs-container {\
  position: fixed;\
  top: 0;\
  right: 0;\
  background: black;\
  z-index: 99999;\
  border-bottom-left-radius: 7px;\
  cursor: pointer;\
}\
#gs-head {\
  position: relative;\
  display: inline-block;\
  vertical-align: middle;\
}\
#gs-indicator {\
  height: 6px;\
  width: 6px;\
  border-radius: 2px;\
  position: absolute;\
  top: 2px;\
  left: 2px;\
}\
.gs-on #gs-indicator {\
  background: #1ED000;\
}\
.gs-off #gs-indicator {\
  background: #FF0039;\
}\
.gs-on {\
  opacity: 0.75;\
}\
.gs-off {\
  opacity: 0.5;\
}\
#gs-counter {\
  display: inline-block;\
  color: white;\
  height: 25px;\
  top: 0;\
  position: relative;\
  vertical-align: middle;\
  font-size: 14px;\
  line-height: 25px;\
  padding: 0 5px;\
}\
.shady .reply {\
  background: #F1C7C7;\
  border-color: #DE9494;\
}');

var gs = {
  init: function(on) {
    var hiddenReplies = $('div[id^=replies] .shady').length,
    hiddenThreads = $('.shady').length - hiddenReplies;
    $('#gs-counter').text(hiddenThreads+'/'+hiddenReplies);
    if(on) this.show(); 
    else this.hide();
  },
  show: function() {
    injector.inject('gs-unshade', '.shady, span[id^="unhidethread"][style="display: none;"]+div:not(.de-thr-hid)[style^="display: none"], input[type=hidden]+div[style^="display: none"] {display: block!important} ');
    $('#gs-container').removeClass('gs-off').addClass('gs-on');
    this.on = true;
    localStorage['GS_showHiddenPosts'] = 1;
  },
  hide: function() {
    injector.remove('gs-unshade');
    $('#gs-container').removeClass('gs-on').addClass('gs-off');
    this.on = false;
    localStorage['GS_showHiddenPosts'] = 0;
  },
  toggle: function() {
    if(this.on) this.hide(); else this.show();
  }
}

$(document).ready(function() {
  if(!localStorage.hasOwnProperty('GS_showHiddenPosts'))
    localStorage['GS_showHiddenPosts'] = true;
  var on = +(localStorage['GS_showHiddenPosts'] || 1);
  $('body').append(
  '<div id="gs-container" class="'+(on ? 'gs-on' : 'gs-off')+'">\
    <div id="gs-head" title="Вкл/Выкл">\
      <img src=\''+logo+'\'>\
      <div id="gs-indicator"></div>\
    </div>\
    <div id="gs-counter" title="Треды/Посты"></div>\
  </div>'
  );
  gs.init(on);
  $('#gs-container').click(gs.toggle.bind(gs));
});
