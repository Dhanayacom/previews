
(function(){
"use strict";

var TIERS={
  1:{name:"1 set",books:4,price:598,mrp:999,upiSave:100,real:true},
  2:{name:"2 sets",books:8,price:1096,mrp:1998,upiSave:100},
  3:{name:"3 sets",books:12,price:1476,mrp:2997,upiSave:100}
};
function pct(p,m){return Math.round((m-p)/m*100)+"% off";}

var REVIEWS={count:5,avg:null,showAbove:5};
var IMG="assets/img/cover-hindi-240.webp";
function inr(n){var s=(Math.round(n*100)/100).toFixed(n%1?2:0);var p=s.split(".");var x=p[0];var l=x.slice(-3),o=x.slice(0,-3);if(o)l=o.replace(/\B(?=(\d{2})+(?!\d))/g,",")+","+l;return "₹"+l+(p[1]?"."+p[1]:"");}
function $(s,c){return (c||document).querySelector(s);} function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}
var sel=1;


function fillTiers(){
  $$("[data-tier]").forEach(function(card){
    var t=TIERS[card.getAttribute("data-tier")];
    var f=function(k,v){$$("[data-f='"+k+"']",card).forEach(function(e){e.textContent=v;});};
    f("price",inr(t.price)); f("mrp",inr(t.mrp)); f("perbook",inr(t.price/t.books));
    f("save",inr(t.mrp-t.price)); f("pct",pct(t.price,t.mrp)); f("upi",inr(t.price-t.upiSave));
  });
}
function render(){
  $$("[data-tierpb]").forEach(function(e){var x=TIERS[e.getAttribute("data-tierpb")];e.textContent=inr(x.price/x.books);});
  var t=TIERS[sel];
  $$(".tier").forEach(function(c){var on=c.getAttribute("data-tier")==sel;c.classList.toggle("on",on);var i=$("input",c);if(i)i.checked=on;});
  $$("[data-sel='price']").forEach(function(e){e.textContent=inr(t.price);});
  $$("[data-sel='mrp']").forEach(function(e){e.textContent=inr(t.mrp);});
  $$("[data-sel='pct']").forEach(function(e){e.textContent=pct(t.price,t.mrp);});
  $$("[data-sel='upipct']").forEach(function(e){e.textContent=pct(t.price-t.upiSave,t.mrp);});
  $$("[data-sel='save']").forEach(function(e){e.textContent=inr(t.mrp-t.price);});
  $$("[data-sel='upitotal']").forEach(function(e){e.textContent=inr(t.mrp-t.price+t.upiSave);});
  $$("[data-sel='upi']").forEach(function(e){e.textContent=inr(t.price-t.upiSave);});
  $$("[data-samplelbl]").forEach(function(e){e.hidden=!!t.real;});
  $$("[data-sel='upisave']").forEach(function(e){e.textContent=inr(t.upiSave);});
  $$("[data-sel='short']").forEach(function(e){e.textContent=t.name+" · "+t.books+" books";});
  $$("[data-sel='mrpline']").forEach(function(e){e.textContent="MRP "+inr(t.mrp);});
}
document.addEventListener("change",function(e){if(/^tier/.test(e.target.name)){sel=+e.target.value;render();}});


var KEY="dh_cart";
function getCart(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function setCart(c){try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){} drawCart();}
function count(c){var n=0;for(var k in c)n+=c[k];return n;}
function drawCart(){
  var c=getCart(),n=count(c),box=$("#cartBody"),foot=$("#cartFoot");
  $$(".badge-count").forEach(function(b){b.textContent=n;b.style.display=n?"flex":"none";});
  if(!box)return;
  if(!n){box.innerHTML='<div class="empty"><p><b>Your cart is empty. Pick your magic set.</b></p><a class="btn btn-red" href="product.html#buy">Choose your set</a></div>';foot.style.display="none";return;}
  var html="",total=0,mrp=0,keys=Object.keys(c);
  keys.forEach(function(k){var t=TIERS[k],q=c[k];total+=t.price*q;mrp+=t.mrp*q;
    html+='<div class="line" style="margin-bottom:10px"><img src="'+IMG+'" alt="" width="72" height="72"><div style="flex:1"><div class="t">'+t.name+'</div><div class="small muted">'+t.books+' books: Maths, English, Drawing, Hindi'+(t.books>4?' ×'+(t.books/4):'')+'</div><div><b>'+inr(t.price-t.upiSave)+' paid online</b> <span class="small muted">('+inr(t.price)+' Cash on Delivery)</span> <s class="small muted">MRP '+inr(t.mrp)+'</s>'+(t.real?'':' <span class="ptag">Sample price</span>')+'</div><div class="qty"><button type="button" aria-label="One less" data-q="'+k+'" data-d="-1">−</button><span>'+q+'</span><button type="button" aria-label="One more" data-q="'+k+'" data-d="1">+</button></div></div></div>';});
  var top=keys.map(Number).sort().pop();
  if(keys.length===1&&top<3&&c[top]===1){var nx=TIERS[top+1],cur=TIERS[top];
    html+='<div class="nudge">Add 1 more set for '+inr(nx.price-cur.price)+' more and save '+inr((nx.mrp-nx.price)-(cur.mrp-cur.price))+'. <button type="button" class="btn btn-line" data-up="'+top+'">Switch to '+nx.name+'</button></div>';}
  var cs=document.getElementById("cartSample");if(cs)cs.hidden=keys.every(function(k){return TIERS[k].real;});
  html+='<p class="small muted">Free delivery included · Pay online, save ₹100 · Cash on Delivery available</p>';
  box.innerHTML=html;
  $("#cartTotal").textContent=inr(total-100*count(c))+" paid online"; $("#cartMrp").textContent=inr(mrp); foot.style.display="block";
}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-q]");
  if(b){var c=getCart(),k=b.getAttribute("data-q");c[k]=(c[k]||0)+(+b.getAttribute("data-d"));if(c[k]<=0)delete c[k];setCart(c);return;}
  var u=e.target.closest("[data-up]");
  if(u){var k2=+u.getAttribute("data-up"),c2={};c2[k2+1]=1;setCart(c2);return;}
  var a=e.target.closest("[data-buy]");
  if(a){e.preventDefault();var c3=getCart();c3[sel]=(c3[sel]||0)+1;setCart(c3);open("cart");
    toast(a.getAttribute("data-buy")==="upi"?"Demo: on the live store this opens Breeze checkout with the ₹100 online saving.":"Demo: on the live store this opens Breeze checkout (Cash on Delivery).");return;}
  var o=e.target.closest("[data-open]"); if(o){e.preventDefault();open(o.getAttribute("data-open"));return;}
  if(e.target.closest("[data-close]")||e.target.classList.contains("scrim")){closeAll();return;}
  var ck=e.target.closest("[data-checkout]"); if(ck){toast("Demo: this button opens Breeze checkout (mobile OTP) on the live store.");return;}
  var ph=e.target.closest("[data-toggle-ph]"); if(ph){var on=document.body.classList.toggle("show-ph");ph.textContent=on?"Hide marks":"Show marks";ph.setAttribute("aria-pressed",on?"true":"false");return;}
});
var last=null;
function open(id){var d=$("#"+id);if(!d)return;last=document.activeElement;d.classList.add("on");d.setAttribute("aria-hidden","false");$(".scrim").classList.add("on");var f=$("button,a",d);if(f)f.focus();}
function closeAll(){$$(".drawer.on").forEach(function(d){d.classList.remove("on");d.setAttribute("aria-hidden","true");});$(".scrim").classList.remove("on");if(last)last.focus();}
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeAll();});
var tt;function toast(m){var t=$(".toast");if(!t)return;t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("on");},3600);}


document.addEventListener("submit",function(e){
  var f=e.target; if(!f.matches("[data-pin]"))return; e.preventDefault();
  var v=(f.querySelector("input").value||"").trim(), r=f.parentNode.querySelector(".res");
  r.className="res";
  if(!/^[1-9]\d{5}$/.test(v)){r.classList.add("err");r.textContent="Please enter a 6-digit pincode.";return;}
  if(v.slice(0,2)==="79"){r.classList.add("err");r.textContent="Sorry, we can't deliver to "+v+" yet. WhatsApp us and we'll check.";return;}
  if(v.charAt(0)==="9"){r.classList.add("warn");r.textContent="We deliver to "+v+", but Cash on Delivery isn't available here, so please pay by UPI or card.";return;}
  r.classList.add("ok");r.textContent="✓ We deliver to "+v+" · About 2 days on average · Cash on Delivery available";
});


function sticky(){
  var bar=$(".sticky"); if(!bar||!("IntersectionObserver" in window))return;
  var watch=$$("[data-watch]"), vis=new Set(), passed=false;
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)vis.add(en.target);else vis.delete(en.target);
      if(!en.isIntersecting&&en.boundingClientRect.top<0)passed=true;});
    var show=passed&&vis.size===0&&window.scrollY>200; bar.classList.toggle("on",show); document.body.classList.toggle("sticky-on",show); bar.setAttribute("aria-hidden",show?"false":"true");},{threshold:0});
  watch.forEach(function(w){io.observe(w);});
}


function gallery(){
  $$(".gallery").forEach(function(g){
    var tr=$(".track",g),figs=$$("figure",tr),dots=$(".dots",g);
    if(dots){figs.forEach(function(f,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show image "+(i+1)+" of "+figs.length);b.addEventListener("click",function(){go(i);});dots.appendChild(b);});}
    $$(".thumbs button",g).forEach(function(b,i){b.addEventListener("click",function(){go(i);});});
    function go(i){tr.scrollTo({left:figs[i].offsetLeft-tr.offsetLeft,behavior:"smooth"});}
    function upd(){var i=Math.round(tr.scrollLeft/tr.clientWidth);$$("button",dots).forEach(function(b,j){b.setAttribute("aria-current",j===i?"true":"false");});}
    tr.addEventListener("scroll",function(){window.requestAnimationFrame(upd);},{passive:true}); upd();
  });
}
function rating(){if(!(REVIEWS.count>REVIEWS.showAbove&&REVIEWS.avg))return;$$("[data-rating]").forEach(function(r){r.hidden=false;$("[data-r=avg]",r).textContent=REVIEWS.avg.toFixed(1);$("[data-r=count]",r).textContent=REVIEWS.count;$(".stars",r).style.setProperty("--p",(REVIEWS.avg/5*100)+"%");});}

function deliv(){var d=new Date();d.setDate(d.getDate()+2);if(d.getDay()===0)d.setDate(d.getDate()+1);
  var s=d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});$$("[data-deliv]").forEach(function(e){e.textContent=s;});}
fillTiers(); render(); deliv(); rating(); drawCart(); sticky(); gallery();
})();
