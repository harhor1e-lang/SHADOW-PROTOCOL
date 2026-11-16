import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const $=s=>document.querySelector(s), app=$('#app'), canvas=$('#world-canvas');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bb6b0);scene.fog=new THREE.FogExp2(0x9bb6b0,.009);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,650);camera.position.set(24,19,28);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
scene.add(new THREE.HemisphereLight(0xdce9e7,0x394633,1.8));
const sun=new THREE.DirectionalLight(0xffdfad,2.6);sun.position.set(-45,65,28);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);
const mat=(c,r=.9,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const terrainMat=mat(0x65784b),groundGeo=new THREE.PlaneGeometry(240,240,110,110);groundGeo.rotateX(-Math.PI/2);const p=groundGeo.attributes.position;
function height(x,z){return Math.sin(x*.045)*2.2+Math.cos(z*.052)*1.8+Math.sin((x+z)*.026)*2.4+Math.cos((x-z)*.018)*1.2}
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,height(x,z))}groundGeo.computeVertexNormals();const ground=new THREE.Mesh(groundGeo,terrainMat);ground.receiveShadow=true;scene.add(ground);
const riverMat=new THREE.MeshStandardMaterial({color:0x367b88,roughness:.16,metalness:.18,transparent:true,opacity:.91});
const river=new THREE.Mesh(new THREE.PlaneGeometry(12,250,1,80),riverMat);river.rotation.x=-Math.PI/2;river.position.set(-17,2.1,0);scene.add(river);
function addTree(x,z,s=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.28,2.4,7),mat(0x59402b));trunk.position.y=1.2;trunk.castShadow=true;g.add(trunk);for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(1.25-j*.16,3.2,7),mat(j===0?0x294b34:0x355d3c));crown.position.y=2.6+j*.65;crown.castShadow=true;g.add(crown)}g.position.set(x,height(x,z),z);g.scale.setScalar(s);scene.add(g)}
function house(x,z,s=1){const g=new THREE.Group(),wall=new THREE.Mesh(new THREE.BoxGeometry(5,3.1,4.3),mat(0xb69a6d)),roof=new THREE.Mesh(new THREE.ConeGeometry(3.9,2.5,4),mat(0x49382b));wall.position.y=1.55;roof.position.y=4;roof.rotation.y=Math.PI/4;roof.scale.z=.82;[wall,roof].forEach(o=>{o.castShadow=true;o.receiveShadow=true;g.add(o)});const door=new THREE.Mesh(new THREE.BoxGeometry(.9,1.8,.12),mat(0x3d2a20));door.position.set(0,.9,2.2);g.add(door);g.position.set(x,height(x,z),z);g.scale.setScalar(s);scene.add(g);return g}
function rock(x,z,s){const o=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),mat(0x77786b));o.position.set(x,height(x,z)+s*.4,z);o.scale.set(s*1.2,s*.7,s);o.rotation.set(Math.random(),Math.random(),Math.random());o.castShadow=true;scene.add(o)}
// distant mountain wall
for(let i=0;i<34;i++){const a=i/34*Math.PI*2,r=94+Math.random()*16,x=Math.cos(a)*r,z=Math.sin(a)*r;const m=new THREE.Mesh(new THREE.ConeGeometry(9+Math.random()*10,18+Math.random()*24,5),mat(0x53645a));m.position.set(x,8+height(x,z),z);m.rotation.y=Math.random()*6;m.castShadow=true;scene.add(m)}
for(let i=0;i<210;i++){const a=Math.random()*Math.PI*2,r=23+Math.random()*83,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x+17)<9)continue;addTree(x,z,.55+Math.random()*.8)}
for(let i=0;i<42;i++){const x=(Math.random()-.5)*150,z=(Math.random()-.5)*150;if(Math.abs(x+17)>10)rock(x,z,.4+Math.random()*1.5)}
house(5,2,1);house(14,-7,.78);house(2,-11,.72);house(21,4,.62);
const path=new THREE.Mesh(new THREE.PlaneGeometry(5,52),mat(0x988363));path.rotation.x=-Math.PI/2;path.position.set(10,2.25,-15);scene.add(path);
// watchfire, wood stack and lantern
const fire=new THREE.Group();fire.position.set(1,height(1,16)+.2,16);scene.add(fire);
const stones=new THREE.Mesh(new THREE.TorusGeometry(1.05,.22,7,12),mat(0x77766a));stones.rotation.x=Math.PI/2;fire.add(stones);
const flameMat=new THREE.MeshBasicMaterial({color:0xff8b35});const flame=new THREE.Mesh(new THREE.ConeGeometry(.48,1.7,7),flameMat);flame.position.y=.85;fire.add(flame);
const glow=new THREE.PointLight(0xff8b43,2.5,18);glow.position.y=2;fire.add(glow);
const player=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.9,4,8),mat(0x625442));body.position.y=1.1;body.castShadow=true;player.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),mat(0xc49b72));head.position.y=1.9;player.add(head);const hood=new THREE.Mesh(new THREE.SphereGeometry(.34,12,8,0,Math.PI*2,0,Math.PI*.55),mat(0x292e28));hood.position.y=2.02;player.add(hood);player.position.set(7,height(7,8),8);scene.add(player);
let yaw=.65,pitch=.35,distance=24,drag=false,last={x:0,y:0},entered=false,day=0,clockMinutes=480,elapsed=0;
const target=new THREE.Vector3(7,0,8),keys=new Set(),move=new Set();
const resourceNodes=[];
function resourceNode(x,z,type,label,color,amount=1){const g=new THREE.Group();const mesh=new THREE.Mesh(type==='wood'?new THREE.CylinderGeometry(.18,.25,1.8,7):type==='stone'?new THREE.DodecahedronGeometry(.7,1):new THREE.SphereGeometry(.48,8,7),mat(color));mesh.castShadow=true;mesh.position.y=type==='wood'?.9:.45;g.add(mesh);g.position.set(x,height(x,z),z);scene.add(g);resourceNodes.push({mesh:g,type,label,amount,used:false})}
for(let i=0;i<24;i++){const a=Math.random()*Math.PI*2,r=9+Math.random()*36,x=target.x+Math.cos(a)*r,z=target.z+Math.sin(a)*r;resourceNode(x,z,i%3===0?'stone':i%3===1?'wood':'herbs',i%3===0?'حجر':i%3===1?'خشب':'أعشاب',i%3===0?0x85877d:i%3===1?0x76502f:0x7d9b55,i%3===1?1:1)}
const villagers=[];
function villager(x,z,name,job){const g=new THREE.Group(),torso=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.72,3,7),mat(0x6c5943)),head=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),mat(0xb98d6d));torso.position.y=.9;head.position.y=1.65;g.add(torso,head);g.position.set(x,height(x,z),z);scene.add(g);villagers.push({mesh:g,name,job,homeX:x,homeZ:z,phase:Math.random()*6});}
villager(10,5,'سالم','مزارع');villager(17,-3,'مريم','معالجة الأعشاب');villager(-1,-9,'حازم','نجار');villager(23,8,'نورس','حارس');
let survivalTick=0,weatherTick=0;
function updateSurvival(dt,hour){
if(!entered)return;survivalTick+=dt;weatherTick+=dt;
if(survivalTick>18){survivalTick=0;game.hunger=Math.max(0,game.hunger-.8);game.thirst=Math.max(0,game.thirst-1.2);game.stamina=Math.min(100,game.stamina+2);if(game.hunger===0||game.thirst===0)game.health=Math.max(1,game.health-2);$('#health-bar').style.width=game.health+'%';$('#stamina-bar').style.width=game.stamina+'%';$('#hunger-bar').style.width=game.hunger+'%';saveGame()}
if(weatherTick>85){weatherTick=0;const weathers=['صحو','ضباب','مطر خفيف','عاصفة'];const w=weathers[Math.floor(Math.random()*weathers.length)];$('#weather-label').textContent=w;toast('تغير الطقس: '+w)}
for(const v of villagers){v.mesh.position.x=v.homeX+Math.sin(elapsed*.22+v.phase)*1.3;v.mesh.position.z=v.homeZ+Math.cos(elapsed*.18+v.phase)*1.3;v.mesh.position.y=height(v.mesh.position.x,v.mesh.position.z)}
}

addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='f')interact()});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
canvas.addEventListener('pointerdown',e=>{drag=true;last={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-last.x)*.0045;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-last.y)*.003,-.15,1.12);last={x:e.clientX,y:e.clientY}});
canvas.addEventListener('wheel',e=>distance=THREE.MathUtils.clamp(distance+e.deltaY*.025,8,65),{passive:true});
document.querySelectorAll('[data-move]').forEach(b=>{const k=b.dataset.move;b.addEventListener('pointerdown',e=>{e.preventDefault();move.add(k);b.setPointerCapture(e.pointerId)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>move.delete(k)))});
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2600)}
const game={health:100,stamina:100,hunger:100,thirst:100,wood:0,stone:0,herbs:3,food:2,coins:12,level:1,xp:0,discovered:0,quest:0};
try{Object.assign(game,JSON.parse(localStorage.getItem('shadowProtocolSave')||'{}'))}catch{}
function saveGame(){try{localStorage.setItem('shadowProtocolSave',JSON.stringify(game))}catch{}}
function panelButton(label,action){return '<button class="game-action" data-action="'+action+'">'+label+'</button>'}
function openPanel(which){
let title='',kicker='سجل العالم',body='';
if(which==='inventory'){kicker='المقتنيات';title='حقيبة المسافر';body='<div class="stat-grid"><div>خشب <b>'+game.wood+'</b></div><div>حجر <b>'+game.stone+'</b></div><div>أعشاب <b>'+game.herbs+'</b></div><div>طعام <b>'+game.food+'</b></div><div>عملات <b>'+game.coins+'</b></div><div>ماء <b>'+Math.round(game.thirst)+'%</b></div></div>'}
if(which==='map'){kicker='الأراضي المكتشفة';title='خريطة وادي السنديان';body='<p>أنت في الوادي الأول. النهر غرب المستوطنة، وموقد الحراسة جنوب الغابة.</p><p>المناطق المكتشفة: '+game.discovered+' · المناطق المجهولة: كثيرة.</p><p>الإحداثيات التقريبية: '+Math.round(target.x)+' / '+Math.round(target.z)+'</p>'}
if(which==='journal'){kicker='ملاحظات ميدانية';title='سجل الرحلة';body='<p>الوادي هادئ، لكنه ليس خالياً. آثار غريبة تظهر قرب الأشجار بعد الغروب.</p><p><b>المهمة الحالية:</b> '+(game.quest===0?'اكتشف موقد الحراسة':game.quest===1?'اجمع ٣ قطع خشب وحجراً واحداً':'عد إلى المستوطنة وابدأ بناء مأوى')+'</p><p>المستوى '+game.level+' · الخبرة '+game.xp+'</p>'}
if(which==='craft'){kicker='ورشة الصانع';title='الصناعة البدائية';body='<p>حوّل الموارد إلى أدوات تساعدك على البقاء.</p>'+panelButton('صناعة فأس بدائي · ٣ خشب + ٢ حجر','axe')+panelButton('صناعة ضماد · عشب واحد','bandage')+panelButton('تحضير وجبة · طعامان','meal')+panelButton('صناعة رمح خشبي · ٢ خشب','spear')}
if(which==='market'){kicker='سوق المستوطنة';title='تجارة الوادي';body='<p>تاجر المستوطنة يشتري الموارد ويبيع المؤن.</p>'+panelButton('شراء طعام · ٣ عملات','buyfood')+panelButton('شراء ماء · ٢ عملة','buywater')+panelButton('بيع ٢ خشب · ٤ عملات','sellwood')+panelButton('بيع الأعشاب · ٣ عملات','sellherbs')}
if(which==='build'){kicker='ورشة البناء';title='ابنِ مأواك الأول';body='<p>ابدأ بتأسيس مكان آمن قبل حلول الظلام.</p>'+panelButton('بناء كوخ خشبي · ٦ خشب + ٣ حجر','hut')+panelButton('إشعال موقد نار · ٢ خشب + حجر','camp')+panelButton('ترقية المأوى · ٤ خشب','upgrade')}
$('#panel-kicker').textContent=kicker;$('#panel-title').textContent=title;$('#panel-content').innerHTML=body;$('#side-panel').classList.add('open')}
function gameAction(action){
const fail=m=>toast('لا تملك الموارد الكافية: '+m);
if(action==='axe'){if(game.wood<3||game.stone<2)return fail('خشب ٣ وحجر ٢');game.wood-=3;game.stone-=2;game.xp+=15;toast('صنعت فأساً بدائياً.')}
if(action==='bandage'){if(game.herbs<1)return fail('عشب واحد');game.herbs--;game.health=Math.min(100,game.health+25);toast('استخدمت ضماداً واستعدت الصحة.')}
if(action==='meal'){if(game.food<2)return fail('طعامان');game.food-=2;game.hunger=Math.min(100,game.hunger+35);toast('أعددت وجبة دافئة.')}
if(action==='spear'){if(game.wood<2)return fail('خشبان');game.wood-=2;game.xp+=10;toast('صنعت رمحاً خشبياً للدفاع.')}
if(action==='buyfood'){if(game.coins<3)return fail('٣ عملات');game.coins-=3;game.food++;toast('اشتريت مؤونة من السوق.')}
if(action==='buywater'){if(game.coins<2)return fail('عملتان');game.coins-=2;game.thirst=Math.min(100,game.thirst+35);toast('ملأت قربة الماء.')}
if(action==='sellwood'){if(game.wood<2)return fail('قطعتا خشب');game.wood-=2;game.coins+=4;toast('بعت الخشب بأربع عملات.')}
if(action==='sellherbs'){if(game.herbs<1)return fail('عشب واحد');game.herbs--;game.coins+=3;toast('بعت الأعشاب بثلاث عملات.')}
if(action==='hut'){if(game.wood<6||game.stone<3)return fail('٦ خشب و٣ حجر');game.wood-=6;game.stone-=3;const h=house(target.x+4,target.z+5,.75);game.xp+=40;toast('اكتمل كوخك الأول!');}
if(action==='camp'){if(game.wood<2||game.stone<1)return fail('خشبان وحجر');game.wood-=2;game.stone--;game.health=Math.min(100,game.health+5);toast('أنشأت موقداً آمناً.');}
if(action==='upgrade'){if(game.wood<4)return fail('٤ خشب');game.wood-=4;game.level++;game.xp+=30;toast('طورت مأواك وارتفع مستواك.')}
saveGame();const open=$('#side-panel').classList.contains('open');if(open){const panel=whichPanel();openPanel(panel||'inventory')}
}
function whichPanel(){const t=$('#panel-title').textContent;if(t==='حقيبة المسافر')return'inventory';if(t==='الصناعة البدائية')return'craft';if(t==='تجارة الوادي')return'market';if(t==='ابنِ مأواك الأول')return'build';return'journal'}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)gameAction(b.dataset.action)});
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));$('#panel-close').onclick=()=>$('#side-panel').classList.remove('open');$('#menu-toggle').onclick=()=>openPanel('journal');
$('#interact-prompt').addEventListener('click',interact);
function interact(){
let nearest=null,dist=8;
for(const n of resourceNodes){const d=target.distanceTo(n.mesh.position);if(d<dist){nearest=n;dist=d}}
if(nearest){game[nearest.type]+=nearest.amount;nearest.mesh.visible=false;nearest.used=true;game.xp+=5;saveGame();toast('جمعت '+nearest.label+' · '+nearest.amount);if(game.quest===1&&game.wood>=3&&game.stone>=1){game.quest=2;$('#quest-title').textContent='عد إلى المستوطنة وابنِ مأوى';$('#quest-desc').textContent='أصبحت تملك ما يكفي للبدء.'}return}
const d=target.distanceTo(fire.position);if(d<10){game.discovered++;game.quest=Math.max(game.quest,1);saveGame();toast('اكتشاف: آثار حديثة تتجه إلى الغابة الشمالية.');$('#panel-kicker').textContent='اكتشاف جديد';$('#panel-title').textContent='نار كان يفترض أن تنطفئ';$('#panel-content').innerHTML='<p>الرماد دافئ. آثار أقدام حديثة تقود إلى أشجار الصنوبر السوداء. لست أول من وصل إلى هنا.</p><p>بدأت مهمتك التالية: اجمع الخشب والحجر لصناعة أدواتك.</p>';$('#side-panel').classList.add('open');$('#quest-title').textContent='اجمع الخشب والحجر';$('#quest-desc').textContent='اجمع ٣ قطع خشب وحجراً واحداً.';return}
toast('اقترب من مورد أو من موقد الحراسة للتفاعل.')}
$('#begin').addEventListener('click',()=>{entered=true;$('#hero').style.display='none';$('.region-card').style.display='none';$('#hud').classList.add('active');$('#mobile-controls').style.display='block';toast('أصبحت البرية ملكك. راقب حافة الغابة.');});
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-(animate.last||now))/1000,.04);animate.last=now;elapsed+=dt;clockMinutes+=dt*1.4;if(clockMinutes>=1440){clockMinutes-=1440;day++}
const hour=Math.floor(clockMinutes/60),minute=Math.floor(clockMinutes%60);$('#world-clock').textContent='اليوم '+String(day+1).padStart(2,'0')+' · '+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
updateSurvival(dt,hour);const night=hour<6||hour>19;const daylight=THREE.MathUtils.clamp((Math.sin((hour-6)/13*Math.PI)+.12),.12,1);sun.intensity=.35+daylight*2.5;scene.fog.color.set(night?0x17232a:0x9bb6b0);scene.background.copy(scene.fog.color);scene.fog.density=night?.014:.009;renderer.toneMappingExposure=night?.72:1.12;
const fwd=(keys.has('w')||keys.has('arrowup')||move.has('forward')?1:0)-(keys.has('s')||keys.has('arrowdown')||move.has('back')?1:0),side=(keys.has('d')||keys.has('arrowright')||move.has('right')?1:0)-(keys.has('a')||keys.has('arrowleft')||move.has('left')?1:0);
if(entered&&(fwd||side)){const speed=(keys.has('shift')?9:7)*dt;game.stamina=Math.max(0,game.stamina-(keys.has('shift')?dt*3:dt*.5));target.x+=(Math.sin(yaw)*fwd+Math.cos(yaw)*side)*speed;target.z+=(Math.cos(yaw)*fwd-Math.sin(yaw)*side)*speed;target.x=THREE.MathUtils.clamp(target.x,-105,105);target.z=THREE.MathUtils.clamp(target.z,-105,105);player.position.set(target.x,height(target.x,target.z),target.z);player.rotation.y=yaw+Math.atan2(side,fwd)}
const camDist=entered?distance*.72:distance;camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*camDist,target.y+Math.sin(pitch)*camDist+3,target.z+Math.cos(yaw)*Math.cos(pitch)*camDist);camera.lookAt(target.x,target.y+1,target.z);
flame.scale.setScalar(.88+Math.sin(elapsed*13)*.13);glow.intensity=2+Math.sin(elapsed*17)*.65;riverMat.opacity=.86+Math.sin(elapsed*1.4)*.05;
const near=target.distanceTo(fire.position)<10;$('#interact-prompt').style.display=entered&&near?'block':'none';if(entered&&hour>19&&hour<22)$('#weather-label').textContent='حلول الليل';renderer.render(scene,camera)}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>$('#loading').classList.add('hidden'),1100);
