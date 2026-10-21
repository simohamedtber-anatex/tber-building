(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var fmt=function(n){return n.toLocaleString('fr-FR').replace(/ | /g,' ')};

  // Menu mobile
  var nav=$('#nav'), mb=$('#menuBtn');
  mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)})});

  var yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();
  if(!$('#lvlCard')) return; // pages secondaires : menu uniquement

  // Coupe : niveaux
  var LV={
    r3:{t:'3ᵉ étage',h:'4,00 m',c:'750 kg/m²',s:'633 – 881 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t et l\'escalier de secours. Terrasses sur les lots 21 et 22.'},
    r2:{t:'2ᵉ étage',h:'4,00 m',c:'750 kg/m²',s:'711 – 778 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires, douches et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t, l\'escalier et l\'escalier de secours.'},
    r1:{t:'1ᵉʳ étage',h:'4,00 m',c:'750 kg/m²',s:'711 – 778 m²',u:'Atelier, stockage palettier, showroom',p:'Plateau libre avec vestiaires, douches et sanitaires, desservi par l\'ascenseur, le monte-charge 2,5 t, l\'escalier et l\'escalier de secours.'},
    mez:{t:'Mezzanine',h:'dans le volume du RDC',c:'',s:'115 – 293 m²',u:'Surface complémentaire',p:'Une surface en plus, accessible par escalier depuis le rez-de-chaussée, sans empiéter sur la hauteur des quais.'},
    rdc:{t:'Rez-de-chaussée',h:'7,00 m',c:'3 t/m²',s:'524 – 578 m²',u:'Showroom, production, logistique',p:'Deux quais de déchargement avec élévateur par lot, quai à +1,20 m, accès poids lourds et dalle renforcée pour les engins de manutention.'},
    ss:{t:'Sous-sol',h:'3,60 m',c:'',s:'',u:'',p:'Accès facile depuis la voie, desservi par l\'ascenseur, le monte-charge et l\'escalier.'}
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
    $('#totV').textContent=fmt(tot)+' m²';
    $('#totK').textContent=ids.length===4?'surface utile des 4 lots':ids.length===1?'surface utile du lot '+ids[0]:'surface utile des lots '+ids.join(' + ');
    $('#tHead').innerHTML='<tr><th>Niveau</th>'+ids.map(function(i){return '<th>Lot '+i+'</th>'}).join('')+(ids.length>1?'<th>Total</th>':'')+'</tr>';
    $('#tBody').innerHTML=ROWS.map(function(r){
      var t=0;var cells=ids.map(function(i){t+=LOTS[i][r[0]];return '<td>'+fmt(LOTS[i][r[0]])+'</td>'}).join('');
      return '<tr><td>'+r[1]+'</td>'+cells+(ids.length>1?'<td>'+fmt(t)+'</td>':'')+'</tr>';
    }).join('');
    $('#tFoot').innerHTML='<tr><td>Total m²</td>'+ids.map(function(i){return '<td>'+fmt(sum(i))+'</td>'}).join('')+(ids.length>1?'<td>'+fmt(tot)+'</td>':'')+'</tr>';
  }
  function toggleLot(id){sel[id]=!sel[id];renderLots()}
  $$('.lot').forEach(function(g){
    g.addEventListener('click',function(){toggleLot(g.dataset.lot)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleLot(g.dataset.lot)}});
  });
  $$('.lots-side .chip').forEach(function(c){c.addEventListener('click',function(){toggleLot(c.dataset.lot)})});
  renderLots();

  // Galerie
  var lb=$('#lb');
  $$('#gal button').forEach(function(b){b.addEventListener('click',function(){
    $('#lbImg').src=b.dataset.src;$('#lbImg').alt=b.dataset.cap;$('#lbCap').textContent=b.dataset.cap;
    if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
  })});
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
    $('#waSend').href='https://wa.me/212665754926?text='+encodeURIComponent(message());
    $('#mailSend').href='mailto:tberbuildings@gmail.com?subject='+encodeURIComponent('Demande de location – TBER BUILDING')+'&body='+encodeURIComponent(message());
  }
  $$('#form input,#form select,#form textarea').forEach(function(el){el.addEventListener('input',build)});
  build();
  $('#form').addEventListener('submit',function(e){
    e.preventDefault();
    window.open($('#waSend').href,'_blank','noopener');
  });

})();
