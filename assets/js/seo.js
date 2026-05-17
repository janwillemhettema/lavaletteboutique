/* seo.js — shared functions for La Vallette SEO pages
   Used by: boutique-stay-uzes, pont-du-gard, cycling-uzes-gard,
            restaurants-uzes, things-to-do-uzes
   NOT used by: homepage (has its own system)
*/

(function(){
  'use strict';

  var TR = {};
  var LANG = 'en';
  var LANGS = ['en','fr','nl','de','es','it'];

  // ── Language switching ──────────────────────────────

  function setLang(l){
    LANG = l;
    try { localStorage.setItem('sl', l); } catch(e){}

    // Update select
    var sel = document.getElementById('langSel');
    if(sel) sel.value = l;

    // Apply translations
    var t = TR[l] || TR.en || {};
    var keys = Object.keys(t);
    for(var i = 0; i < keys.length; i++){
      var el = document.getElementById(keys[i]);
      if(!el) continue;
      var v = t[keys[i]];
      if(typeof v === 'string' && v.indexOf('<') >= 0){
        el.innerHTML = v;
      } else if(v !== undefined){
        el.textContent = v;
      }
    }

    // Update mailto subjects
    var subjects = {
      en:'Reservation%20enquiry', fr:'Demande%20de%20r%C3%A9servation',
      nl:'Reserveringsverzoek', de:'Reservierungsanfrage',
      es:'Consulta%20de%20reserva', it:'Richiesta%20di%20prenotazione'
    };
    var links = document.querySelectorAll('a[href*="mailto:bonjour"]');
    for(var j = 0; j < links.length; j++){
      links[j].href = 'mailto:bonjour@lavalletteboutique.com?subject=' + (subjects[l] || subjects.en);
    }
  }

  // ── Scroll reveal ──────────────────────────────────

  function initScrollReveal(){
    if(!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function(entries){
      for(var i = 0; i < entries.length; i++){
        if(entries[i].isIntersecting){
          entries[i].target.classList.add('vis');
        }
      }
    }, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});

    var els = document.querySelectorAll('.sr');
    for(var i = 0; i < els.length; i++){
      obs.observe(els[i]);
    }
  }

  // ── Nav scroll ─────────────────────────────────────

  function initNavScroll(){
    var nav = document.getElementById('nav');
    if(!nav) return;
    window.addEventListener('scroll', function(){
      nav.classList.toggle('sc', window.scrollY > 40);
    }, {passive: true});
  }

  // ── FAQ accordion ──────────────────────────────────

  function initFAQ(){
    var buttons = document.querySelectorAll('.faq-q');
    for(var i = 0; i < buttons.length; i++){
      buttons[i].addEventListener('click', function(){
        this.parentElement.classList.toggle('open');
      });
    }
  }

  // ── Page init ──────────────────────────────────────

  function initPage(translationUrl){
    initNavScroll();
    initScrollReveal();
    initFAQ();

    // Build language select handler
    var sel = document.getElementById('langSel');
    if(sel){
      sel.addEventListener('change', function(){
        setLang(this.value);
      });
    }

    // Load translations
    if(translationUrl){
      fetch(translationUrl)
        .then(function(r){ return r.json(); })
        .then(function(data){
          TR = data;
          // Detect language
          var saved = null;
          try { saved = localStorage.getItem('sl'); } catch(e){}
          var browser = (navigator.language || 'en').slice(0,2).toLowerCase();
          var lang = LANGS.indexOf(saved) >= 0 ? saved :
                     LANGS.indexOf(browser) >= 0 ? browser : 'en';
          setLang(lang);
        })
        .catch(function(){
          // English is the HTML default — page remains usable
        });
    }
  }

  // Expose
  window.setLang = setLang;
  window.initPage = initPage;

})();
