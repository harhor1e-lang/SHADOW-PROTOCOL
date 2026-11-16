import './style.css';
import * as THREE from 'three';

function drawCompatibilityCity(error) {
  const host=document.querySelector('#game');
  if(!host) return;
  host.innerHTML='';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='display:block;width:100%;height:100%;';
  host.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx) { host.innerHTML='<div style="color:white;padding:30px">تعذّر تشغيل الرسوم على هذا المتصفح.</div>'; return; }
  function paint(){
    const w=canvas.width= Math.max(1,Math.floor(host.clientWidth*devicePixelRatio));
    const h=canvas.height= Math.max(1,Math.floor(host.clientHeight*devicePixelRatio));
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const W=host.clientWidth,H=host.clientHeight;
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#83b7d0');sky.addColorStop(.62,'#d6c8a2');sky.addColorStop(1,'#71875d');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    const horizon=H*.57;ctx.fillStyle='#758b60';ctx.fillRect(0,horizon,W,H-horizon);
    // Perspective road grid
    ctx.fillStyle='#343d43';ctx.beginPath();ctx.moveTo(W*.43,horizon);ctx.lineTo(W*.57,horizon);ctx.lineTo(W*1.12,H);ctx.lineTo(-W*.12,H);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#e5d7a8';ctx.lineWidth=3;ctx.setLineDash([18,20]);ctx.beginPath();ctx.moveTo(W*.5,horizon+5);ctx.lineTo(W*.5,H);ctx.stroke();ctx.setLineDash([]);
    // Skyline and near buildings
    const blocks=[];for(let i=0;i<15;i++){const x=(i/15)*W-W*.02;const depth=i%3;const bw=W*(.045+depth*.012);const bh=H*(.13+((i*37)%17)/100);blocks.push({x,y:horizon-bh,w:bw,h:bh,c:['#bda98d','#9daeb1','#d4c8b4','#8e9c9e'][i%4]});}
    blocks.sort((a,b)=>a.y-b.y);
    for(const b of blocks){ctx.fillStyle=b.c;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='rgba(25,55,70,.75)';for(let yy=b.y+10;yy<b.y+b.h-5;yy+=17)for(let xx=b.x+6;xx<b.x+b.w-4;xx+=12)ctx.fillRect(xx,yy,6,9);ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(b.x+b.w-5,b.y,5,b.h);}
    // Roadside foreground houses
    for(let side=0;side<2;side++)for(let i=0;i<4;i++){const x=side?W*.68+i*W*.11:W*.2-i*W*.11;const y=horizon+H*(.04+i*.045);const bw=W*(.11+i*.018),bh=H*(.13+i*.035);ctx.fillStyle='#75665a';ctx.fillRect(x,y-bh,bw,bh);ctx.fillStyle='#c5b69c';ctx.beginPath();ctx.moveTo(x-5,y-bh);ctx.lineTo(x+bw/2,y-bh-H*.045);ctx.lineTo(x+bw+5,y-bh);ctx.closePath();ctx.fill();ctx.fillStyle='#395b69';for(let wx=x+10;wx<x+bw-8;wx+=22)ctx.fillRect(wx,y-bh+14,10,16);}
    // Player and car silhouettes
    ctx.fillStyle='#263d50';ctx.fillRect(W*.47,H*.68, W*.055,H*.11);ctx.fillStyle='#b98260';ctx.beginPath();ctx.arc(W*.497,H*.665,Math.max(6,W*.012),0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#a33d32';ctx.fillRect(W*.68,H*.78,W*.16,H*.07);ctx.fillStyle='#365568';ctx.fillRect(W*.71,H*.745,W*.09,H*.045);ctx.fillStyle='#15191c';ctx.beginPath();ctx.arc(W*.71,H*.85,7,0,Math.PI*2);ctx.arc(W*.81,H*.85,7,0,Math.PI*2);ctx.fill();
  }
  paint();addEventListener('resize',paint,{passive:true});
  const msg=document.createElement('div');msg.textContent='وضع التوافق: تم تشغيل عرض المدينة البديل';msg.style.cssText='position:absolute;bottom:12px;right:12px;background:#101820d9;color:#fff;padding:8px 12px;border-radius:10px;font:12px Tahoma;';host.appendChild(msg);
  console.error('Wateen City WebGL fallback:',error);
}

try {

const mount=document.querySelector('#game');
const introButton=document.querySelector('#startGameBtn');
if(introButton) introButton.addEventListener('click',()=>document.querySelector('#introScreen')?.classList.add('closed'));

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
function road(x,z,w,d){const r=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),roadMat);r.position.set(x,.06,z);r.receiveShadow=true;scene.add(r);const horizontal=w>d;for(let p=-Math.max(w,d)/2+4;p<Math.max(w,d)/2;p+=9){const l=new THREE.Mesh(new THREE.BoxGeometry(horizontal?3:.12,.025,horizontal?.13:3),lineMat);l.position.set(x+(horizontal?p:0),.13,z+(horizontal?0:p));scene.add(l)}}
for(let i=-2;i<=2;i++){road(0,i*70,600,13);road(i*70,0,13,600)}
const buildingMaterials=[0xc7b49a,0x9eaeb4,0xd4d0c4,0xb4a18e,0x87999a,0xe0c79e].map(c=>mat(c));
const windowMat=new THREE.MeshStandardMaterial({color:0x365568,metalness:.25,roughness:.28});
const city=new THREE.Group();scene.add(city);
function building(x,z,w,d,h,index){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMaterials[index%buildingMaterials.length]);body.position.y=h/2;body.castShadow=true;body.receiveShadow=true;g.add(body);const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.92,.5,d*.92),mat(0x555b5a));roof.position.y=h+.25;g.add(roof);const floors=Math.max(2,Math.floor(h/3.2));for(let f=0;f<floors;f++){for(let s=-1;s<=1;s++){const win=new THREE.Mesh(new THREE.BoxGeometry(.85,1.15,.08),windowMat);win.position.set(s*w*.27,2+f*3.1,d/2+.045);g.add(win);const win2=win.clone();win2.position.z=-d/2-.045;g.add(win2)}}g.position.set(x,0,z);city.add(g)}
let seed=7841;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++){if(Math.abs(x)%1===0&&Math.abs(z)%1===0){const cx=x*70+(rand()-.5)*24,cz=z*70+(rand()-.5)*24;if(Math.abs(cx)<28||Math.abs(cz)<28)continue;const w=18+rand()*17,d=18+rand()*17,h=10+rand()*43;building(cx,cz,w,d,h,Math.floor(rand()*buildingMaterials.length))}}
function tree(x,z){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.38,3,7),mat(0x72513a));trunk.position.set(x,1.5,z);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(2.2,7,6),mat(0x426c43));crown.position.set(x,4,z);crown.castShadow=true;scene.add(crown)}
for(let i=0;i<180;i++){const x=(rand()-.5)*560,z=(rand()-.5)*560;if(Math.abs(x%70)<11||Math.abs(z%70)<11)continue;tree(x,z)}

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

for(const x of [-.23,.23]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.27,.8,.3),pants);leg.position.set(x,.55,0);player.add(leg);const foot=new THREE.Mesh(new THREE.BoxGeometry(.3,.18,.48),shoe);foot.position.set(x,.14,.08);player.add(foot)}
for(const x of [-.58,.58]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.62,3,7),skin);arm.position.set(x,1.52,0);arm.rotation.z=x*.35;player.add(arm)}
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
const clock=new THREE.Clock();const desired=new THREE.Vector3();let frame=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);const forward=(keys.w||keys.arrowup?-1:0)+(keys.s||keys.arrowdown?1:0)-joy.y;const side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;const moving=Math.abs(forward)+Math.abs(side)>.08;const target=inCar?car:player;const speed=inCar?22:(run?10:5.2);if(moving){const angle=Math.atan2(side,-forward);target.rotation.y=angle+yaw;const dir=new THREE.Vector3(Math.sin(target.rotation.y),0,Math.cos(target.rotation.y));target.position.addScaledVector(dir,speed*dt*Math.min(1,Math.hypot(forward,side)));target.position.x=THREE.MathUtils.clamp(target.position.x,-285,285);target.position.z=THREE.MathUtils.clamp(target.position.z,-285,285)}if(inCar){player.position.copy(car.position);player.visible=false}else player.visible=true;
const focus=inCar?car:player;desired.set(focus.position.x+Math.sin(focus.rotation.y)*-10,focus.position.y+7,focus.position.z+Math.cos(focus.rotation.y)*-10);camera.position.lerp(desired,1-Math.exp(-4*dt));camera.lookAt(focus.position.x,focus.position.y+1.5,focus.position.z);
frame+=dt;if(frame>5){frame=0;const d=Math.hypot(player.position.x,player.position.z);document.querySelector('#location').textContent=d<100?'وسط وتين':player.position.z<-180?'واجهة الميناء':'الأحياء الجديدة'}
renderer.render(scene,camera)}
camera.position.set(0,8,32);camera.lookAt(0,1,18);document.querySelector('#loading').style.opacity='0';setTimeout(()=>document.querySelector('#loading').remove(),550);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
} catch (error) { drawCompatibilityCity(error); }
