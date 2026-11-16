import * as THREE from 'three';

const mount=document.querySelector('#game');
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
// Decorative waterfront and marina edge
const water=new THREE.Mesh(new THREE.PlaneGeometry(600,75),new THREE.MeshStandardMaterial({color:0x3c91a5,roughness:.25,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.set(0,-.04,-270);scene.add(water);
const player=new THREE.Group();scene.add(player);
const skin=mat(0xb98260),shirt=mat(0x263d50),pants=mat(0x20252b),shoe=mat(0x17191b);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.8,4,8),shirt);torso.position.y=1.48;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),skin);head.position.y=2.35;head.castShadow=true;player.add(head);
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