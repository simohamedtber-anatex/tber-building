(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt=function(n){return n.toLocaleString('fr-FR').replace(/\s/g,'\u00a0')};

  // Menu mobile
  var nav=$('#nav'), mb=$('#menuBtn');
  mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)})});

  var yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();
  if(!$('#lvlCard')) return; // pages secondaires : menu uniquement

  // Coupe : niveaux
  var LV={
    r3:{t:'3ᵉ étage',h:'3,60 m',c:'750 kg/m²',s:'633 – 881 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t et l\'escalier de secours. Terrasses sur les lots 21 et 22.'},
    r2:{t:'2ᵉ étage',h:'3,60 m',c:'750 kg/m²',s:'711 – 778 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires, douches et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t, l\'escalier et l\'escalier de secours.'},
    r1:{t:'1ᵉʳ étage',h:'3,60 m',c:'750 kg/m²',s:'711 – 778 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires, douches et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t, l\'escalier et l\'escalier de secours.'},
    mez:{t:'Mezzanine',h:'dans le volume du RDC',c:'',s:'115 – 293 m²',u:'Surface complémentaire',p:'Une surface en plus, accessible par escalier depuis le rez-de-chaussée, sans empiéter sur la hauteur des quais.'},
    rdc:{t:'Rez-de-chaussée',h:'7,00 m',c:'3,5 t/m²',s:'524 – 578 m²',u:'Showroom, production, logistique',p:'Un quai de déchargement avec élévateur par lot, à +1,20 m, accès poids lourds et dalle renforcée pour les engins de manutention.'},
    ss:{t:'Sous-sol',h:'2,50 m',c:'',s:'',u:'',p:'Accès facile depuis la voie, desservi par l\'ascenseur, le monte-charge et l\'escalier.'}
  };
  function setLevel(k){
    var d=LV[k]; if(!d) return;
    $$('.lvl-btn').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===k)});
    $$('.hit').forEach(function(h){h.classList.toggle('on',h.dataset.l===k)});
    var rows='<dt>Hauteur libre</dt><dd>'+d.h+'</dd>';
    if(d.c) rows+='<dt>Charge de dalle</dt><dd>'+d.c+'</dd>';
    if(d.s) rows+='<dt>Surface par lot</dt><dd>'+d.s+'</dd>';
    rows+='<dt>Ascenseur</dt><dd>400 kg · 1 à 3 pers.</dd><dt>Monte-charge</dt><dd>2,5 t</dd>';
    if(d.u) rows+='<dt>Usage</dt><dd style="font-family:var(--f-body)">'+d.u+'</dd>';
    $('#lvlCard').innerHTML='<span class="eyebrow">Niveau sélectionné</span><h3>'+d.t+'</h3><dl class="kv">'+rows+'</dl><p>'+d.p+'</p>';
  }
  $$('.lvl-btn,.hit').forEach(function(el){el.addEventListener('click',function(){setLevel(el.dataset.l)})});
  $$('.hit').forEach(function(el){el.addEventListener('mouseenter',function(){setLevel(el.dataset.l)})});
  setLevel('rdc');

  // Lots
  var LOTS={
    19:{rdc:578,mez:289,e1:739,e2:739,e3:739},
    20:{rdc:564,mez:293,e1:778,e2:778,e3:764},
    21:{rdc:524,mez:115,e1:711,e2:711,e3:633},
    22:{rdc:572,mez:118,e1:760,e2:760,e3:881}
  };
  var ROWS=[['rdc','RDC'],['mez','Mezzanine'],['e1','1ᵉʳ étage'],['e2','2ᵉ étage'],['e3','3ᵉ étage']];
  var sel={19:true,20:true,21:true,22:true};
  function sum(id){var l=LOTS[id];return l.rdc+l.mez+l.e1+l.e2+l.e3}
  function renderLots(){
    var ids=Object.keys(sel).filter(function(k){return sel[k]});
    $$('.lot').forEach(function(g){g.classList.toggle('sel',!!sel[g.dataset.lot]);g.setAttribute('aria-pressed',!!sel[g.dataset.lot])});
    $$('.lots-side .chip').forEach(function(c){c.setAttribute('aria-pressed',!!sel[c.dataset.lot])});
    if(!ids.length){
      $('#totV').textContent='—';$('#totK').textContent='Sélectionnez au moins un lot';
      $('#tHead').innerHTML='';$('#tBody').innerHTML='';$('#tFoot').innerHTML='';return;
    }
    var tot=ids.reduce(function(a,id){return a+sum(id)},0);
    tweenTotal(tot);
    $('#totK').textContent=ids.length===4?'surface utile des 4 lots':ids.length===1?'surface utile du lot '+ids[0]:'surface utile des lots '+ids.join(' + ');
    $('#tHead').innerHTML='<tr><th>Niveau</th>'+ids.map(function(i){return '<th>Lot '+i+'</th>'}).join('')+(ids.length>1?'<th>Total</th>':'')+'</tr>';
    $('#tBody').innerHTML=ROWS.map(function(r){
      var t=0;var cells=ids.map(function(i){t+=LOTS[i][r[0]];return '<td>'+fmt(LOTS[i][r[0]])+'</td>'}).join('');
      return '<tr><td>'+r[1]+'</td>'+cells+(ids.length>1?'<td>'+fmt(t)+'</td>':'')+'</tr>';
    }).join('');
    $('#tFoot').innerHTML='<tr><td>Total m²</td>'+ids.map(function(i){return '<td>'+fmt(sum(i))+'</td>'}).join('')+(ids.length>1?'<td>'+fmt(tot)+'</td>':'')+'</tr>';
  }
  var shownTot=12046;
  function tweenTotal(to){
    var el=$('#totV'),from=shownTot,t0=null;shownTot=to;
    el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
    if(reduce){el.textContent=fmt(to)+' m²';return}
    (function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/600),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(from+(to-from)*e))+' m²';if(k<1)requestAnimationFrame(step)})(performance.now());
  }
  function toggleLot(id){sel[id]=!sel[id];renderLots()}
  $$('.lot').forEach(function(g){
    g.addEventListener('click',function(){toggleLot(g.dataset.lot)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleLot(g.dataset.lot)}});
  });
  $$('.lots-side .chip').forEach(function(c){c.addEventListener('click',function(){toggleLot(c.dataset.lot)})});
  renderLots();

  // Galerie
  var lb=$('#lb'),gal=$$('#gal button'),gi=0;
  function show(i){
    gi=(i+gal.length)%gal.length;var b=gal[gi],im=$('#lbImg');
    im.style.opacity=0;
    setTimeout(function(){im.src=b.dataset.src;im.alt=b.dataset.cap;$('#lbCap').textContent=b.dataset.cap+'  ·  '+(gi+1)+' / '+gal.length;im.style.opacity=1},reduce?0:150);
  }
  gal.forEach(function(b,i){b.addEventListener('click',function(){
    show(i);if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
  })});
  $('#lbPrev').addEventListener('click',function(){show(gi-1)});
  $('#lbNext').addEventListener('click',function(){show(gi+1)});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(gi-1);if(e.key==='ArrowRight')show(gi+1)});
  var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(gi+(dx<0?1:-1));sx=null});
  $('#lbClose').addEventListener('click',function(){lb.close()});
  lb.addEventListener('click',function(e){if(e.target===lb) lb.close()});

  // Copier
  function copy(text,btn){
    var done=function(){var o=btn.textContent;btn.textContent='Copié';setTimeout(function(){btn.textContent=o},1600)};
    try{navigator.clipboard.writeText(text).then(done,function(){fallback(text);done()})}catch(e){fallback(text);done()}
  }
  function fallback(text){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}
  $$('.copy').forEach(function(b){b.addEventListener('click',function(){copy(b.dataset.copy,b)})});

  // Formulaire -> message WhatsApp
  var picks={'?':true};
  $$('[data-pick]').forEach(function(c){c.addEventListener('click',function(){
    var k=c.dataset.pick;
    if(k==='?'){picks={'?':true}}else{delete picks['?'];picks[k]=!picks[k];if(!Object.keys(picks).some(function(x){return picks[x]}))picks={'?':true}}
    $$('[data-pick]').forEach(function(x){x.setAttribute('aria-pressed',!!picks[x.dataset.pick])});
    build();
  })});
  function message(){
    var v=function(id){return ($(id).value||'').trim()};
    var lots=Object.keys(picks).filter(function(k){return picks[k]&&k!=='?'});
    var m='Bonjour TBER BUILDING,\n\n';
    m+='Je souhaite des informations sur la location d\'un lot.\n';
    if(v('#f-nom')) m+='Nom : '+v('#f-nom')+'\n';
    if(v('#f-soc')) m+='Société : '+v('#f-soc')+'\n';
    if(v('#f-tel')) m+='Téléphone : '+v('#f-tel')+'\n';
    m+='Activité : '+v('#f-act')+'\n';
    m+='Lots : '+(lots.length?lots.map(function(l){return 'Lot '+l}).join(', '):'à conseiller')+'\n';
    if(v('#f-msg')) m+='\nBesoin : '+v('#f-msg')+'\n';
    return m;
  }
  function build(){
    $('#waSend').href='https://wa.me/212665754925?text='+encodeURIComponent(message());
    $('#mailSend').href='mailto:tberbuildings@gmail.com?subject='+encodeURIComponent('Demande de location – TBER BUILDING')+'&body='+encodeURIComponent(message());
  }
  $$('#form input,#form select,#form textarea').forEach(function(el){el.addEventListener('input',build)});
  build();
  $('#form').addEventListener('submit',function(e){
    e.preventDefault();
    window.open($('#waSend').href,'_blank','noopener');
  });


  // Mesure d'audience : clics de contact (Google Analytics)
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a'); if(!a||typeof window.gtag!=='function') return;
    var href=a.getAttribute('href')||'', ev=null, label=null;
    if(href.indexOf('wa.me/')>-1){ev='contact_whatsapp';label=a.id==='waSend'?'formulaire':a.classList.contains('wa')?'bouton_flottant':'lien'}
    else if(href.indexOf('mailto:')===0){ev='contact_email';label=a.id==='mailSend'?'formulaire':'lien'}
    else if(href.indexOf('instagram.com')>-1){ev='reseau_social';label='instagram'}
    else if(href.indexOf('facebook.com')>-1){ev='reseau_social';label='facebook'}
    else if(href.indexOf('google.com/maps')>-1){ev='itineraire';label='google_maps'}
    else if(a.closest('.lang')){ev='changement_langue';label=a.getAttribute('hreflang')}
    if(ev) gtag('event',ev,{type:label,langue:document.documentElement.lang});
  });

  // ===== Animations =====
  (function(){
    var root=document.documentElement, hdr=$('.hdr'), bar=$('#progress');
    function onScroll(){
      var y=window.scrollY||0, h=document.documentElement.scrollHeight-window.innerHeight;
      bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
      hdr.classList.toggle('scrolled',y>10);
      if(h-y<80) $$('.rv:not(.in)').forEach(function(el){el.classList.add('in')}); // bas de page : tout afficher
    }
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();

    // lien actif dans le menu
    var links={};$$('#nav a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
    if('IntersectionObserver' in window){
      var spy=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting&&links[e.target.id]){$$('#nav a').forEach(function(a){a.classList.remove('active')});links[e.target.id].classList.add('active')}
      })},{rootMargin:'-45% 0px -50% 0px'});
      Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)spy.observe(s)});
    }

    if(reduce||!('IntersectionObserver' in window)) return;
    root.classList.add('anim');

    // éléments révélés au défilement
    var groups=[['.sec-head',0],['.figures .fig',.08],['.sheet',0],['.plate',.15],['.use',.08],['.gal button',.07],['.about > *',.12],['.pillars div',.1]];
    groups.forEach(function(g){$$(g[0]).forEach(function(el,i){el.classList.add('rv');el.style.setProperty('--d',(i*g[1]).toFixed(2)+'s')})});
    // tracés SVG : longueur normalisée
    $$('#hauteurs .d-redl path, .use svg path, .use svg circle').forEach(function(p){p.setAttribute('pathLength','1')});

    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      if(e.target.classList.contains('figures')) countUp();
      io.unobserve(e.target);
    })},{threshold:.15,rootMargin:'0px 0px -8% 0px'});
    $$('.rv, #hauteurs, #lots, .loc, .figures').forEach(function(el){io.observe(el)});

    // chiffres clés qui défilent
    function countUp(){
      $$('.fig .v').forEach(function(v,i){
        var node=v.firstChild; if(!node||node.nodeType!==3) return;
        var txt=node.nodeValue.trim(), mm=txt.match(/[.,](\d+)$/), dec=mm?mm[1].length:0, sep=mm?txt.charAt(txt.length-dec-1):',', to=parseFloat(txt.replace(/\s/g,'').replace(',','.'));
        if(isNaN(to)) return;
        var t0=null, dur=1400+i*120;
        (function step(t){
          if(!t0)t0=t; var k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,4), n=to*e;
          node.nodeValue=dec?n.toFixed(dec).replace('.',sep):fmt(Math.round(n));
          if(k<1) requestAnimationFrame(step); else node.nodeValue=txt;
        })(performance.now());
      });
    }

    // bulle WhatsApp affichée quelques secondes
    var wa=$('.wa'); if(wa){setTimeout(function(){wa.classList.add('tip');setTimeout(function(){wa.classList.remove('tip')},4500)},5000)}
  })();
})();
