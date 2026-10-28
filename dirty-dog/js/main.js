
(function(){
  function money(x){return '$'+x.toFixed(2);}
  function initPdp(root){
    var main=root.querySelector('[data-main]');
    root.querySelectorAll('.thumbs button').forEach(function(b){
      b.addEventListener('click',function(){
        main.src=b.dataset.src; main.alt=b.dataset.alt;
        root.querySelectorAll('.thumbs button').forEach(function(x){x.setAttribute('aria-current','false');});
        b.setAttribute('aria-current','true');
      });
    });
    var sub=root.querySelector('[data-sub]');
    function update(){
      var tier=root.querySelector('.tiers input:checked');
      var subOn=sub&&sub.checked;
      var total=subOn? +sub.dataset.subprice : (+tier.dataset.pack)*(+tier.dataset.n);
      var txt=money(total)+(subOn?' per delivery':'');
      root.querySelector('[data-total]').textContent=txt;
      root.querySelectorAll('.tiers input').forEach(function(t){t.disabled=!!subOn;});
      root.querySelector('.tiers').style.opacity=subOn?.5:1;
      var s=root.parentNode.querySelector('[data-stotal]'); if(s) s.textContent=txt;
    }
    root.addEventListener('change',update); update();
  }
  document.querySelectorAll('[data-pdp]').forEach(initPdp);

  // sticky add-to-cart (mobile) appears once the main button scrolls out of view
  var bars=document.querySelectorAll('[data-sticky]');
  if('IntersectionObserver' in window){
    bars.forEach(function(bar){
      var scope=bar.parentNode; var atc=scope.querySelector('[data-atc]'); if(!atc) return;
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          var past=!e.isIntersecting && e.boundingClientRect.top<0;
          bar.classList.toggle('show',past); document.body.classList.toggle('has-sticky',past);
        });
      }).observe(atc);
    });
  }

  // shop filters
  document.querySelectorAll('.filters').forEach(function(f){
    var grid=f.parentNode.querySelector('.shop-grid');
    f.addEventListener('click',function(e){
      var b=e.target.closest('.chip'); if(!b) return;
      f.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed',c===b?'true':'false');});
      grid.querySelectorAll('.pcard').forEach(function(c){c.style.display=(b.dataset.f==='all'||c.classList.contains(b.dataset.f))?'':'none';});
    });
  });

  // close mobile menu after choosing a link
  document.querySelectorAll('.mmenu a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details'); if(d) d.removeAttribute('open');});});
})();
