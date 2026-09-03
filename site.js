
var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  var els = [].slice.call(document.querySelectorAll('.reveal, .stagger, .draw, .wipe'));
  if(!els.length) return;

  function showAll(){ els.forEach(function(e){ e.classList.add('in'); }); els = []; }
  if(REDUCE){ showAll(); return; }

  var ticking = false;
  function check(){
    ticking = false;
    if(!els.length) return;
    var trigger = window.innerHeight * 0.94;
    var remaining = [];
    for(var i = 0; i < els.length; i++){
      var el = els[i];
      var r = el.getBoundingClientRect();
      if(r.top < trigger){
        // already scrolled past -> reveal instantly, no transition
        if(r.bottom < 0) el.classList.add('in-fast');
        el.classList.add('in');
      } else remaining.push(el);
    }
    els = remaining;
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(check); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', check);
  window.addEventListener('pageshow', check);
  check();
  // fail-safe: nothing may stay invisible
  setTimeout(check, 400);
  setTimeout(showAll, 6000);
})();

(function(){
  var bar = document.getElementById('scrollProgress');
  if(!bar) return;
  var t = false;
  function up(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  up();
})();

(function(){
  var btn = document.getElementById('navToggleBtn'), nav = document.getElementById('navLinks');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); });
  });
})();

(function(){
  var b = document.getElementById('backToTop');
  if(!b) return;
  window.addEventListener('scroll', function(){ b.classList.toggle('show', window.scrollY > 700); }, { passive:true });
  b.addEventListener('click', function(){ window.scrollTo({ top:0, behavior: REDUCE ? 'auto' : 'smooth' }); });
})();

(function(){
  var hero = document.getElementById('heroSection');
  var glow = document.getElementById('heroGlow');
  var tilt = document.getElementById('heroTilt');
  if(!hero || REDUCE) return;
  hero.addEventListener('mousemove', function(e){
    var r = hero.getBoundingClientRect();
    var x = ((e.clientX - r.left) / r.width) * 100;
    var y = ((e.clientY - r.top) / r.height) * 100;
    if(glow){ glow.style.setProperty('--mx', x+'%'); glow.style.setProperty('--my', y+'%'); }
    if(tilt) tilt.style.transform = 'rotateX(' + (((y-50)/50)*-6) + 'deg) rotateY(' + (((x-50)/50)*8) + 'deg)';
  });
  hero.addEventListener('mouseleave', function(){ if(tilt) tilt.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
})();

(function(){
  var cs = document.querySelectorAll('.count[data-target]');
  if(!cs.length) return;
  function fmt(v,d){ return v.toLocaleString('ja-JP',{ minimumFractionDigits:d, maximumFractionDigits:d }); }
  function run(el){
    var target = parseFloat(el.getAttribute('data-target'));
    var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if(REDUCE || isNaN(target)){ el.textContent = fmt(target,d); return; }
    var start = null, dur = 1500;
    function step(ts){
      if(start === null) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1-p,3)), d);
      if(p < 1) requestAnimationFrame(step); else el.textContent = fmt(target,d);
    }
    requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){ cs.forEach(run); return; }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } });
  }, { threshold:0.5 });
  cs.forEach(function(c){ io.observe(c); });
})();

(function(){
  var btns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  if(!btns.length) return;
  function select(btn){
    btns.forEach(function(b){
      var on = (b === btn);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if(p) p.classList.toggle('active', on);
    });
  }
  btns.forEach(function(b,i){
    b.addEventListener('click', function(){ select(b); });
    b.addEventListener('keydown', function(e){
      var n = null;
      if(e.key === 'ArrowRight') n = btns[(i+1) % btns.length];
      if(e.key === 'ArrowLeft')  n = btns[(i-1+btns.length) % btns.length];
      if(n){ e.preventDefault(); n.focus(); select(n); }
    });
  });
})();

(function(){
  var wrap = document.getElementById('roadWrap'), fill = document.getElementById('roadFill');
  if(!wrap || !fill) return;
  var t = false;
  function up(){
    var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.62 - r.top) / r.height;
    fill.style.height = Math.max(0, Math.min(1, p)) * r.height + 'px';
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();

(function(){
  if(REDUCE) return;
  var arts = Array.prototype.slice.call(document.querySelectorAll('.section-art'));
  if(!arts.length) return;
  var t = false;
  function up(){
    var vh = window.innerHeight;
    arts.forEach(function(a){
      var r = a.getBoundingClientRect();
      if(r.bottom < -100 || r.top > vh + 100) return;
      var c = (r.top + r.height/2 - vh/2) / vh;
      a.style.transform = 'translateY(' + (c * -14).toFixed(2) + 'px)';
    });
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  up();
})();

/* ---- 3D tilt on cards ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var cards = document.querySelectorAll('.tilt-card');
  cards.forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(900px) rotateX(' + (((y-0.5)*-7).toFixed(2)) + 'deg) rotateY(' + (((x-0.5)*9).toFixed(2)) + 'deg) translateY(-6px)';
    });
    card.addEventListener('pointerleave', function(){ card.style.transform = ''; });
  });
})();

/* ---- soft page transition between pages ---- */
(function(){
  if(REDUCE) return;
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a') : null;
    if(!a) return;
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if(a.target && a.target !== '_self') return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
    if(!/\.html$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function(){ window.location.href = href; }, 240);
  });
  window.addEventListener('pageshow', function(){ document.body.classList.remove('leaving'); });
})();

/* ---- ecosystem card <-> ring node linking ---- */
(function(){
  var cards = document.querySelectorAll('.eco-card[data-stage]');
  if(!cards.length) return;
  cards.forEach(function(card){
    var node = document.getElementById('eco-n' + card.getAttribute('data-stage'));
    if(!node) return;
    card.addEventListener('mouseenter', function(){ node.classList.add('hot'); });
    card.addEventListener('mouseleave', function(){ node.classList.remove('hot'); });
    card.addEventListener('focusin',  function(){ node.classList.add('hot'); });
    card.addEventListener('focusout', function(){ node.classList.remove('hot'); });
  });
})();

/* ---- お知らせを news.js から描画 ---- */
(function(){
  var list = document.getElementById('newsList');
  if(!list) return;
  function esc(s){ return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var data = (typeof NEWS !== 'undefined' && Object.prototype.toString.call(NEWS) === '[object Array]') ? NEWS : [];
  if(!data.length){
    list.innerHTML = '<p style="padding:18px 0; color:var(--ink-soft); font-size:.9rem;">お知らせは準備中です。</p>';
    return;
  }
  var limit = parseInt(list.getAttribute('data-limit') || '0', 10);
  var items = (limit > 0) ? data.slice(0, limit) : data;
  var html = '';
  items.forEach(function(n){
    if(!n || !n.title) return;
    var inner = '<span class="date">' + esc(n.date) + '</span>'
              + '<span class="news-title">' + esc(n.title) + '</span>'
              + '<span class="tag">' + esc(n.tag) + '</span>';
    if(n.url){
      var ext = /^https?:/i.test(n.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      html += '<a class="news-item" href="' + esc(n.url) + '"' + ext + '>' + inner + '</a>';
    } else {
      html += '<div class="news-item">' + inner + '</div>';
    }
  });
  list.innerHTML = html;
  list.classList.add('in');
})();

/* ---- 記事ページの日付・タグを news.js と常に一致させる ----
   news.js側でtag（カテゴリ名）やdateを直しても、記事本体のHTMLを
   1本ずつ書き換えなくて済むように、ここで上書きする。 */
(function(){
  var meta = document.querySelector('.article-meta');
  if(!meta) return;
  var data = (typeof NEWS !== 'undefined' && Object.prototype.toString.call(NEWS) === '[object Array]') ? NEWS : [];
  if(!data.length) return;
  var file = location.pathname.split('/').pop();
  var item = null;
  for (var i = 0; i < data.length; i++){
    if (data[i] && data[i].url && data[i].url.split('/').pop() === file){ item = data[i]; break; }
  }
  if(!item) return;
  var d = meta.querySelector('.date'), t = meta.querySelector('.tag');
  if(d && item.date) d.textContent = item.date;
  if(t && item.tag)  t.textContent = item.tag;
})();

/* ============================================================
   MOTION LAYER  ―  動きの制御（内容は変更しません）
   ============================================================ */

/* ---- 1. カードのスポットライト追従 ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var sel = '.gate,.benefit,.body-card,.eco-card,.phase-card,.qs,.step3,.ask,.pager a,.trivia-card';
  var pending = null;
  document.addEventListener('pointermove', function(e){
    var card = e.target.closest ? e.target.closest(sel) : null;
    if(!card) return;
    if(pending) return;
    pending = requestAnimationFrame(function(){
      pending = null;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (((e.clientX - r.left)/r.width)*100).toFixed(1) + '%');
      card.style.setProperty('--my', (((e.clientY - r.top)/r.height)*100).toFixed(1) + '%');
    });
  }, { passive:true });
})();

/* ---- 2. ボタンのマグネット挙動 ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var btns = Array.prototype.slice.call(document.querySelectorAll('.btn'));
  btns.forEach(function(b){
    var raf = null;
    b.addEventListener('pointermove', function(e){
      if(raf) return;
      raf = requestAnimationFrame(function(){
        raf = null;
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
        var dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
        b.style.transform = 'translate(' + (dx*5).toFixed(2) + 'px,' + (dy*3 - 3).toFixed(2) + 'px)';
      });
    }, { passive:true });
    b.addEventListener('pointerleave', function(){ b.style.transform = ''; });
    b.addEventListener('blur', function(){ b.style.transform = ''; });
  });
})();

/* ---- 3. 写真の視差 ---- */
(function(){
  if(REDUCE) return;
  var imgs = Array.prototype.slice.call(
    document.querySelectorAll('.photo-band img, .photo-split .ps-img img'));
  if(!imgs.length) return;
  var live = [], t = false;
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){
      var i = live.indexOf(e.target);
      if(e.isIntersecting){ if(i < 0) live.push(e.target); }
      else if(i >= 0) live.splice(i,1);
    });
    up();
  }, { rootMargin:'80px 0px' });
  imgs.forEach(function(im){ io.observe(im); });
  function up(){
    var vh = window.innerHeight;
    live.forEach(function(im){
      var r = im.getBoundingClientRect();
      var c = (r.top + r.height/2 - vh/2) / vh;      /* -1 .. 1 */
      var shift = Math.max(-1, Math.min(1, c)) * -13; /* px */
      im.style.setProperty('--par', shift.toFixed(1) + 'px');
    });
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();

/* ---- 4. 舞い落ちるオリーブの葉（装飾） ---- */
(function(){
  if(REDUCE) return;
  var hosts = Array.prototype.slice.call(document.querySelectorAll('.hero, .quote-band, .page-head-band'));
  if(!hosts.length) return;
  hosts.forEach(function(host, hi){
    var box = document.createElement('div');
    box.className = 'petals';
    box.setAttribute('aria-hidden','true');
    var n = host.classList.contains('hero') ? 9 : (host.classList.contains('page-head-band') ? 5 : 6);
    for(var i = 0; i < n; i++){
      var leaf = document.createElement('i');
      var dur = 14 + Math.random()*13;
      leaf.style.left = (Math.random()*96).toFixed(1) + '%';
      leaf.style.animationDuration = dur.toFixed(1) + 's';
      leaf.style.animationDelay = (-Math.random()*dur).toFixed(1) + 's';
      leaf.style.setProperty('--drift', ((Math.random()*150) - 60).toFixed(0) + 'px');
      box.appendChild(leaf);
    }
    if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(box);
  });
})();

/* ---- 5. トップへ戻るボタンの進捗リング＋ヘッダーの影 ---- */
(function(){
  var btn = document.getElementById('backToTop');
  var head = document.querySelector('header.site');
  if(!btn && !head) return;
  var t = false;
  function up(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if(btn) btn.style.setProperty('--p', p.toFixed(1));
    if(head) head.classList.toggle('stuck', h.scrollTop > 12);
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  up();
})();

/* ---- 6. ヒーロー／見出し帯のスクロール連動 ---- */
(function(){
  if(REDUCE) return;
  var hero = document.querySelector('.hero-grid');
  var head = document.querySelector('.page-head-band .ph-inner');
  if(!hero && !head) return;
  var t = false;
  function up(){
    var y = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;
    if(hero){
      var p = Math.max(0, Math.min(1, y / (vh * 0.85)));
      hero.style.setProperty('--heroFade', (1 - p * 0.85).toFixed(3));
      hero.style.setProperty('--heroRise', (p * 54).toFixed(1) + 'px');
      hero.style.setProperty('--heroZoom', (1 - p * 0.03).toFixed(4));
    }
    if(head){
      var q = Math.max(0, Math.min(1, y / (vh * 0.7)));
      head.style.setProperty('--headFade', (1 - q * 0.8).toFixed(3));
      head.style.setProperty('--headRise', (q * 38).toFixed(1) + 'px');
    }
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();
