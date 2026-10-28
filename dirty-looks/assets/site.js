
(function(){
  document.querySelectorAll('[data-menu-btn]').forEach(function(mb){var mm=mb.closest('header').querySelector('[data-menu]');
    if(mm)mb.addEventListener('click',function(){var o=mm.classList.toggle('open');mb.setAttribute('aria-expanded',o)})});
  document.querySelectorAll('a[href="#"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault()})});
  document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button');if(b){b.textContent='Mock-up only';}})});
  function fmt(n){return '$'+n.toFixed(2)}
  document.querySelectorAll('[data-buybox]').forEach(function(box){
    var tiers=box.querySelectorAll('.tier'),sub=box.querySelector('[data-sub]'),btn=box.querySelector('[data-atc]');
    var scope=box.closest('.pg')||document,sBar=scope.querySelector('.sticky-atc'),cta=btn?btn.getAttribute('data-label'):'Add to cart';
    function update(){
      var on=box.querySelector('.tier input:checked'),subOn=sub&&sub.checked;
      tiers.forEach(function(t){t.classList.toggle('on',t.querySelector('input').checked);
        var p=parseFloat(t.dataset.price),n=parseInt(t.dataset.count,10),packs=parseInt(t.dataset.packs,10);
        t.querySelector('[data-pu]').textContent=fmt(p/packs)+' / pouch · '+fmt(p/n)+' / gummy';});
      if(on){var t=on.closest('.tier'),p=parseFloat(t.dataset.price);
        var label=t.querySelector('.t-name').textContent+(subOn?' · subscribe (discount TBC)':' · one-time');
        if(btn)btn.textContent=cta+' · '+fmt(p);
        if(sBar){sBar.querySelector('[data-s-name]').textContent=label;sBar.querySelector('[data-s-price]').textContent=fmt(p)+' (Sample price)';}}
    }
    tiers.forEach(function(t){t.querySelector('input').addEventListener('change',update)});
    if(sub)sub.addEventListener('change',update);
    if(btn)btn.addEventListener('click',function(e){e.preventDefault();btn.textContent='Mock-up: cart not connected'});
    update();
    if(sBar&&btn&&'IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(en){sBar.classList.toggle('show',!en.isIntersecting&&en.boundingClientRect.top<0)})}).observe(btn);
      sBar.querySelector('.btn').addEventListener('click',function(e){e.preventDefault();btn.scrollIntoView({behavior:'smooth',block:'center'})});
    }
  });
  document.querySelectorAll('[data-to-buy]').forEach(function(a){a.addEventListener('click',function(e){var s=(a.closest('.pg')||document).querySelector('[data-atc]');if(s){e.preventDefault();s.scrollIntoView({behavior:'smooth',block:'center'})}})});
  document.querySelectorAll('[data-thumbs]').forEach(function(g){var main=g.querySelector('.main img');
    g.querySelectorAll('.thumbs img').forEach(function(t){t.style.cursor='pointer';t.addEventListener('click',function(){main.src=t.src;main.alt=t.alt})});});
})();
