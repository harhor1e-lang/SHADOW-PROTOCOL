import * as THREE from 'three';

function drawCompatibilityCity(error) {
  const host=document.querySelector('#game');
  if(!host) return;
  host.innerHTML='';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none;';
  host.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const loading=document.querySelector('#loading');
  if(loading) loading.remove();
  if(!ctx) { host.innerHTML='<div style="color:white;padding:30px">تعذّر تشغيل الرسوم على هذا المتصفح.</div>'; return; }
  const state={x:0,y:0,walk:0,steer:0};
  const keys={};
  addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
  addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
  let last=0;
  function paint(t=0){
    const W=Math.max(1,host.clientWidth),H=Math.max(1,host.clientHeight),dpr=Math.min(devicePixelRatio||1,1.5);
    if(canvas.width!==Math.floor(W*dpr)||canvas.height!==Math.floor(H*dpr)){canvas.width=Math.floor(W*dpr);canvas.height=Math.floor(H*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const dt=Math.min(.04,(t-last)/1000||.016);last=t;state.walk+=dt;
    const horizon=H*.55;
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#6fa6c2');sky.addColorStop(.58,'#d8c7a1');sky.addColorStop(1,'#7d9168');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#e6bd79';ctx.beginPath();ctx.arc(W*.78,H*.17,Math.min(W,H)*.055,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#72875e';ctx.fillRect(0,horizon,W,H-horizon);
    // Distant city skyline with warm windows
    for(let i=0;i<19;i++){const bw=W*.045+(i%3)*W*.012,bh=H*(.12+((i*31)%19)/100),x=i*W/18-bw/2,y=horizon-bh;ctx.fillStyle=['#aab5b0','#c3b49d','#84999b','#d2c6ae'][i%4];ctx.fillRect(x,y,bw,bh);ctx.fillStyle='#526d78';for(let wy=y+8;wy<horizon-5;wy+=16)for(let wx=x+5;wx<x+bw-4;wx+=12)ctx.fillRect(wx,wy,5,7);}
    // Sidewalks, shops and homes
    for(let side=0;side<2;side++)for(let i=0;i<5;i++){const scale=.55+i*.13,bw=W*(.12+i*.025),bh=H*(.14+i*.025),x=side?W*.66+i*W*.105:W*.22-i*W*.105,y=horizon+H*(.045+i*.055);ctx.fillStyle='#6e6258';ctx.fillRect(x,y-bh,bw,bh);ctx.fillStyle='#c9b28e';ctx.beginPath();ctx.moveTo(x-5,y-bh);ctx.lineTo(x+bw/2,y-bh-H*.045);ctx.lineTo(x+bw+5,y-bh);ctx.fill();ctx.fillStyle='#315362';for(let wx=x+8;wx<x+bw-8;wx+=20){ctx.fillRect(wx,y-bh+12,10,15);ctx.fillStyle='#e8c17b';ctx.fillRect(wx+3,y-bh+15,3,8);ctx.fillStyle='#315362';}ctx.fillStyle='#58483b';ctx.fillRect(x+bw*.42,y-25*scale,bw*.18,25*scale);}
    // Perspective street and sidewalks
    ctx.fillStyle='#b4a58d';ctx.beginPath();ctx.moveTo(W*.39,horizon);ctx.lineTo(W*.61,horizon);ctx.lineTo(W*1.15,H);ctx.lineTo(-W*.15,H);ctx.fill();
    ctx.fillStyle='#343c42';ctx.beginPath();ctx.moveTo(W*.44,horizon);ctx.lineTo(W*.56,horizon);ctx.lineTo(W*1.04,H);ctx.lineTo(-W*.04,H);ctx.fill();
    ctx.strokeStyle='#e7d9a8';ctx.lineWidth=3;ctx.setLineDash([18,22]);ctx.beginPath();ctx.moveTo(W*.5,horizon+4);ctx.lineTo(W*.5,H);ctx.stroke();ctx.setLineDash([]);
    // Moving cars, pedestrians and a lively neighborhood
    for(let i=0;i<4;i++){const z=((t*.000025*(i%2?1:-1)+i*.27)%1+1)%1;const y=horizon+Math.pow(z,1.6)*(H-horizon);const x=W*(.5+(i%2?-.17:.17)*z);const cw=10+z*W*.09,ch=5+z*H*.045;ctx.fillStyle=['#a83e32','#d5d0c4','#315d78','#d5a347'][i];ctx.fillRect(x-cw/2,y-ch,cw,ch);ctx.fillStyle='#9fc1ca';ctx.fillRect(x-cw*.28,y-ch*.8,cw*.56,ch*.35);ctx.fillStyle='#15191c';ctx.beginPath();ctx.arc(x-cw*.3,y,Math.max(2,z*5),0,Math.PI*2);ctx.arc(x+cw*.3,y,Math.max(2,z*5),0,Math.PI*2);ctx.fill();}
    for(let i=0;i<8;i++){const z=((i*.137+t*.000018)%1),y=horizon+Math.pow(z,1.7)*(H-horizon),x=W*(.28+(i%4)*.14)+(Math.sin(t*.001+i)*W*.006),s=.35+z*1.1;ctx.fillStyle=i%2?'#263d50':'#6b4436';ctx.fillRect(x-3*s,y-15*s,6*s,13*s);ctx.fillStyle='#b98260';ctx.beginPath();ctx.arc(x,y-18*s,4*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#263d50';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(x,y-7*s);ctx.lineTo(x-4*s,y+2*s);ctx.moveTo(x,y-7*s);ctx.lineTo(x+4*s,y+2*s);ctx.stroke();}
    // Player silhouette responds to keyboard/touch
    const px=W*.5+state.x*W*.12,py=H*.73+state.y*H*.04;
    ctx.fillStyle='#172b3a';ctx.fillRect(px-10,py-22,20,26);ctx.fillStyle='#b98260';ctx.beginPath();ctx.arc(px,py-29,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#172b3a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(px-5,py+2);ctx.lineTo(px-8+Math.sin(state.walk*8)*4,py+15);ctx.moveTo(px+5,py+2);ctx.lineTo(px+8-Math.sin(state.walk*8)*4,py+15);ctx.stroke();
    requestAnimationFrame(paint);
  }
  const area=document.querySelector('#stickArea'),stick=document.querySelector('#stick');let pointer=null;
  if(area&&stick){area.addEventListener('pointerdown',e=>{pointer=e.pointerId;area.setPointerCapture(pointer);move(e)});area.addEventListener('pointermove',e=>{if(e.pointerId===pointer)move(e)});function move(e){const r=area.getBoundingClientRect();let dx=(e.clientX-r.left-r.width/2)/r.width*2,dy=(e.clientY-r.top-r.height/2)/r.height*2;state.x=Math.max(-1,Math.min(1,dx));state.y=Math.max(-1,Math.min(1,dy));stick.style.transform='translate('+state.x*34+'px,'+state.y*34+'px)';}function reset(){pointer=null;state.x=0;state.y=0;stick.style.transform='translate(0,0)'}area.addEventListener('pointerup',reset);area.addEventListener('pointercancel',reset);}
  paint();
  const msg=document.createElement('div');msg.textContent='وضع الرسوم المتوافق يعمل — المدينة تتحرك';msg.style.cssText='position:absolute;bottom:12px;right:12px;background:#101820d9;color:#fff;padding:8px 12px;border-radius:10px;font:12px Tahoma;';host.appendChild(msg);
  console.error('Wateen City compatibility renderer:',error);
}

try {

const mount=document.querySelector('#game');
const introButton=document.querySelector('#startGameBtn');

const installButton=document.querySelector('#installAppBtn');
let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(installButton)installButton.hidden=false;});
if(installButton)installButton.addEventListener('click',async()=>{
 if(!installPrompt){document.querySelector('#hint').textContent='من قائمة المتصفح اختر: إضافة إلى الشاشة الرئيسية';return;}
 installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true;
});
if('serviceWorker' in navigator && location.protocol!=='file:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(err=>console.warn('تعذر تسجيل وضع التطبيق:',err)));
}
function updateOrientationLayout(){document.body.classList.toggle('portrait-mode',innerHeight>innerWidth);}
updateOrientationLayout();
window.addEventListener('resize',updateOrientationLayout,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(updateOrientationLayout,180),{passive:true});
if(introButton && !introButton.dataset.introBound)introButton.addEventListener('click',async()=>{
 try{if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();}catch(e){}
 try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');}catch(e){}
 document.querySelector('#introScreen')?.classList.add('closed');
 updateOrientationLayout();
});

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bc2d0);
scene.fog=new THREE.Fog(0x9bc2d0,90,420);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,900);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd8efff,0x59604b,2.1));
const sun=new THREE.DirectionalLight(0xffe0b0,3.0);sun.position.set(-90,150,80);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-100;sun.shadow.camera.right=100;sun.shadow.camera.top=100;sun.shadow.camera.bottom=-100;scene.add(sun);

const mat=(color,roughness=.86)=>new THREE.MeshStandardMaterial({color,roughness});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600),mat(0x788b69));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const roadMat=mat(0x30383d),lineMat=mat(0xd7cba7),sideMat=mat(0x9a9a88);
function road(x,z,w,d){const r=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),roadMat);r.position.set(x,.06,z);r.receiveShadow=true;scene.add(r);const horizontal=w>d;for(const side of [-1,1]){const walk=new THREE.Mesh(new THREE.BoxGeometry(horizontal?w:2.8,.16,horizontal?2.8:d),sideMat);walk.position.set(x+(horizontal?0:side*(w/2+1.4)),.02,z+(horizontal?side*(d/2+1.4):0));walk.receiveShadow=true;scene.add(walk)}for(let p=-Math.max(w,d)/2+4;p<Math.max(w,d)/2;p+=9){const l=new THREE.Mesh(new THREE.BoxGeometry(horizontal?3:.12,.025,horizontal?.13:3),lineMat);l.position.set(x+(horizontal?p:0),.13,z+(horizontal?0:p));scene.add(l)}}
for(let i=-2;i<=2;i++){road(0,i*70,600,13);road(i*70,0,13,600)}
// Marked pedestrian crossings at every major intersection.
const crosswalkMat=mat(0xe8e2d2);
for(let ix=-2;ix<=2;ix++)for(let iz=-2;iz<=2;iz++){const cx=ix*70,cz=iz*70;for(let k=-4;k<=4;k++){const a=new THREE.Mesh(new THREE.BoxGeometry(.72,.035,4.8),crosswalkMat);a.position.set(cx+k*1.05,.16,cz-8.9);scene.add(a);const b=a.clone();b.position.z=cz+8.9;scene.add(b);const d=new THREE.Mesh(new THREE.BoxGeometry(4.8,.035,.72),crosswalkMat);d.position.set(cx-8.9,.16,cz+k*1.05);scene.add(d);const e=d.clone();e.position.x=cx+8.9;scene.add(e)}}

const buildingMaterials=[0xc7b49a,0x9eaeb4,0xd4d0c4,0xb4a18e,0x87999a,0xe0c79e].map(c=>mat(c));
const windowMat=new THREE.MeshStandardMaterial({color:0x365568,metalness:.25,roughness:.28});
const city=new THREE.Group();scene.add(city);
function building(x,z,w,d,h,index){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMaterials[index%buildingMaterials.length]);body.position.y=h/2;body.castShadow=true;body.receiveShadow=true;g.add(body);const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.92,.5,d*.92),mat(0x555b5a));roof.position.y=h+.25;g.add(roof);const floors=Math.max(2,Math.floor(h/3.2));for(let f=0;f<floors;f++){for(let s=-1;s<=1;s++){const win=new THREE.Mesh(new THREE.BoxGeometry(.85,1.15,.08),windowMat);win.position.set(s*w*.27,2+f*3.1,d/2+.045);g.add(win);const win2=win.clone();win2.position.z=-d/2-.045;g.add(win2);const sideWin=new THREE.Mesh(new THREE.BoxGeometry(.08,1.05,.82),windowMat);sideWin.position.set(w/2+.045,2+f*3.1,s*d*.27);g.add(sideWin);const sideWin2=sideWin.clone();sideWin2.position.x=-w/2-.045;g.add(sideWin2)}}const door=new THREE.Mesh(new THREE.BoxGeometry(1.35,2.35,.12),mat(0x493b32));door.position.set(0,1.18,d/2+.08);g.add(door);const canopy=new THREE.Mesh(new THREE.BoxGeometry(2.4,.18,1.15),mat(0x9b6444));canopy.position.set(0,2.45,d/2+.52);g.add(canopy);g.position.set(x,0,z);city.add(g)}
let seed=7841;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let x=-3;x<=2;x++)for(let z=-3;z<=2;z++){const cx=x*70+35,cz=z*70+35;if(Math.abs(cx)<65&&Math.abs(cz)<65)continue;if(cx>72&&cx<195&&cz>-205&&cz<-68)continue;if((Math.abs(cx+105)<2||Math.abs(cx-105)<2)&&Math.abs(cz-35)<2)continue;if(cx>140&&cz>75&&cz<135)continue;if(cx>140&&cz< -140&&cz> -240)continue;if(cx>140&&cx<200&&cz>140&&cz<200)continue;if(cx< -140&&cz< -100&&cz> -240)continue;const w=19+rand()*9,d=19+rand()*9,h=12+rand()*30;building(cx,cz,w,d,h,Math.floor(rand()*buildingMaterials.length))}
function tree(x,z){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.38,3,7),mat(0x72513a));trunk.position.set(x,1.5,z);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(2.2,7,6),mat(0x426c43));crown.position.set(x,4,z);crown.castShadow=true;scene.add(crown)}
for(let i=0;i<180;i++){const x=(rand()-.5)*560,z=(rand()-.5)*560;if(Math.abs(x%70)<11||Math.abs(z%70)<11)continue;tree(x,z)}
// Street lamps on sidewalks along the main avenues.
const lampMetal=mat(0x303940),lampGlow=new THREE.MeshStandardMaterial({color:0xffe6a8,emissive:0xffc45b,emissiveIntensity:1.35});
function streetLamp(x,z,turn=0){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=turn;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,6.4,8),lampMetal);pole.position.y=3.2;p.add(pole);const arm=new THREE.Mesh(new THREE.BoxGeometry(.16,.14,1.8),lampMetal);arm.position.set(0,6.15,.78);p.add(arm);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),lampGlow);bulb.position.set(0,5.95,1.55);p.add(bulb);scene.add(p)}
for(let street=-2;street<=2;street++)for(let pos=-250;pos<=250;pos+=70){streetLamp(9.2,street*70+pos,0);streetLamp(-9.2,street*70+pos,0);streetLamp(street*70+pos,9.2,Math.PI/2);streetLamp(street*70+pos,-9.2,Math.PI/2)}


/* Wateen amusement district: plaza, ferris wheel, carousel and coaster */
const parkFloor=new THREE.Mesh(new THREE.PlaneGeometry(112,92),mat(0x9b927b));parkFloor.rotation.x=-Math.PI/2;parkFloor.position.set(132,.025,-132);parkFloor.receiveShadow=true;scene.add(parkFloor);
const parkTrim=mat(0x463f38),rideGold=mat(0xe2ad4f,.45),rideRed=mat(0xb94d3d,.48),rideBlue=mat(0x4b91a7,.42);
function cylinderBetween(a,b,r,material){const dir=new THREE.Vector3().subVectors(b,a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,dir.length(),10),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());mesh.castShadow=true;scene.add(mesh);return mesh}
const wheelCenter=new THREE.Vector3(145,22,-145),wheelRadius=15;
const wheelRing=new THREE.Mesh(new THREE.TorusGeometry(wheelRadius,.48,10,64),rideGold);wheelRing.position.copy(wheelCenter);scene.add(wheelRing);
for(let i=0;i<12;i++){const a=i*Math.PI/6;const end=new THREE.Vector3(wheelCenter.x+Math.cos(a)*wheelRadius,wheelCenter.y+Math.sin(a)*wheelRadius,wheelCenter.z);cylinderBetween(wheelCenter,end,.16,rideGold);const cabin=new THREE.Group();const box=new THREE.Mesh(new THREE.BoxGeometry(2.4,2,2),[rideRed,rideBlue,rideGold][i%3]);box.position.y=-1; cabin.add(box);const roof=new THREE.Mesh(new THREE.BoxGeometry(2.7,.22,2.2),parkTrim);roof.position.y=.1;cabin.add(roof);cabin.position.set(end.x,end.y-1,end.z);scene.add(cabin)}
cylinderBetween(new THREE.Vector3(145,1,-145),new THREE.Vector3(137,22,-145),.55,parkTrim);
cylinderBetween(new THREE.Vector3(145,1,-145),new THREE.Vector3(153,22,-145),.55,parkTrim);
const coasterPath=new THREE.CatmullRomCurve3([new THREE.Vector3(95,5,-115),new THREE.Vector3(108,16,-122),new THREE.Vector3(122,7,-112),new THREE.Vector3(136,19,-126),new THREE.Vector3(151,6,-112),new THREE.Vector3(165,13,-126),new THREE.Vector3(178,5,-116)]);
const coasterRail=new THREE.Mesh(new THREE.TubeGeometry(coasterPath,100,.34,8,false),rideRed);scene.add(coasterRail);
for(let i=0;i<=28;i+=2){const p=coasterPath.getPoint(i/28);cylinderBetween(new THREE.Vector3(p.x,.3,p.z),p,.13,parkTrim)}
const coasterCar=new THREE.Mesh(new THREE.BoxGeometry(4,1.3,2.2),rideBlue);coasterCar.position.set(108,16,-122);scene.add(coasterCar);
const carouselBase=new THREE.Mesh(new THREE.CylinderGeometry(9,9,.7,32),rideGold);carouselBase.position.set(105,.55,-158);scene.add(carouselBase);
const carouselRoof=new THREE.Mesh(new THREE.ConeGeometry(10,4,32),rideRed);carouselRoof.position.set(105,6,-158);scene.add(carouselRoof);
const carouselPole=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,7,16),rideGold);carouselPole.position.set(105,3.5,-158);scene.add(carouselPole);
for(let i=0;i<10;i++){const a=i*Math.PI/5;const x=105+Math.cos(a)*7.2,z=-158+Math.sin(a)*7.2;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,5,8),rideGold);pole.position.set(x,3,z);scene.add(pole);const horse=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.9,3,7),rideBlue);horse.position.set(x,1.7,z);scene.add(horse)}
const parkSign=new THREE.Mesh(new THREE.BoxGeometry(24,3,.7),mat(0x263d50));parkSign.position.set(132,8,-180);scene.add(parkSign);
/* Adult visitor character with facial features and natural proportions */
const visitor=new THREE.Group();scene.add(visitor);visitor.position.set(121,0,-105);
const vSkin=mat(0xc88f70),vHair=mat(0x30221f),vDress=mat(0x6e4267),vDark=mat(0x28242b);
const vBody=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.72,5,10),vDress);vBody.position.y=1.48;visitor.add(vBody);
const vWaist=new THREE.Mesh(new THREE.CylinderGeometry(.29,.42,.42,12),vDress);vWaist.position.y=1.03;visitor.add(vWaist);
const vHips=new THREE.Mesh(new THREE.SphereGeometry(.43,12,10),vDress);vHips.scale.set(1,.7,.72);vHips.position.set(0,.82,0);visitor.add(vHips);
for(const x of [-.2,.2]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.72,4,8),vSkin);leg.position.set(x,.35,0);visitor.add(leg);const boot=new THREE.Mesh(new THREE.BoxGeometry(.25,.16,.38),vDark);boot.position.set(x,.08,.08);visitor.add(boot)}
for(const x of [-.52,.52]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.58,4,8),vSkin);arm.position.set(x,1.48,0);arm.rotation.z=x*.32;visitor.add(arm)}
const vHead=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),vSkin);vHead.position.y=2.35;visitor.add(vHead);
const vHairCap=new THREE.Mesh(new THREE.SphereGeometry(.315,12,10),vHair);vHairCap.position.set(0,2.43,-.035);visitor.add(vHairCap);
const vHairBack=new THREE.Mesh(new THREE.CapsuleGeometry(.2,.85,5,8),vHair);vHairBack.position.set(0,1.95,-.23);visitor.add(vHairBack);
for(const x of [-.105,.105]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.043,8,8),mat(0xf4eee4));eye.position.set(x,2.38,.275);visitor.add(eye);const pupil=new THREE.Mesh(new THREE.SphereGeometry(.022,8,8),mat(0x38251f));pupil.position.set(x,2.38,.31);visitor.add(pupil);const brow=new THREE.Mesh(new THREE.BoxGeometry(.09,.02,.025),vHair);brow.position.set(x,2.46,.28);visitor.add(brow)}
const vNose=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),vSkin);vNose.position.set(0,2.3,.31);visitor.add(vNose);
const vMouth=new THREE.Mesh(new THREE.BoxGeometry(.09,.018,.02),mat(0x8d514d));vMouth.position.set(0,2.21,.29);visitor.add(vMouth);

// Decorative waterfront and marina edge
const water=new THREE.Mesh(new THREE.PlaneGeometry(600,75),new THREE.MeshStandardMaterial({color:0x3c91a5,roughness:.25,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.set(0,-.04,-270);scene.add(water);

// Luxury permanent player home: furnished interior, courtyard, pool and garage.
const luxuryHome=new THREE.Group();luxuryHome.position.set(0,0,18);scene.add(luxuryHome);
const homeFloor=new THREE.Mesh(new THREE.BoxGeometry(24,.35,20),mat(0xb9aa91));homeFloor.position.set(0,.05,0);luxuryHome.add(homeFloor);
const homeWallMat=mat(0xe4dfd2),homeTrim=mat(0x8d6c4c),homeGlass=new THREE.MeshStandardMaterial({color:0x456a78,metalness:.28,roughness:.16});
for(const [x,z,w,d,h] of [[0,-10,24,.45,6],[-12,0,.45,20,6],[12,0,.45,20,6],[0,10,24,.45,6]]){const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),homeWallMat);wall.position.set(x,3,z);luxuryHome.add(wall);}
const homeRoof=new THREE.Mesh(new THREE.BoxGeometry(24,.55,20),mat(0x343e47));homeRoof.position.y=6.3;luxuryHome.add(homeRoof);
for(const x of [-8,-4,4,8]){const pillar=new THREE.Mesh(new THREE.BoxGeometry(.55,5.7,.55),homeTrim);pillar.position.set(x,2.9,9.7);luxuryHome.add(pillar);}
const loungeRug=new THREE.Mesh(new THREE.BoxGeometry(10,.08,6),mat(0x7b5550));loungeRug.position.set(-2,.27,-2);luxuryHome.add(loungeRug);
const sofaBase=new THREE.Mesh(new THREE.BoxGeometry(6,.8,1.5),mat(0x4d5960));sofaBase.position.set(-2,.85,-5);luxuryHome.add(sofaBase);
const sofaBack=new THREE.Mesh(new THREE.BoxGeometry(6,1.3,.35),mat(0x4d5960));sofaBack.position.set(-2,1.45,-5.65);luxuryHome.add(sofaBack);
const table=new THREE.Mesh(new THREE.BoxGeometry(3,.35,1.5),homeTrim);table.position.set(-2,.75,-1.8);luxuryHome.add(table);
const tv=new THREE.Mesh(new THREE.BoxGeometry(4,2.2,.18),mat(0x111820));tv.position.set(-2,2.1,-9.65);luxuryHome.add(tv);
const bedBase=new THREE.Mesh(new THREE.BoxGeometry(5,.65,6),mat(0x6d5548));bedBase.position.set(7,.65,2);luxuryHome.add(bedBase);
const mattress=new THREE.Mesh(new THREE.BoxGeometry(4.8,.35,5.8),mat(0xe7e2d7));mattress.position.set(7,1.12,2);luxuryHome.add(mattress);
for(const x of [5.8,8.2]){const pillow=new THREE.Mesh(new THREE.BoxGeometry(1.5,.25,1),mat(0xffffff));pillow.position.set(x,1.42,-.05);luxuryHome.add(pillow);}
const chandelier=new THREE.Group();chandelier.position.set(0,5.7,0);luxuryHome.add(chandelier);
const chandelierCore=new THREE.Mesh(new THREE.SphereGeometry(.45,12,10),new THREE.MeshStandardMaterial({color:0xffe2a1,emissive:0xffc66b,emissiveIntensity:1.4}));chandelier.add(chandelierCore);
for(let i=0;i<6;i++){const arm=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,2.2),homeTrim);arm.rotation.y=i*Math.PI/3;chandelier.add(arm);}
const kitchenIsland=new THREE.Mesh(new THREE.BoxGeometry(5,1.1,2),mat(0x777d7b));kitchenIsland.position.set(7,1, -6);luxuryHome.add(kitchenIsland);
const homePool=new THREE.Mesh(new THREE.BoxGeometry(13,.45,5),new THREE.MeshStandardMaterial({color:0x258ca5,metalness:.2,roughness:.16}));homePool.position.set(0,.25,15);luxuryHome.add(homePool);
const poolRim=new THREE.Mesh(new THREE.BoxGeometry(14,.35,6),mat(0xd6d0c3));poolRim.position.set(0,.05,15);luxuryHome.add(poolRim);homePool.position.y=.28;
const garage=new THREE.Mesh(new THREE.BoxGeometry(9,4,8),mat(0xc5c3b9));garage.position.set(18,2,-5);luxuryHome.add(garage);
const garageDoor=new THREE.Mesh(new THREE.BoxGeometry(8,.12,3.4),mat(0x48565c));garageDoor.position.set(18,1.7,-.9);luxuryHome.add(garageDoor);
addArabicSign(luxuryHome,'قصر اللاعب الفاخر','شارع القصور - وسط المدينة',15,1.5,0,5,10.25);

// City services, military and community districts with Arabic addresses.
const civicPlaces=[];
function addCivicPlace(name,kind,address,x,z,color,w=24,h=9,d=18){
 const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
 const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));body.position.y=h/2;body.castShadow=true;group.add(body);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(w+1,.55,d+1),mat(0x46545c));roof.position.y=h+.25;group.add(roof);
 const entry=new THREE.Mesh(new THREE.BoxGeometry(3.2,4,.22),mat(0x344e5d));entry.position.set(0,2,d/2+.12);group.add(entry);
 addArabicSign(group,name,address,Math.min(w-2,21),1.6,0,h-.6,d/2+.2);
 civicPlaces.push({group,name,kind,address});
 return group;
}
addCivicPlace('مستشفى وتين العام','مستشفى','شارع الصحة - الحي الطبي',-175,115,0xd8dedb,32,12,22);
addCivicPlace('مركز الطوارئ التخصصي','مركز إسعاف','شارع الصحة - الحي الطبي',-135,115,0xbfcfca,22,8,17);
addCivicPlace('مديرية شرطة وتين','شرطة','شارع الأمن - وسط المدينة',-90,115,0x7f929d,26,10,19);
addCivicPlace('مركز الدفاع المدني','إطفاء','شارع الإنقاذ - وسط المدينة',-45,115,0xc18b70,24,9,18);
addCivicPlace('جامعة وتين','جامعة','شارع المعرفة - الحي التعليمي',15,115,0xd0c5a8,34,11,22);
addCivicPlace('مدرسة الأجيال','مدرسة','شارع المعرفة - الحي التعليمي',65,115,0xb7c8d0,25,8,18);
addCivicPlace('قاعدة وتين العسكرية','قاعدة عسكرية','طريق القاعدة - الأطراف الشمالية',-245,75,0x737e6c,38,10,25);
addCivicPlace('معسكر التدريب المركزي','معسكر تدريب','طريق القاعدة - الأطراف الشمالية',-245,25,0x858b78,32,8,22);
addCivicPlace('المنطقة الصناعية','مصانع وورش','شارع الصناعة - المنطقة الصناعية',-245,-65,0x858b8c,38,12,25);
addCivicPlace('ميناء وتين التجاري','ميناء','طريق الميناء - الساحل الغربي',-175,-115,0x87999b,32,9,20);
addCivicPlace('مركز التسوق الكبير','مركز تجاري','شارع التجارة - وسط المدينة',85,115,0xb7a58c,28,10,20);

const player=new THREE.Group();scene.add(player);
const skin=mat(0xb98260),shirt=mat(0x263d50),pants=mat(0x20252b),shoe=mat(0x17191b);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.8,4,8),shirt);torso.position.y=1.48;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),skin);head.position.y=2.35;head.castShadow=true;player.add(head);
function faceDetails(group,scale=1){
  const eyeWhite=new THREE.MeshStandardMaterial({color:0xf4eee4,roughness:.35});
  const iris=new THREE.MeshStandardMaterial({color:0x49372b,roughness:.3});
  const dark=new THREE.MeshStandardMaterial({color:0x211b19,roughness:.8});
  const lip=new THREE.MeshStandardMaterial({color:0x754b45,roughness:.65});
  for(const x of [-.115,.115]){
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.052*scale,10,8),eyeWhite);eye.position.set(x*scale,2.39*scale,.286*scale);group.add(eye);
    const pupil=new THREE.Mesh(new THREE.SphereGeometry(.027*scale,8,8),iris);pupil.position.set(x*scale,2.39*scale,.33*scale);group.add(pupil);
    const brow=new THREE.Mesh(new THREE.BoxGeometry(.105*scale,.025*scale,.035*scale),dark);brow.position.set(x*scale,2.48*scale,.29*scale);group.add(brow);
    const ear=new THREE.Mesh(new THREE.SphereGeometry(.07*scale,8,8),skin);ear.position.set(x*2.7*scale,2.34*scale,0);group.add(ear);
  }
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.055*scale,8,8),skin);nose.scale.set(.72,1.25,.8);nose.position.set(0,2.31*scale,.32*scale);group.add(nose);
  const mouth=new THREE.Mesh(new THREE.BoxGeometry(.105*scale,.022*scale,.018*scale),lip);mouth.position.set(0,2.22*scale,.298*scale);group.add(mouth);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.335*scale,12,10,0,Math.PI*2,0,Math.PI*.58),dark);hair.position.set(0,2.43*scale,-.015*scale);group.add(hair);
}
faceDetails(player);

// Neck, jawline, layered hair and subtle facial shaping
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.28,12),skin);neck.position.y=2.02;player.add(neck);
const jaw=new THREE.Mesh(new THREE.SphereGeometry(.255,14,12),skin);jaw.scale.set(1,.72,.88);jaw.position.set(0,2.22,.035);player.add(jaw);
const noseBridge=new THREE.Mesh(new THREE.CapsuleGeometry(.027,.105,4,7),skin);noseBridge.position.set(0,2.345,.305);player.add(noseBridge);
for(const x of [-.19,.19]){const cheek=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),skin);cheek.scale.set(1,.7,.45);cheek.position.set(x,2.285,.235);player.add(cheek)}
const hairFringe=new THREE.Mesh(new THREE.SphereGeometry(.34,14,10,0,Math.PI,0,Math.PI*.32),mat(0x211d1a));hairFringe.scale.set(1,.75,1);hairFringe.position.set(0,2.53,.035);player.add(hairFringe);
const collar=new THREE.Mesh(new THREE.CylinderGeometry(.24,.31,.18,12),mat(0x172b38));collar.position.set(0,1.94,0);player.add(collar);
const jacketFront=new THREE.Mesh(new THREE.BoxGeometry(.12,.72,.045),mat(0x52616a));jacketFront.position.set(0,1.48,.47);player.add(jacketFront);
const legPivots=[],armPivots=[];
for(const x of [-.23,.23]){
 const pivot=new THREE.Group();pivot.position.set(x,.94,0);player.add(pivot);
 const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.62,5,9),pants);leg.position.y=-.39;leg.castShadow=true;pivot.add(leg);
 const knee=new THREE.Mesh(new THREE.SphereGeometry(.145,10,8),pants);knee.position.y=-.55;pivot.add(knee);
 const foot=new THREE.Mesh(new THREE.BoxGeometry(.29,.17,.46),shoe);foot.position.set(0,-.82,.1);foot.castShadow=true;pivot.add(foot);
 const sole=new THREE.Mesh(new THREE.BoxGeometry(.3,.045,.47),mat(0x080a0c));sole.position.set(0,-.91,.1);pivot.add(sole);
 legPivots.push(pivot);
}
for(const x of [-.58,.58]){
 const pivot=new THREE.Group();pivot.position.set(x,1.83,0);player.add(pivot);
 const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.145,.62,5,9),shirt);arm.position.y=-.38;arm.castShadow=true;pivot.add(arm);
 const forearm=new THREE.Mesh(new THREE.CapsuleGeometry(.115,.38,5,8),skin);forearm.position.set(0,-.79,.015);pivot.add(forearm);
 const hand=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),skin);hand.position.set(0,-1.04,.035);pivot.add(hand);
 armPivots.push(pivot);
}
player.position.set(0,0,18);
const car=new THREE.Group();const carBody=new THREE.Mesh(new THREE.BoxGeometry(2.3,.75,4.4),mat(0xa33d32,.42));carBody.position.y=.85;car.add(carBody);const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.75,.8,2.1),windowMat);cabin.position.set(0,1.55,-.25);car.add(cabin);for(const x of [-1,1])for(const z of [-1.4,1.4]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.24,12),mat(0x17191b));wheel.rotation.z=Math.PI/2;wheel.position.set(x, .43,z);car.add(wheel)}car.position.set(7,0,18);car.rotation.y=Math.PI;scene.add(car);
let inCar=false,run=false;const keys={};let joy={x:0,y:0};let yaw=0;
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='Shift')run=true});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;if(e.key==='Shift')run=false});
const area=document.querySelector('#stickArea'),stick=document.querySelector('#stick');let pointer=null;
area.addEventListener('pointerdown',e=>{pointer=e.pointerId;area.setPointerCapture(pointer);moveStick(e)});
area.addEventListener('pointermove',e=>{if(e.pointerId===pointer)moveStick(e)});
function moveStick(e){const r=area.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const len=Math.hypot(dx,dy),max=39;if(len>max){dx=dx/len*max;dy=dy/len*max}joy.x=dx/max;joy.y=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`}
function resetStick(){pointer=null;joy={x:0,y:0};stick.style.transform='translate(0,0)'}area.addEventListener('pointerup',resetStick);area.addEventListener('pointercancel',resetStick);
document.querySelector('#runBtn').addEventListener('pointerdown',()=>run=true);document.querySelector('#runBtn').addEventListener('pointerup',()=>run=false);document.querySelector('#runBtn').addEventListener('pointerleave',()=>run=false);
document.querySelector('#enterBtn').addEventListener('click',()=>{if(!inCar&&player.position.distanceTo(car.position)<5){inCar=true;document.querySelector('#hint').textContent='أنت الآن تقود السيارة'}else if(inCar){inCar=false;player.position.copy(car.position).add(new THREE.Vector3(2,0,0));document.querySelector('#hint').textContent='نزلت من السيارة'}else document.querySelector('#hint').textContent='اقترب من السيارة حتى تتمكن من ركوبها'});

// Living city systems: pedestrian routes, moving traffic, shops and time of day.
const citizenMaterials=[mat(0x38536b),mat(0x8b4d3f),mat(0x6b7650),mat(0x6c5278),mat(0xb18b53)];
const citizens=[];
for(let i=0;i<12;i++){
 const npc=new THREE.Group();
 const clothes=citizenMaterials[i%citizenMaterials.length];
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.72,4,8),clothes);body.position.y=1.18;npc.add(body);
 const headNpc=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),mat([0xb98260,0x9b6a4f,0xd0a17d][i%3]));headNpc.position.y=1.86;npc.add(headNpc);
 const hairNpc=new THREE.Mesh(new THREE.SphereGeometry(.225,10,8,0,Math.PI*2,0,Math.PI*.55),mat(0x29211d));hairNpc.position.set(0,1.94,-.025);npc.add(hairNpc);
 const legs=[];
 for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*.11,.78,0);npc.add(pivot);const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.55,3,7),mat(0x242a31));leg.position.y=-.32;pivot.add(leg);legs.push(pivot);}
 const arms=[];
 for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*.32,1.42,0);npc.add(pivot);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.48,3,7),clothes);arm.position.y=-.25;pivot.add(arm);arms.push(pivot);}
 const route=i%4,offset=(i%3)*5;
 npc.position.set(route===0?-13:route===1?13:offset,0,route===2?-13:route===3?13:offset);
 scene.add(npc);citizens.push({npc,legs,arms,phase:i*.8,route,speed:1.1+(i%4)*.18,origin:npc.position.clone()});
}
const traffic=[];
function makeTrafficCar(color,style=0){
 const g=new THREE.Group(),paint=mat(color,.28),glass=new THREE.MeshStandardMaterial({color:0x294b5b,metalness:.3,roughness:.18}),tire=mat(0x111416,.95),rim=new THREE.MeshStandardMaterial({color:0xb9c2c5,metalness:.8,roughness:.22});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.95,.62,3.75),paint);body.position.y=.76;body.castShadow=true;g.add(body);
 const hood=new THREE.Mesh(new THREE.BoxGeometry(1.86,.16,.95),paint);hood.position.set(0,1.08,-1.35);g.add(hood);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.58,.72,1.82),glass);cabin.position.set(0,1.28,-.12);g.add(cabin);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(1.5,.12,1.25),paint);roof.position.set(0,1.68,-.1);g.add(roof);
 for(const x of [-1,1]){const mirror=new THREE.Mesh(new THREE.BoxGeometry(.18,.13,.25),paint);mirror.position.set(x*1.02,1.24,-.72);g.add(mirror);for(const z of [-1.18,1.18]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.22,16),tire);w.rotation.z=Math.PI/2;w.position.set(x*.98,.39,z);g.add(w);const h=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.235,12),rim);h.rotation.z=Math.PI/2;h.position.set(x*.98,.39,z);g.add(h)}}
 for(const x of [-.67,.67]){const light=new THREE.Mesh(new THREE.BoxGeometry(.36,.17,.06),mat(0xffedc1,.25));light.position.set(x,.9,-1.9);g.add(light);const tail=new THREE.Mesh(new THREE.BoxGeometry(.32,.17,.06),mat(0xc52d25,.35));tail.position.set(x,.9,1.9);g.add(tail)}
 const bumper=new THREE.Mesh(new THREE.BoxGeometry(2,.14,.12),rim);bumper.position.set(0,.57,-1.92);g.add(bumper);
 if(style===1){g.scale.set(1.08,1.16,1.12);for(const x of [-.58,.58]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.08,.12,1.35),rim);rail.position.set(x,1.82,-.12);g.add(rail);}}
 else if(style===2){const bed=new THREE.Mesh(new THREE.BoxGeometry(1.72,.18,1.35),paint);bed.position.set(0,1.08,1.05);g.add(bed);for(const x of [-.84,.84]){const wall=new THREE.Mesh(new THREE.BoxGeometry(.12,.48,1.35),paint);wall.position.set(x,1.28,1.05);g.add(wall);}const tailgate=new THREE.Mesh(new THREE.BoxGeometry(1.72,.48,.12),paint);tailgate.position.set(0,1.28,1.7);g.add(tailgate);}
 else if(style===3){g.scale.set(1.02,.88,1.08);const spoiler=new THREE.Mesh(new THREE.BoxGeometry(1.7,.09,.32),paint);spoiler.position.set(0,1.55,1.55);g.add(spoiler);}
 scene.add(g);return g;
}
const roadLines=[-140,-70,0,70,140];
for(let i=0;i<20;i++){const axis=i<10?'z':'x',slot=i%10,roadLine=roadLines[Math.floor(slot/2)],direction=slot%2===0?1:-1,lane=direction>0?-2.35:2.35,vehicle=makeTrafficCar([0x9c4138,0xc4c9c8,0x315d78,0xc69a4c,0x53664d,0x292e33,0x263d50,0xe0e0d8,0x6f777c,0x8d382e,0x54765e,0x343a42,0x5b4d79,0x8b6546,0x447b83,0x343434,0x9e9e9e,0x8c3333,0x486347,0x4a5d7a][i],i%4);traffic.push({vehicle,axis,roadLine,lane,progress:i/20,direction,speed:9+(i%4)*2});}
function addArabicSign(parent,label,address,width=12,height=1.7,x=0,y=5,z=0){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#142b3b';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#e7b85e';ctx.lineWidth=12;ctx.strokeRect(8,8,1008,240);
 ctx.direction='rtl';ctx.textAlign='center';ctx.fillStyle='#f4cc7c';ctx.font='bold 76px Tahoma,Arial';ctx.fillText(label,512,105);
 ctx.fillStyle='#ffffff';ctx.font='36px Tahoma,Arial';ctx.fillText(address,512,190);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const panel=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
 panel.position.set(x,y,z);parent.add(panel);return panel;
}
const shop=new THREE.Group();scene.add(shop);shop.position.set(10,0,19);shop.rotation.y=-Math.PI/2;
const shopBody=new THREE.Mesh(new THREE.BoxGeometry(9,5,7),mat(0xc9b28e));shopBody.position.y=2.5;shop.add(shopBody);
const shopFront=new THREE.Mesh(new THREE.BoxGeometry(5,2.1,.12),mat(0x365a67));shopFront.position.set(0,2.3,3.58);shop.add(shopFront);
const shopAwning=new THREE.Mesh(new THREE.BoxGeometry(6,.35,1.3),mat(0xa54a3d));shopAwning.position.set(0,3.7,4);shop.add(shopAwning);
const shopSign=new THREE.Mesh(new THREE.BoxGeometry(5.4,.8,.2),mat(0x253c49));shopSign.position.set(0,4.5,3.62);shop.add(shopSign);
addArabicSign(shop,'سوبرماركت وتين','شارع السوق - وسط المدينة',7,1.55,0,4.55,3.74);
const shopMarker=new THREE.Mesh(new THREE.TorusGeometry(.65,.09,8,24),rideGold);shopMarker.rotation.x=Math.PI/2;shopMarker.position.set(0,.12,4.6);shop.add(shopMarker);
const restaurant=new THREE.Group();scene.add(restaurant);restaurant.position.set(-10,0,19);restaurant.rotation.y=Math.PI/2;
const restBody=new THREE.Mesh(new THREE.BoxGeometry(10,5.4,8),mat(0xd7c3a3));restBody.position.y=2.7;restBody.castShadow=true;restaurant.add(restBody);
const restGlass=new THREE.Mesh(new THREE.BoxGeometry(6.4,2.35,.12),windowMat);restGlass.position.set(0,2.35,4.06);restaurant.add(restGlass);
const restDoor=new THREE.Mesh(new THREE.BoxGeometry(1.15,2.5,.16),mat(0x3b4b50));restDoor.position.set(-3.65,1.28,4.12);restaurant.add(restDoor);
const restAwning=new THREE.Mesh(new THREE.BoxGeometry(7,.42,1.5),mat(0x9e3d32));restAwning.position.set(0,3.85,4.45);restaurant.add(restAwning);
const restSign=new THREE.Mesh(new THREE.BoxGeometry(6,.85,.22),mat(0x263d50));restSign.position.set(0,4.65,4.1);restaurant.add(restSign);
addArabicSign(restaurant,'مطعم وتين','شارع المطاعم - وسط المدينة',8,1.6,0,4.7,4.19);
const restMarker=new THREE.Mesh(new THREE.TorusGeometry(.7,.1,8,24),rideGold);restMarker.rotation.x=Math.PI/2;restMarker.position.set(0,.14,5.05);restaurant.add(restMarker);

/* Fuel station and a dedicated off-road parking area. */
const fuelStation=new THREE.Group();scene.add(fuelStation);fuelStation.position.set(-105,0,35);
const stationBase=new THREE.Mesh(new THREE.BoxGeometry(31,.18,25),mat(0x777b72));stationBase.position.y=.12;fuelStation.add(stationBase);
const stationShop=new THREE.Mesh(new THREE.BoxGeometry(10,5,8),mat(0xd8d0bd));stationShop.position.set(-9,2.65,0);fuelStation.add(stationShop);
const stationGlass=new THREE.Mesh(new THREE.BoxGeometry(6,2,.12),windowMat);stationGlass.position.set(-9,2.2,4.08);fuelStation.add(stationGlass);
const canopy=new THREE.Mesh(new THREE.BoxGeometry(20,.55,12),mat(0xd6d8d5));canopy.position.set(5,5.2,0);fuelStation.add(canopy);
const canopyTrim=new THREE.Mesh(new THREE.BoxGeometry(20,.35,12.2),mat(0xb63d32));canopyTrim.position.set(5,4.88,0);fuelStation.add(canopyTrim);
for(let i=0;i<3;i++){const pump=new THREE.Group();pump.position.set(-1+i*6,.2,0);const base=new THREE.Mesh(new THREE.BoxGeometry(1.15,.35,1),mat(0x343b40));base.position.y=.18;pump.add(base);const body=new THREE.Mesh(new THREE.BoxGeometry(.85,1.65,.72),mat(i===1?0xd9d9d2:0xe8e5dc));body.position.y=1.12;pump.add(body);const screen=new THREE.Mesh(new THREE.BoxGeometry(.55,.35,.04),mat(0x253b48));screen.position.set(0,1.48,.38);pump.add(screen);const hose=new THREE.Mesh(new THREE.TorusGeometry(.38,.055,6,14,Math.PI),mat(0x202326));hose.position.set(.48,1.05,.12);hose.rotation.z=Math.PI/2;pump.add(hose);fuelStation.add(pump);}
const stationSign=new THREE.Mesh(new THREE.BoxGeometry(9,1.6,.35),mat(0x263d50));stationSign.position.set(5,7.2,-6.2);fuelStation.add(stationSign);
addArabicSign(fuelStation,'محطة وقود وتين','طريق الميناء - الحي الغربي',10,1.8,5,7.2,-6.0);
const parkingLot=new THREE.Group();scene.add(parkingLot);parkingLot.position.set(105,0,35);
const parkingFloor=new THREE.Mesh(new THREE.BoxGeometry(32,.16,25),mat(0x777b72));parkingFloor.position.y=.1;parkingLot.add(parkingFloor);
const parkingLine=mat(0xe8dfc6);
for(let i=0;i<7;i++){const line=new THREE.Mesh(new THREE.BoxGeometry(.14,.035,9),parkingLine);line.position.set(-13+i*4.3,.21,0);parkingLot.add(line);}
for(const [i,slot] of [-10,-2,6].entries()){const parked=makeTrafficCar([0x315d78,0x9c4138,0xc4c9c8][i]);parked.position.set(slot,.03,-4);parked.rotation.y=Math.PI;parkingLot.add(parked);}
addArabicSign(parkingLot,'مواقف وتين','شارع الخدمات - الحي الشرقي',12,1.6,0,4.2,12.55);

// New commercial street: six individually signed and addressable storefronts.
const retailShops=[];
const retailDefinitions=[
 ['صيدلية الشفاء','صيدلية','شارع النخيل - الحي التجاري',150,105,0xe4e8df],
 ['مخبز التنور','مخبز','شارع النخيل - الحي التجاري',174,105,0xc99b67],
 ['أزياء وتين','ملابس','شارع النخيل - الحي التجاري',198,105,0x8d789c],
 ['إلكترونيات المدينة','إلكترونيات','شارع النخيل - الحي التجاري',222,105,0x7895a8],
 ['مركز المواد الغذائية','مواد غذائية','شارع النخيل - الحي التجاري',246,105,0xb3a77c],
 ['ورشة المحركات','صيانة سيارات','شارع النخيل - الحي التجاري',270,105,0x78817f]
];
for(const [name,category,address,x,z,color] of retailDefinitions){
 const store=new THREE.Group();store.position.set(x,0,z);scene.add(store);
 const shell=new THREE.Mesh(new THREE.BoxGeometry(17,6.5,12),mat(color));shell.position.y=3.25;shell.castShadow=true;store.add(shell);
 const fascia=new THREE.Mesh(new THREE.BoxGeometry(15,1.1,.22),mat(0x203747));fascia.position.set(0,5.1,6.12);store.add(fascia);
 const glass=new THREE.Mesh(new THREE.BoxGeometry(5.6,2.5,.12),new THREE.MeshStandardMaterial({color:0x477184,metalness:.25,roughness:.2}));glass.position.set(-3,2.5,6.1);store.add(glass);
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.35,2.7,.18),mat(0x3a4144));door.position.set(5,1.4,6.12);store.add(door);
 const awning=new THREE.Mesh(new THREE.BoxGeometry(15,.32,1.5),mat(0x9f493d));awning.position.set(0,4.15,6.8);store.add(awning);
 addArabicSign(store,name,address,14.5,1.55,0,5.15,6.25);
 const step=new THREE.Mesh(new THREE.BoxGeometry(16,.2,2),mat(0xb6ad9b));step.position.set(0,.12,7);store.add(step);
 retailShops.push({group:store,name,category,address});
}
// Wateen International Airport: runway, terminal, control tower and a parked passenger aircraft.
const airport=new THREE.Group();airport.position.set(-225,0,-175);scene.add(airport);
const runway=new THREE.Mesh(new THREE.BoxGeometry(125,.18,23),mat(0x343a40));runway.position.set(0,.1,-28);airport.add(runway);
const runwayEdge=mat(0xe5e0ce);
for(const x of [-59,59]){const edge=new THREE.Mesh(new THREE.BoxGeometry(.35,.04,20),runwayEdge);edge.position.set(x,.22,-28);airport.add(edge);}
for(let x=-48;x<=48;x+=12){const dash=new THREE.Mesh(new THREE.BoxGeometry(5,.045,.35),runwayEdge);dash.position.set(x,.22,-28);airport.add(dash);}
const apron=new THREE.Mesh(new THREE.BoxGeometry(70,.16,18),mat(0x737a7b));apron.position.set(0,.08,-8);airport.add(apron);
const terminal=new THREE.Mesh(new THREE.BoxGeometry(48,8,15),mat(0xc8c9c1));terminal.position.set(0,4,10);terminal.castShadow=true;airport.add(terminal);
const terminalGlass=new THREE.Mesh(new THREE.BoxGeometry(40,3.1,.12),windowMat);terminalGlass.position.set(0,4,17.58);airport.add(terminalGlass);
const terminalRoof=new THREE.Mesh(new THREE.BoxGeometry(50,.65,16),mat(0x425563));terminalRoof.position.set(0,8.3,10);airport.add(terminalRoof);
addArabicSign(airport,'مطار وتين الدولي','طريق المطار - الضواحي الغربية',31,2.5,0,7.1,17.72);
const tower=new THREE.Group();tower.position.set(29,0,8);airport.add(tower);
const towerBase=new THREE.Mesh(new THREE.BoxGeometry(5,13,5),mat(0xb4b8b4));towerBase.position.y=6.5;tower.add(towerBase);
const towerCab=new THREE.Mesh(new THREE.BoxGeometry(8,3.2,8),mat(0x344e5d));towerCab.position.y=14.2;tower.add(towerCab);
const towerRoof=new THREE.Mesh(new THREE.BoxGeometry(8.8,.35,8.8),mat(0x9d4a3d));towerRoof.position.y=16;tower.add(towerRoof);
addArabicSign(tower,'برج المراقبة','مطار وتين الدولي',7,1.4,0,14.2,4.08);
const plane=new THREE.Group();plane.position.set(-8,.5,-27);plane.rotation.y=Math.PI/2;airport.add(plane);
const fuselage=new THREE.Mesh(new THREE.CylinderGeometry(.95,.95,19,16),mat(0xf0eee6));fuselage.rotation.z=Math.PI/2;plane.add(fuselage);
const nose=new THREE.Mesh(new THREE.SphereGeometry(.95,16,10),mat(0xd9e2e6));nose.scale.set(1,1,1.35);nose.position.x=10;plane.add(nose);
const tailFin=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.2,.35),mat(0x9d4037));tailFin.position.set(-8,2,0);plane.add(tailFin);
const wing=new THREE.Mesh(new THREE.BoxGeometry(2.5,.22,27),mat(0xd5d8d6));wing.position.set(0,-.25,0);plane.add(wing);
for(const side of [-1,1]){const engine=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,2.8,12),mat(0x69777e));engine.rotation.x=Math.PI/2;engine.position.set(1,-.8,side*6.5);plane.add(engine);}
for(const x of [-7,5]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.18,10),mat(0x17191b));wheel.rotation.z=Math.PI/2;wheel.position.set(x,-1.1,0);plane.add(wheel);}

// Airport operations: taxi lanes, gate bridges, apron lights, service fleet and passenger parking.
const airportLights=[];
const airportLampMat=new THREE.MeshStandardMaterial({color:0xffe6a6,emissive:0xffc45a,emissiveIntensity:1.5});
for(let x=-55;x<=55;x+=11){
 const taxiLamp=new THREE.Mesh(new THREE.SphereGeometry(.22,8,8),airportLampMat);taxiLamp.position.set(x,.55,-15);airport.add(taxiLamp);airportLights.push(taxiLamp);
 const edgeLamp=new THREE.Mesh(new THREE.SphereGeometry(.18,8,8),airportLampMat);edgeLamp.position.set(x,.45,-40);airport.add(edgeLamp);airportLights.push(edgeLamp);
}
for(let i=0;i<3;i++){
 const gateX=-17+i*17;
 const bridge=new THREE.Group();bridge.position.set(gateX,0,18);airport.add(bridge);
 const corridor=new THREE.Mesh(new THREE.BoxGeometry(7,2.6,5),mat(0xb7c3c5));corridor.position.set(0,4.3,-3);bridge.add(corridor);
 const support=new THREE.Mesh(new THREE.BoxGeometry(.45,4,.45),mat(0x59656a));support.position.set(0,2,-3);bridge.add(support);
 const gateSign=new THREE.Mesh(new THREE.BoxGeometry(4,1.2,.18),mat(0x1b3948));gateSign.position.set(0,6,0);bridge.add(gateSign);
 addArabicSign(bridge,'بوابة '+(i+1),'صالة المغادرة',3.8,1,0,6,0.12);
}
const hangar=new THREE.Group();hangar.position.set(-48,0,5);airport.add(hangar);
const hangarBody=new THREE.Mesh(new THREE.BoxGeometry(19,9,17),mat(0x9da8a8));hangarBody.position.y=4.5;hangar.add(hangarBody);
const hangarDoor=new THREE.Mesh(new THREE.BoxGeometry(12,6,.2),mat(0x354b58));hangarDoor.position.set(0,3,8.62);hangar.add(hangarDoor);
addArabicSign(hangar,'حظيرة الطائرات','مطار وتين الدولي',15,1.6,0,7,8.76);
const airportParking=new THREE.Group();airportParking.position.set(0,0,31);airport.add(airportParking);
const airportParkFloor=new THREE.Mesh(new THREE.BoxGeometry(48,.14,13),mat(0x555d60));airportParkFloor.position.set(0,.08,0);airportParking.add(airportParkFloor);
for(let i=0;i<9;i++){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.13,.035,9),mat(0xe8e1c9));stripe.position.set(-21+i*5.2,.18,0);airportParking.add(stripe);}
for(let i=0;i<4;i++){
 const van=new THREE.Group();van.position.set(-15+i*10,.12,-1);airport.add(van);
 const body=new THREE.Mesh(new THREE.BoxGeometry(4.8,1.7,2.2),mat([0xe7e7df,0xd6b45f,0x477184,0xb7c1c2][i]));body.position.y=1.1;van.add(body);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(2.1,1.1,2.05),mat(0x42606c));cabin.position.set(.7,2.05,0);van.add(cabin);
 for(const wx of [-1.5,1.5])for(const wz of [-1,1]){const tyre=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.22,10),mat(0x17191b));tyre.rotation.x=Math.PI/2;tyre.position.set(wx,.48,wz);van.add(tyre);}
}
addArabicSign(airport,'مواقف المسافرين','مطار وتين الدولي',17,1.4,0,2,38);

addArabicSign(airport,'لوحة الرحلات','المغادرة والوصول - صالة السفر',19,1.5,0,6.4,18.05);
// Airport passenger shuttle and baggage handling area.
const airportShuttle=new THREE.Group();airportShuttle.position.set(-18,0,25);airport.add(airportShuttle);
const shuttleBody=new THREE.Mesh(new THREE.BoxGeometry(7,2.2,2.7),mat(0xe5e8e2));shuttleBody.position.y=1.55;airportShuttle.add(shuttleBody);
const shuttleGlass=new THREE.Mesh(new THREE.BoxGeometry(5.8,1,.08),mat(0x36596b));shuttleGlass.position.set(0,2.05,1.38);airportShuttle.add(shuttleGlass);
const shuttleStripe=new THREE.Mesh(new THREE.BoxGeometry(6.8,.22,2.76),mat(0x9d4037));shuttleStripe.position.y=1.05;airportShuttle.add(shuttleStripe);
for(const wx of [-2.2,2.2])for(const wz of [-1.25,1.25]){const tyre=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.22,12),mat(0x17191b));tyre.rotation.x=Math.PI/2;tyre.position.set(wx,.48,wz);airportShuttle.add(tyre);}
addArabicSign(airportShuttle,'حافلة المطار','نقل المسافرين',4.5,.8,0,3,1.42);
const baggageZone=new THREE.Group();baggageZone.position.set(39,0,20);airport.add(baggageZone);
for(let i=0;i<4;i++){const bag=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.1,1.1),mat([0x9d4037,0x315d78,0x33383b,0xb69a58][i]));bag.position.set(i*1.7,.65,0);baggageZone.add(bag);}
const radarDish=new THREE.Group();radarDish.position.set(29,17,8);tower.add(radarDish);
const radarArm=new THREE.Mesh(new THREE.BoxGeometry(9,.16,.35),mat(0x344e5d));radarArm.position.y=1;radarDish.add(radarArm);
const radarHub=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.7,12),mat(0x9d4037));radarHub.position.y=1;radarDish.add(radarHub);
let airportShuttleClock=0;
let airportBaggageJobDone=false;


// A second aviation facility: a marked city heliport with a rescue helicopter.
const heliport=new THREE.Group();heliport.position.set(225,0,-205);scene.add(heliport);
const helipad=new THREE.Mesh(new THREE.CylinderGeometry(18,18,.25,48),mat(0x555e61));helipad.position.y=.12;heliport.add(helipad);
const padRing=new THREE.Mesh(new THREE.TorusGeometry(15,.35,8,48),mat(0xe8e5d7));padRing.rotation.x=Math.PI/2;padRing.position.y=.28;heliport.add(padRing);
const hMark=new THREE.Mesh(new THREE.BoxGeometry(2.8,.08,10),mat(0xf4f0dc));hMark.position.set(0,.3,0);heliport.add(hMark);
const hBar=new THREE.Mesh(new THREE.BoxGeometry(8,.08,2),mat(0xf4f0dc));hBar.position.set(0,.3,0);heliport.add(hBar);
const heliBuilding=new THREE.Mesh(new THREE.BoxGeometry(25,5,12),mat(0xd0d1c8));heliBuilding.position.set(0,2.5,28);heliport.add(heliBuilding);
addArabicSign(heliport,'مهبط وتين الجوي','طريق الخدمات الشمالية',19,1.7,0,4.4,34.1);
const helicopter=new THREE.Group();helicopter.position.set(0,2,0);heliport.add(helicopter);
const heliCabin=new THREE.Mesh(new THREE.SphereGeometry(2.4,16,12),mat(0xd9d8c8));heliCabin.scale.set(1.55,.8,1);helicopter.add(heliCabin);
const heliNose=new THREE.Mesh(new THREE.SphereGeometry(1.3,14,10),new THREE.MeshStandardMaterial({color:0x496c7a,metalness:.25,roughness:.2}));heliNose.scale.set(.8,.65,.7);heliNose.position.z=2;helicopter.add(heliNose);
const heliTail=new THREE.Mesh(new THREE.CylinderGeometry(.18,.32,7,8),mat(0xb9b9ac));heliTail.rotation.x=Math.PI/2;heliTail.position.z=-4.2;helicopter.add(heliTail);
const heliFin=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.8,.18),mat(0x9d4037));heliFin.position.set(0,1,-7.2);helicopter.add(heliFin);
const heliRotor=new THREE.Group();heliRotor.position.y=2.3;helicopter.add(heliRotor);
for(let i=0;i<4;i++){const blade=new THREE.Mesh(new THREE.BoxGeometry(.42,.09,9),mat(0x252b30));blade.rotation.y=i*Math.PI/2;heliRotor.add(blade);}
const heliTailRotor=new THREE.Group();heliTailRotor.position.set(0,.9,-7.2);helicopter.add(heliTailRotor);
for(let i=0;i<3;i++){const blade=new THREE.Mesh(new THREE.BoxGeometry(.16,.12,2.1),mat(0x252b30));blade.rotation.y=i*Math.PI*2/3;heliTailRotor.add(blade);}
for(const z of [-1.5,1.5]){const skid=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,5,8),mat(0x333a3d));skid.rotation.z=Math.PI/2;skid.position.set(0,-1.8,z);helicopter.add(skid);}
const heliBeacon=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),new THREE.MeshStandardMaterial({color:0xff3830,emissive:0xaa1008,emissiveIntensity:1.8}));heliBeacon.position.set(0,1.2,-1.5);helicopter.add(heliBeacon);

// More named residential buildings with visible street addresses.
const residentialBlocks=[];
const residenceData=[
 ['مجمع النخيل السكني','شارع النخيل - القطاع السكني',150,165,0xd1c5ae,20],
 ['عمارات الرافدين','شارع الرافدين - القطاع السكني',190,165,0xaab9bc,24],
 ['مجمع الواجهة','شارع النهر - القطاع السكني',230,165,0xc8b9a2,28],
 ['برج وتين السكني','شارع الأبراج - القطاع السكني',270,165,0x9daeb5,34]
];
for(const [name,address,x,z,color,height] of residenceData){
 const block=new THREE.Group();block.position.set(x,0,z);scene.add(block);
 const towerBody=new THREE.Mesh(new THREE.BoxGeometry(22,height,19),mat(color));towerBody.position.y=height/2;towerBody.castShadow=true;block.add(towerBody);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(23,.8,20),mat(0x48565c));roof.position.y=height+.4;block.add(roof);
 const floors=Math.floor(height/3.5);
 for(let floor=0;floor<floors;floor++)for(let col=-2;col<=2;col++){
  const win=new THREE.Mesh(new THREE.BoxGeometry(2.1,1.45,.1),windowMat);win.position.set(col*3.7,2.3+floor*3.5,9.58);block.add(win);
  const sideWin=win.clone();sideWin.rotation.y=Math.PI/2;sideWin.position.set(11.08,2.3+floor*3.5,col*3.2);block.add(sideWin);
 }
 const entrance=new THREE.Mesh(new THREE.BoxGeometry(3,3,.2),mat(0x334a55));entrance.position.set(0,1.5,9.7);block.add(entrance);
 addArabicSign(block,name,address,18,1.7,0,Math.min(height-2,8),9.82);
 residentialBlocks.push({group:block,name,address});
}

const trafficSignals=[];
function trafficSignal(x,z,rotation=0){const pole=new THREE.Group();pole.position.set(x,0,z);pole.rotation.y=rotation;const post=new THREE.Mesh(new THREE.CylinderGeometry(.12,.17,5.5,8),lampMetal);post.position.y=2.75;pole.add(post);const arm=new THREE.Mesh(new THREE.BoxGeometry(.13,.13,2.3),lampMetal);arm.position.set(0,5.35,1);pole.add(arm);const housing=new THREE.Mesh(new THREE.BoxGeometry(.72,1.85,.48),mat(0x20272b));housing.position.set(0,4.45,2.05);pole.add(housing);const lenses=[],materials=[];for(let i=0;i<3;i++){const material=new THREE.MeshStandardMaterial({color:[0xe33b32,0xe7b83d,0x36bd68][i],emissive:[0x8b100b,0x79520b,0x087a31][i],emissiveIntensity:.08});const lens=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),material);lens.position.set(0,5.05-i*.6,2.31);pole.add(lens);lenses.push(lens);materials.push(material);}scene.add(pole);trafficSignals.push({lenses,materials,offset:trafficSignals.length%2?9:0});}
trafficSignal(-9,0,0);trafficSignal(9,0,Math.PI);trafficSignal(0,-9,Math.PI/2);trafficSignal(0,9,-Math.PI/2);

let dayClock=0,shopOpen=false,signalClock=0;

// First playable economy loop: wallet, stock, work shift and home rest.
const SAVE_KEY='wateen-city-save-v1';
let wallet=2500,foodStock=0,waterStock=0,workShift=0,restCount=0,fuelLevel=65;
try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(saved&&saved.version===1){wallet=Math.max(0,Number.isFinite(Number(saved.wallet))?Number(saved.wallet):2500);foodStock=Math.max(0,Number(saved.foodStock)||0);waterStock=Math.max(0,Number(saved.waterStock)||0);workShift=saved.workShift?1:0;restCount=Math.max(0,Number(saved.restCount)||0);fuelLevel=THREE.MathUtils.clamp(Number.isFinite(Number(saved.fuelLevel))?Number(saved.fuelLevel):65,0,100);}}catch(e){console.warn('تعذر تحميل الحفظ المحلي',e);}
function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,wallet,foodStock,waterStock,workShift,restCount,fuelLevel,savedAt:Date.now()}));}catch(e){console.warn('تعذر حفظ التقدم',e);}}
function refreshWallet(){const el=document.querySelector('#money');if(el)el.textContent=wallet.toLocaleString('ar-IQ');const inv=document.querySelector('#inventory');if(inv)inv.textContent='طعام '+foodStock+' · ماء '+waterStock;const fuel=document.querySelector('#fuelLevel');if(fuel)fuel.textContent=Math.round(fuelLevel)+'٪';saveProgress();}
const economyPanel=document.createElement('section');
economyPanel.id='economyPanel';
economyPanel.dir='rtl';
economyPanel.style.cssText='display:none;position:absolute;z-index:30;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,360px);padding:18px;background:#101d2af2;border:1px solid #e3b45f;border-radius:18px;box-shadow:0 16px 50px #0009;color:#fff;font:13px Tahoma;backdrop-filter:blur(12px);';
economyPanel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><strong id="economyTitle" style="color:#f0c879;font-size:17px">خدمات وتين</strong><button id="economyClose" style="background:#ffffff18;color:white;border:0;border-radius:9px;padding:7px 11px">إغلاق ✕</button></div><p id="economyInfo" style="line-height:1.8;color:#cbd4da">اختر خدمة من المدينة.</p><div id="economyActions" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"></div>';
document.querySelector('#app').appendChild(economyPanel);
document.querySelector('#economyClose').addEventListener('click',()=>economyPanel.style.display='none');
function showEconomy(title,info,actions){document.querySelector('#economyTitle').textContent=title;document.querySelector('#economyInfo').textContent=info;const host=document.querySelector('#economyActions');host.replaceChildren();for(const action of actions){const b=document.createElement('button');b.textContent=action.label;b.style.cssText='padding:12px 8px;border:1px solid #ffffff30;border-radius:10px;background:#263b49;color:#fff;font:12px Tahoma;';b.addEventListener('click',action.run);host.appendChild(b);}economyPanel.style.display='block';}
const workPoint=new THREE.Vector3(-19,0,5);

const homePoint=new THREE.Vector3(0,0,18);
function makeWorldMarker(position,color,label){
 const group=new THREE.Group();group.position.copy(position);scene.add(group);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05,.09,8,24),mat(color));ring.rotation.x=Math.PI/2;ring.position.y=.12;group.add(ring);
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,2.2,8),mat(color));beam.position.y=1.25;group.add(beam);
 const orb=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),mat(color));orb.position.y=2.45;group.add(orb);
 return group;
}
const workMarker=makeWorldMarker(workPoint,0x65c7a1,'عمل');
const homeMarker=makeWorldMarker(homePoint,0x7bb8e8,'منزل');

function startWork(){if(workShift){document.querySelector('#hint').textContent='أنت تعمل بالفعل، أكمل جولتك';return;}workShift=1;showEconomy('مكتب العمل','بدأت ورديتك. أكمل مهامك اليومية ثم عد لاستلام الراتب.',[{label:'إنهاء الوردية + 350',run:()=>{wallet+=350;workShift=0;refreshWallet();economyPanel.style.display='none';document.querySelector('#hint').textContent='استلمت راتبك: ٣٥٠ ديناراً تجريبياً';}}]);}
function openShop(){showEconomy('متجر وتين','رصيدك: '+wallet.toLocaleString('ar-IQ')+' دينار تجريبي. اختر احتياجاتك.',[{label:'شراء طعام - 50',run:()=>{if(wallet<50)return;wallet-=50;foodStock++;refreshWallet();document.querySelector('#economyInfo').textContent='تم شراء الطعام. الكمية: '+foodStock;}},{label:'شراء ماء - 20',run:()=>{if(wallet<20)return;wallet-=20;waterStock++;refreshWallet();document.querySelector('#economyInfo').textContent='تم شراء الماء. الكمية: '+waterStock;}},{label:'تناول الطعام',run:()=>{if(!foodStock)return;foodStock--;refreshWallet();const hp=document.querySelector('#health');if(hp)hp.textContent='١٠٠';document.querySelector('#economyInfo').textContent='تناولت الطعام واستعدت عافيتك.';}},{label:'شرب الماء',run:()=>{if(!waterStock)return;waterStock--;refreshWallet();document.querySelector('#economyInfo').textContent='شربت الماء. بالتوفيق في جولتك!';}}]);}
function restAtHome(){restCount++;saveProgress();const hp=document.querySelector('#health');if(hp)hp.textContent='١٠٠';showEconomy('المنزل','استرحت في منزلك وعادت صحتك بالكامل. عدد مرات الراحة: '+restCount,[{label:'متابعة اللعب',run:()=>economyPanel.style.display='none'}]);}
refreshWallet();
function interactWorld(){
 if(player.position.distanceTo(fuelStation.position)<20){showEconomy('محطة وقود وتين','مستوى الوقود: '+Math.round(fuelLevel)+'٪. عبّئ سيارتك قبل الانطلاق.',[{label:'تعبئة 25٪ - 100',run:()=>{if(wallet<100){document.querySelector('#economyInfo').textContent='رصيدك لا يكفي.';return;}if(fuelLevel>=100){document.querySelector('#economyInfo').textContent='الخزان ممتلئ بالفعل.';return;}wallet-=100;fuelLevel=Math.min(100,fuelLevel+25);refreshWallet();document.querySelector('#economyInfo').textContent='تمت التعبئة. الوقود الآن '+Math.round(fuelLevel)+'٪';}},{label:'تعبئة كاملة - 300',run:()=>{if(wallet<300){document.querySelector('#economyInfo').textContent='رصيدك لا يكفي.';return;}wallet-=300;fuelLevel=100;refreshWallet();document.querySelector('#economyInfo').textContent='الخزان ممتلئ. رحلة سعيدة!';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 const nearbyRetail=retailShops.find(item=>player.position.distanceTo(item.group.position)<16);if(nearbyRetail){showEconomy(nearbyRetail.name,'العنوان: '+nearbyRetail.address+'. هذا '+nearbyRetail.category+' من محلات وتين ستي.',[{label:'شراء غرض - 50',run:()=>{if(wallet<50){document.querySelector('#economyInfo').textContent='رصيدك لا يكفي.';return;}wallet-=50;refreshWallet();document.querySelector('#economyInfo').textContent='تم الشراء من '+nearbyRetail.name+'. شكراً لزيارتك.';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 const nearShop=player.position.distanceTo(shop.position)<13;
 if(nearShop){openShop();return;}
 if(player.position.distanceTo(restaurant.position)<14){showEconomy('مطعم وتين','أهلاً بك! اختر وجبتك من مطعم المدينة.',[{label:'وجبة ساخنة - 80',run:()=>{if(wallet<80){document.querySelector('#economyInfo').textContent='رصيدك لا يكفي.';return;}wallet-=80;foodStock++;refreshWallet();document.querySelector('#economyInfo').textContent='تم تجهيز وجبتك. صحة جيدة!';}},{label:'ماء بارد - 20',run:()=>{if(wallet<20){document.querySelector('#economyInfo').textContent='رصيدك لا يكفي.';return;}wallet-=20;waterStock++;refreshWallet();document.querySelector('#economyInfo').textContent='تم شراء الماء البارد.';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 if(player.position.distanceTo(airport.position)<42){showEconomy('مطار وتين الدولي','العنوان: طريق المطار - الضواحي الغربية. صالة سفر وبوابات مرقمة وحافلة ركاب ومنطقة أمتعة ولوحة رحلات.',[{label:airportBaggageJobDone?'مهمة الأمتعة مكتملة':'إنجاز مهمة توصيل الأمتعة +180',run:()=>{if(airportBaggageJobDone){document.querySelector('#economyInfo').textContent='أنجزت مهمة الأمتعة مسبقاً. ترقّب مهام المطار القادمة.';return;}airportBaggageJobDone=true;wallet+=180;refreshWallet();document.querySelector('#economyInfo').textContent='أحسنت! أوصلت الأمتعة إلى منطقة التحميل وحصلت على 180 من رصيدك.';}},{label:'استكشاف المطار',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='أهلاً بك في مطار وتين الدولي — تابع حافلة المسافرين ولوحة الرحلات';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 const nearbyCivic=civicPlaces.find(item=>player.position.distanceTo(item.group.position)<25);if(nearbyCivic){showEconomy(nearbyCivic.name,'العنوان: '+nearbyCivic.address+'. مرفق '+nearbyCivic.kind+' ضمن خدمات مدينة وتين.',[{label:'زيارة المرفق',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='وصلت إلى '+nearbyCivic.name+' — '+nearbyCivic.kind;}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 if(player.position.distanceTo(heliport.position)<28){showEconomy('مهبط وتين الجوي','العنوان: طريق الخدمات الشمالية. مهبط للطوارئ والنقل الجوي مع مروحية إنقاذ.',[{label:'تفقد المروحية',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='مروحية الإنقاذ جاهزة في مهبط وتين';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 const nearResidence=residentialBlocks.find(item=>player.position.distanceTo(item.group.position)<19);
 if(nearResidence){showEconomy(nearResidence.name,'العنوان: '+nearResidence.address+'. مبنى سكني متعدد الطوابق في مدينة وتين.',[{label:'دخول المبنى',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='وصلت إلى '+nearResidence.name+' — قريباً: شقق داخلية قابلة للاستكشاف';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 if(player.position.distanceTo(workPoint)<12){startWork();return;}
 if(player.position.distanceTo(homePoint)<18){showEconomy('قصر اللاعب الفاخر','أنت في منزلك الرئيسي. قصر فاخر مفروش مع غرفة نوم وصالة ومطبخ ومسبح وكراج. ستبدأ كل جلسة لعب من داخل هذا المنزل.',[{label:'الراحة والنوم',run:()=>{restAtHome();}},{label:'استكشاف القصر',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='مرحباً بك في قصرك الفاخر — الصالة وغرفة النوم والمسبح والكراج';}},{label:'إغلاق',run:()=>economyPanel.style.display='none'}]);return;}
 const nearVisitor=player.position.distanceTo(visitor.position)<5;
 if(nearVisitor){showEconomy('أحد سكان المدينة','مرحباً بك في وتين ستي! المدينة تكبر بوجودك.',[{label:'إلقاء التحية',run:()=>{economyPanel.style.display='none';document.querySelector('#hint').textContent='تبادلت التحية مع أحد السكان';}}]);return;}
 document.querySelector('#hint').textContent='اقترب من المتجر أو مكتب العمل أو منزلك للتفاعل';
}
const interactButton=document.querySelector('#interactBtn');
if(interactButton)interactButton.addEventListener('click',interactWorld);
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e')interactWorld()});

const clock=new THREE.Clock();const desired=new THREE.Vector3();let frame=0,walkPhase=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);dayClock=(dayClock+dt*.006)%(Math.PI*2);signalClock=(signalClock+dt)%18;for(const signal of trafficSignals){const phase=(signalClock+signal.offset)%18;const active=phase<7?2:phase<9?1:0;signal.materials.forEach((material,index)=>material.emissiveIntensity=index===active?2.2:.06);}const daylight=.48+.42*Math.sin(dayClock-Math.PI/2);sun.intensity=1.1+daylight*2.1;scene.background.setHSL(.55,.22,.18+daylight*.32);scene.fog.color.copy(scene.background);wheelRing.rotation.z+=dt*.22;carouselRoof.rotation.y+=dt*.65;carouselBase.rotation.y+=dt*.65;heliRotor.rotation.y+=dt*8;heliTailRotor.rotation.y+=dt*11;airportShuttleClock+=dt;airportShuttle.position.x=Math.sin(airportShuttleClock*.32)*18;airportShuttle.rotation.y=Math.cos(airportShuttleClock*.32)>=0?0:Math.PI;radarDish.rotation.y+=dt*.55;const airportPulse=.75+Math.sin(dayClock*8)*.55;airportLights.forEach((lamp,i)=>lamp.material=airportLampMat);airportLampMat.emissiveIntensity=airportPulse;heliBeacon.material.emissiveIntensity=.5+Math.abs(Math.sin(dayClock*12))*2;for(let i=0;i<citizens.length;i++){const c=citizens[i];c.phase+=dt*c.speed;const p=c.npc.position;if(c.route<2){p.z=c.origin.z+Math.sin(c.phase)*11;p.x=c.origin.x+Math.cos(c.phase*.5)*2;}else{p.x=c.origin.x+Math.sin(c.phase)*11;p.z=c.origin.z+Math.cos(c.phase*.5)*2;}c.npc.rotation.y=c.route<2?(Math.cos(c.phase)>=0?0:Math.PI):(Math.cos(c.phase)>=0?Math.PI/2:-Math.PI/2);c.legs.forEach((leg,n)=>leg.rotation.x=Math.sin(c.phase*4+n*Math.PI)*.55);c.arms.forEach((arm,n)=>arm.rotation.x=-Math.sin(c.phase*4+n*Math.PI)*.35);}for(const trafficItem of traffic){const q=trafficItem.vehicle;const along=(trafficItem.progress-.5)*540*trafficItem.direction;const phase=(signalClock+(trafficItem.axis==='z'?0:9))%18;const approaching=trafficItem.roadLine===0&&(trafficItem.direction>0?along>-18&&along<-5:along<18&&along>5);const waiting=approaching&&phase>=7;if(!waiting)trafficItem.progress=(trafficItem.progress+dt*trafficItem.speed/540)%1;const nextAlong=(trafficItem.progress-.5)*540*trafficItem.direction;if(trafficItem.axis==='z'){q.position.set(trafficItem.roadLine+trafficItem.lane,.02,waiting?along:nextAlong);q.rotation.y=trafficItem.direction>0?0:Math.PI;}else{q.position.set(waiting?along:nextAlong,.02,trafficItem.roadLine+trafficItem.lane);q.rotation.y=trafficItem.direction>0?Math.PI/2:-Math.PI/2;}}const coasterT=(dayClock*1.7)%(Math.PI*2);const coasterPoint=coasterPath.getPoint((coasterT/(Math.PI*2)));coasterCar.position.copy(coasterPoint);const forward=(keys.w||keys.arrowup?-1:0)+(keys.s||keys.arrowdown?1:0)-joy.y;const side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;const moving=Math.abs(forward)+Math.abs(side)>.08;const target=inCar?car:player;let vehicleStopped=false;if(moving&&!inCar)walkPhase+=dt*(run?12:7);const speed=inCar?22:(run?10:5.2);if(moving&&inCar&&fuelLevel>0)fuelLevel=Math.max(0,fuelLevel-dt*.16);const fuelHud=document.querySelector('#fuelLevel');if(fuelHud)fuelHud.textContent=Math.round(fuelLevel)+'٪';if(inCar&&fuelLevel<=0){document.querySelector('#hint').textContent='نفد الوقود! توجه إلى محطة الوقود سيراً.';inCar=false;vehicleStopped=true;player.position.copy(car.position).add(new THREE.Vector3(2,0,0));}if(moving&&!vehicleStopped){const angle=Math.atan2(side,-forward);target.rotation.y=angle+yaw;const dir=new THREE.Vector3(Math.sin(target.rotation.y),0,Math.cos(target.rotation.y));target.position.addScaledVector(dir,speed*dt*Math.min(1,Math.hypot(forward,side)));target.position.x=THREE.MathUtils.clamp(target.position.x,-285,285);target.position.z=THREE.MathUtils.clamp(target.position.z,-285,285)}if(inCar){player.position.copy(car.position);player.visible=false}else player.visible=true;const gait=moving&&!inCar?1:0;legPivots.forEach((p,i)=>{p.rotation.x=Math.sin(walkPhase+i*Math.PI)*.62*gait;p.rotation.z=0});armPivots.forEach((p,i)=>{p.rotation.x=-Math.sin(walkPhase+i*Math.PI)*.48*gait;p.rotation.z=(i===0?-.08:.08)});
const focus=inCar?car:player;desired.set(focus.position.x+Math.sin(focus.rotation.y)*-10,focus.position.y+7,focus.position.z+Math.cos(focus.rotation.y)*-10);camera.position.lerp(desired,1-Math.exp(-4*dt));camera.lookAt(focus.position.x,focus.position.y+1.5,focus.position.z);
frame+=dt;if(frame>5){frame=0;const d=Math.hypot(player.position.x,player.position.z);document.querySelector('#location').textContent=d<100?'وسط وتين':player.position.z<-180?'واجهة الميناء':'الأحياء الجديدة'}
renderer.render(scene,camera)}
window.__WATEEN_GAME_READY=true;camera.position.set(0,8,32);camera.lookAt(0,1,18);document.querySelector('#loading').style.opacity='0';setTimeout(()=>document.querySelector('#loading').remove(),550);animate();
function resizeGame(){const w=Math.max(1,document.documentElement.clientWidth),h=Math.max(1,document.documentElement.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))}
addEventListener('resize',resizeGame,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(resizeGame,180),{passive:true});
} catch (error) { drawCompatibilityCity(error); }
