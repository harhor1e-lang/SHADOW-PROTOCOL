let THREE;
try {
 THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
} catch (firstError) {
 try {
  THREE = await import('https://unpkg.com/three@0.180.0/build/three.module.js');
 } catch (secondError) {
  const loading = document.getElementById('loading');
  if (loading) {
   loading.classList.remove('hidden');
   loading.innerHTML = '<b style="font-size:22px;color:#d7b979">بروتوكول الظلال</b><span>تعذر تحميل محرك الرسوم</span><small>تحقق من اتصال الإنترنت ثم أعد فتح اللعبة.</small>';
  }
  throw secondError;
 }
}
const $=s=>document.querySelector(s), app=$('#app'), canvas=$('#world-canvas');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bb6b0);scene.fog=new THREE.FogExp2(0x9bb6b0,.009);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,2600);camera.position.set(24,19,28);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
scene.add(new THREE.HemisphereLight(0xdce9e7,0x394633,1.8));
const sun=new THREE.DirectionalLight(0xffdfad,2.6);sun.position.set(-45,65,28);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);
const mat=(c,r=.9,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
function detailedFace(parent,skinColor,hairColor,eyeColor=0x65432f,beard=false){
 const group=new THREE.Group();parent.add(group);
 const skin=mat(skinColor,.86),hair=mat(hairColor,.9),white=mat(0xf4eee2,.32),iris=mat(eyeColor,.28),pupil=mat(0x17130f,.2),lip=mat(0x945e55,.75),shadow=mat(0x754c3d,.95);
 const skull=new THREE.Mesh(new THREE.SphereGeometry(.255,32,28),skin);skull.scale.set(.91,1.08,.91);group.add(skull);
 const jaw=new THREE.Mesh(new THREE.SphereGeometry(.19,24,18),skin);jaw.scale.set(.92,.72,.82);jaw.position.set(0,-.135,.065);group.add(jaw);
 for(const side of [-1,1]){
  const ear=new THREE.Mesh(new THREE.SphereGeometry(.061,16,12),skin);ear.scale.set(.72,1,.55);ear.position.set(side*.235,-.015,0);group.add(ear);
  const inner=new THREE.Mesh(new THREE.SphereGeometry(.028,12,8),shadow);inner.scale.set(.7,1,.35);inner.position.set(side*.25,-.018,.035);group.add(inner);
  const cheek=new THREE.Mesh(new THREE.SphereGeometry(.078,18,12),skin);cheek.scale.set(1,.72,.52);cheek.position.set(side*.125,-.075,.183);group.add(cheek);
  const socket=new THREE.Mesh(new THREE.SphereGeometry(.062,18,12),shadow);socket.scale.set(1,.66,.24);socket.position.set(side*.091,.018,.222);group.add(socket);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.047,18,14),white);eye.scale.set(1,.76,.52);eye.position.set(side*.091,.018,.238);group.add(eye);
  const irisMesh=new THREE.Mesh(new THREE.SphereGeometry(.026,16,12),iris);irisMesh.position.set(side*.091,.018,.259);group.add(irisMesh);
  const pupilMesh=new THREE.Mesh(new THREE.SphereGeometry(.014,12,10),pupil);pupilMesh.position.set(side*.091,.018,.272);group.add(pupilMesh);
  const glint=new THREE.Mesh(new THREE.SphereGeometry(.006,8,6),white);glint.position.set(side*.083,.028,.283);group.add(glint);
  const brow=new THREE.Mesh(new THREE.CapsuleGeometry(.014,.085,3,8),hair);brow.position.set(side*.091,.087,.235);brow.rotation.z=side*-.12;group.add(brow);
  const sideburn=new THREE.Mesh(new THREE.SphereGeometry(.045,12,10),hair);sideburn.scale.set(.8,1.8,.65);sideburn.position.set(side*.205,-.09,.11);group.add(sideburn);
 }
 const bridge=new THREE.Mesh(new THREE.SphereGeometry(.043,16,12),skin);bridge.scale.set(.68,1.8,.8);bridge.position.set(0,-.035,.244);group.add(bridge);
 const tip=new THREE.Mesh(new THREE.SphereGeometry(.047,16,12),skin);tip.scale.set(1,.72,.9);tip.position.set(0,-.105,.27);group.add(tip);
 for(const side of [-1,1]){const nostril=new THREE.Mesh(new THREE.SphereGeometry(.012,10,8),shadow);nostril.scale.set(1,.6,.4);nostril.position.set(side*.026,-.126,.293);group.add(nostril)}
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.045,16,10),lip);upper.scale.set(1,.28,.42);upper.position.set(0,-.177,.238);group.add(upper);
 const lower=new THREE.Mesh(new THREE.SphereGeometry(.04,16,10),lip);lower.scale.set(.9,.24,.4);lower.position.set(0,-.199,.24);group.add(lower);
 const chin=new THREE.Mesh(new THREE.SphereGeometry(.073,16,12),skin);chin.scale.set(.9,.58,.5);chin.position.set(0,-.235,.17);group.add(chin);
 const cap=new THREE.Mesh(new THREE.SphereGeometry(.258,24,16,0,Math.PI*2,0,Math.PI*.43),hair);cap.position.set(0,.075,-.012);group.add(cap);
 const fringe=new THREE.Mesh(new THREE.SphereGeometry(.12,16,10,0,Math.PI,0,Math.PI*.5),hair);fringe.scale.set(1.3,.55,.65);fringe.position.set(0,.115,.17);group.add(fringe);
 if(beard){const beardMesh=new THREE.Mesh(new THREE.SphereGeometry(.17,20,14,0,Math.PI*2,Math.PI*.38,Math.PI*.58),hair);beardMesh.scale.set(1,.85,.8);beardMesh.position.set(0,-.18,.08);group.add(beardMesh)}
 group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 return group;
}

const terrainMat=mat(0x65784b),groundGeo=new THREE.PlaneGeometry(1600,1600,320,320);groundGeo.rotateX(-Math.PI/2);const p=groundGeo.attributes.position;
function height(x,z){return Math.sin(x*.045)*2.2+Math.cos(z*.052)*1.8+Math.sin((x+z)*.026)*2.4+Math.cos((x-z)*.018)*1.2}
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,height(x,z))}groundGeo.computeVertexNormals();const ground=new THREE.Mesh(groundGeo,terrainMat);ground.receiveShadow=true;scene.add(ground);
const riverMat=new THREE.MeshStandardMaterial({color:0x367b88,roughness:.16,metalness:.18,transparent:true,opacity:.91});
const riverGeo=new THREE.BufferGeometry(),riverSegments=520,riverAcross=10,riverPositions=[],riverIndices=[];
for(let iz=0;iz<=riverSegments;iz++){const z=-800+iz*(1600/riverSegments),center=-55+Math.sin(z*.006)*26;for(let ix=0;ix<=riverAcross;ix++){const u=ix/riverAcross,x=center+(u-.5)*18;riverPositions.push(x,height(x,z)+.22,z);if(iz<riverSegments&&ix<riverAcross){const a=iz*(riverAcross+1)+ix,b=a+riverAcross+1;riverIndices.push(a,b,a+1,b,b+1,a+1)}}}
riverGeo.setAttribute('position',new THREE.Float32BufferAttribute(riverPositions,3));riverGeo.setIndex(riverIndices);riverGeo.computeVertexNormals();const river=new THREE.Mesh(riverGeo,riverMat);river.receiveShadow=true;scene.add(river);const riverBaseY=riverGeo.attributes.position.array.filter((v,i)=>i%3===1);
function addTree(x,z,s=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.28,2.4,7),mat(0x59402b));trunk.position.y=1.2;trunk.castShadow=true;g.add(trunk);for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(1.25-j*.16,3.2,7),mat(j===0?0x294b34:0x355d3c));crown.position.y=2.6+j*.65;crown.castShadow=true;g.add(crown)}g.position.set(x,height(x,z),z);g.scale.setScalar(s);scene.add(g)}
// نظام تصادم مكاني يمنع عبور الأجسام الصلبة.
const collisionCell=12,collisionGrid=new Map();
function colliderKey(x,z){return Math.floor(x/collisionCell)+','+Math.floor(z/collisionCell)}
function addCollider(x,z,hx,hz,r=.5){
 const c={x,z,hx,hz,r};const minX=Math.floor((x-hx-r)/collisionCell),maxX=Math.floor((x+hx+r)/collisionCell),minZ=Math.floor((z-hz-r)/collisionCell),maxZ=Math.floor((z+hz+r)/collisionCell);
 for(let gx=minX;gx<=maxX;gx++)for(let gz=minZ;gz<=maxZ;gz++){const k=gx+','+gz;if(!collisionGrid.has(k))collisionGrid.set(k,[]);collisionGrid.get(k).push(c)}
 return c;
}
function blockedPosition(x,z,r=.48){
 const gx=Math.floor(x/collisionCell),gz=Math.floor(z/collisionCell),seen=new Set();
 for(let ix=gx-1;ix<=gx+1;ix++)for(let iz=gz-1;iz<=gz+1;iz++){
  const list=collisionGrid.get(ix+','+iz)||[];
  for(const c of list){if(seen.has(c))continue;seen.add(c);
   const qx=THREE.MathUtils.clamp(x,c.x-c.hx,c.x+c.hx),qz=THREE.MathUtils.clamp(z,c.z-c.hz,c.z+c.hz);
   if((x-qx)*(x-qx)+(z-qz)*(z-qz)<(r+c.r)*(r+c.r))return true;
  }
 }
 return false;
}
function moveWithCollision(obj,dx,dz,r=.48){
 let x=obj.position.x,z=obj.position.z;
 if(!blockedPosition(x+dx,z,r))x+=dx;
 if(!blockedPosition(x,z+dz,r))z+=dz;
 obj.position.x=x;obj.position.z=z;
 return {x,z,moved:Math.abs(x-obj.position.x)+Math.abs(z-obj.position.z)>0};
}
function house(x,z,s=1){
 const g=new THREE.Group(),wallMat=mat(0xb69a6d),roofMat=mat(0x49382b),doorMat=mat(0x3d2a20),windowMat=mat(0x8bb1ad,.3);
 const addWall=(w,h,d,px,py,pz)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wallMat);m.position.set(px,py,pz);m.castShadow=true;m.receiveShadow=true;g.add(m)};
 // بيت أكبر بجدران حقيقية وأبواب ونوافذ، مع فتحة مدخل واضحة.
 addWall(7.2,3.5,.28,0,1.75,-3);addWall(.28,3.5,6, -3.6,1.75,0);addWall(.28,3.5,6,3.6,1.75,0);
 addWall(2.55,3.5,.28,-2.325,1.75,3);addWall(2.55,3.5,.28,2.325,1.75,3);
 const lintel=new THREE.Mesh(new THREE.BoxGeometry(2.1,.45,.3),wallMat);lintel.position.set(0,3.28,3);g.add(lintel);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(5.25,2.9,4),roofMat);roof.position.y=4.65;roof.rotation.y=Math.PI/4;roof.scale.z=.84;roof.castShadow=true;g.add(roof);
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.75,2.5,.16),doorMat);door.position.set(0,1.25,3.05);g.add(door);
 for(const side of [-1,1]){const win=new THREE.Mesh(new THREE.BoxGeometry(.78,.82,.09),windowMat);win.position.set(side*2.25,2,3.17);g.add(win);const cross=new THREE.Mesh(new THREE.BoxGeometry(.08,.9,.1),doorMat);cross.position.copy(win.position);g.add(cross)}
 const porch=new THREE.Mesh(new THREE.BoxGeometry(2.8,.18,1.1),mat(0x80603d));porch.position.set(0,.12,3.5);g.add(porch);
 g.position.set(x,height(x,z),z);g.scale.setScalar(s);scene.add(g);
 const t=3.6*s,d=3*s,r=.46;
 addCollider(x,z-3*s,3.6*s,.14*s,r);addCollider(x-3.6*s,z,.14*s,3*s,r);addCollider(x+3.6*s,z,.14*s,3*s,r);
 addCollider(x-2.325*s,z+3*s,1.275*s,.14*s,r);addCollider(x+2.325*s,z+3*s,1.275*s,.14*s,r);
 return g
}
function rock(x,z,s){const o=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),mat(0x77786b));o.position.set(x,height(x,z)+s*.4,z);o.scale.set(s*1.2,s*.7,s);o.rotation.set(Math.random(),Math.random(),Math.random());o.castShadow=true;scene.add(o);addCollider(x,z,s*1.15,s*.95,.28)}
// distant mountain wall
for(let i=0;i<64;i++){const a=i/64*Math.PI*2,r=735+Math.random()*80,x=Math.cos(a)*r,z=Math.sin(a)*r;const m=new THREE.Mesh(new THREE.ConeGeometry(9+Math.random()*10,18+Math.random()*24,5),mat(0x53645a));m.position.set(x,8+height(x,z),z);m.rotation.y=Math.random()*6;m.castShadow=true;scene.add(m)}
const treeCount=1250,treeDummy=new THREE.Object3D(),treeTrunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.16,.28,2.4,7),mat(0x59402b),treeCount),treeCrownA=new THREE.InstancedMesh(new THREE.ConeGeometry(1.25,3.2,7),mat(0x294b34),treeCount),treeCrownB=new THREE.InstancedMesh(new THREE.ConeGeometry(1.09,3.2,7),mat(0x355d3c),treeCount),treeCrownC=new THREE.InstancedMesh(new THREE.ConeGeometry(.93,3.2,7),mat(0x355d3c),treeCount);
for(const batch of [treeTrunk,treeCrownA,treeCrownB,treeCrownC]){batch.castShadow=true;batch.receiveShadow=true;scene.add(batch)}
let placedTrees=0;
for(let i=0;i<treeCount;i++){const a=Math.random()*Math.PI*2,r=35+Math.random()*690,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x+55)<16)continue;const scale=.55+Math.random()*.8,y=height(x,z);
 treeDummy.position.set(x,y+1.2*scale,z);treeDummy.scale.setScalar(scale);addCollider(x,z,.42*scale,.42*scale,.28);treeDummy.updateMatrix();treeTrunk.setMatrixAt(placedTrees,treeDummy.matrix);
 for(const [batch,offset] of [[treeCrownA,2.6],[treeCrownB,3.25],[treeCrownC,3.9]]){treeDummy.position.set(x,y+offset*scale,z);treeDummy.updateMatrix();batch.setMatrixAt(placedTrees,treeDummy.matrix)}
 placedTrees++;
}
for(const batch of [treeTrunk,treeCrownA,treeCrownB,treeCrownC]){batch.count=placedTrees;batch.instanceMatrix.needsUpdate=true}
for(let i=0;i<320;i++){const x=(Math.random()-.5)*1400,z=(Math.random()-.5)*1400;if(Math.abs(x+55)>18)rock(x,z,.4+Math.random()*1.5)}
house(5,2,1);house(14,-7,.78);house(2,-11,.72);house(21,4,.62);

function leanTo(x,z,scale=1){
 const g=new THREE.Group(),wood=mat(0x65452b),thatch=mat(0x9a8151),dark=mat(0x33271c);
 for(const [px,pz] of [[-1.5,-1],[1.5,-1],[-1.5,1.2],[1.5,1.2]]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,2.5,7),wood);post.position.set(px,1.25,pz);g.add(post);addCollider(x+px*scale,z+pz*scale,.16*scale,.16*scale,.12)}
 const roof=new THREE.Mesh(new THREE.BoxGeometry(3.5,.2,3.1),thatch);roof.position.set(0,2.35,.1);roof.rotation.x=-.22;g.add(roof);
 const back=new THREE.Mesh(new THREE.BoxGeometry(3.1,1.7,.13),dark);back.position.set(0,.95,-1.05);g.add(back);
 const bed=new THREE.Mesh(new THREE.BoxGeometry(1.3,.25,1.7),mat(0x80603b));bed.position.set(0,.3,.1);g.add(bed);
 g.position.set(x,height(x,z),z);g.scale.setScalar(scale);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(g);return g;
}
function watchTower(x,z){
 const g=new THREE.Group(),wood=mat(0x5b4028),roof=mat(0x493526);
 for(const px of [-1,1])for(const pz of [-1,1]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.13,.18,7,7),wood);post.position.set(px,3.5,pz);g.add(post);addCollider(x+px,z+pz,.2,.2,.18)}
 const deck=new THREE.Mesh(new THREE.BoxGeometry(3.2,.3,3.2),wood);deck.position.y=5.1;g.add(deck);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(2.4,1.5,4),roof);cap.position.y=7;cap.rotation.y=Math.PI/4;g.add(cap);
 g.position.set(x,height(x,z),z);g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);
}
function farmstead(cx,cz){
 for(let row=0;row<4;row++)for(let col=0;col<6;col++){const x=cx+col*3.2,z=cz+row*2.8;const soil=new THREE.Mesh(new THREE.BoxGeometry(2.7,.12,2.2),mat(0x59472d));soil.position.set(x,height(x,z)+.07,z);scene.add(soil);for(let k=0;k<3;k++){const crop=new THREE.Mesh(new THREE.ConeGeometry(.16,.7,5),mat(0x6f8b42));crop.position.set(x-.7+k*.7,height(x,z)+.45,z);scene.add(crop)}}
}
function createRegionSettlements(){
 const sites=[[-360,-260],[350,-330],[-420,360],[390,390]];
 for(const [cx,cz] of sites){for(let j=0;j<5;j++)house(cx+(j%3)*8,cz+Math.floor(j/3)*9,.72+Math.random()*.18);leanTo(cx+20,cz+7,.9);leanTo(cx-13,cz+13,.8);watchTower(cx+16,cz-12)}
 farmstead(-455,390);
 for(let i=0;i<8;i++){const x=-410+i*5,z=365;const fence=new THREE.Mesh(new THREE.BoxGeometry(.12,1,28),mat(0x6a4b2e));fence.position.set(x,height(x,z)+.5,z+8);scene.add(fence);addCollider(x,z+8,.12,14,.1)}
 for(let i=0;i<12;i++){const x=390+(i%4)*7,z=390+Math.floor(i/4)*8;const pillar=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.5+(i%3),1.1),mat(0x777365));pillar.position.set(x,height(x,z)+1.2,z);pillar.rotation.z=(i%2)*.12;scene.add(pillar);addCollider(x,z,.65,.65,.15)}
}
createRegionSettlements();

const path=new THREE.Mesh(new THREE.PlaneGeometry(5,52),mat(0x988363));path.rotation.x=-Math.PI/2;path.position.set(10,2.25,-15);scene.add(path);
// watchfire, wood stack and lantern
const fire=new THREE.Group();fire.position.set(1,height(1,16)+.2,16);scene.add(fire);
const stones=new THREE.Mesh(new THREE.TorusGeometry(1.05,.22,7,12),mat(0x77766a));stones.rotation.x=Math.PI/2;fire.add(stones);
const flameMat=new THREE.MeshBasicMaterial({color:0xff8b35});const flame=new THREE.Mesh(new THREE.ConeGeometry(.48,1.7,7),flameMat);flame.position.y=.85;fire.add(flame);
const glow=new THREE.PointLight(0xff8b43,2.5,18);glow.position.y=2;fire.add(glow);
const player=new THREE.Group();
const robeMat=mat(0x4c5144),leatherMat=mat(0x493326),skinMat=mat(0xc99b75),clothMat=mat(0x252c28),metalMat=mat(0x8b7955,.42,.55);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.39,.78,5,10),robeMat);torso.position.y=1.05;torso.castShadow=true;player.add(torso);
const chest=new THREE.Mesh(new THREE.BoxGeometry(.68,.48,.43),mat(0x5c4934));chest.position.set(0,1.24,.02);chest.castShadow=true;player.add(chest);
const headGroup=new THREE.Group();headGroup.position.y=1.82;player.add(headGroup);
detailedFace(headGroup,0xc99b75,0x30251e,0x75533b,false);
const hoodBack=new THREE.Mesh(new THREE.SphereGeometry(.315,24,18,0,Math.PI*2,0,Math.PI*.66),clothMat);hoodBack.position.set(0,.025,-.105);hoodBack.scale.set(1.08,1.06,.82);headGroup.add(hoodBack);
const hoodRim=new THREE.Mesh(new THREE.TorusGeometry(.255,.027,8,24),mat(0x806a48));hoodRim.position.set(0,-.005,-.005);hoodRim.rotation.x=Math.PI/2;headGroup.add(hoodRim);
const scarf=new THREE.Mesh(new THREE.BoxGeometry(.48,.13,.46),mat(0x9b7745));scarf.position.y=1.56;player.add(scarf);
const armPivots=[],legPivots=[];
for(const side of [-1,1]){
 const arm=new THREE.Group();arm.position.set(side*.48,1.42,0);player.add(arm);const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.48,4,8),robeMat);sleeve.rotation.z=side*.12;sleeve.position.y=-.28;sleeve.castShadow=true;arm.add(sleeve);const hand=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),skinMat);hand.position.y=-.58;arm.add(hand);armPivots.push(arm);
 const leg=new THREE.Group();leg.position.set(side*.2,.55,0);player.add(leg);const trouser=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.45,4,8),leatherMat);trouser.position.y=-.25;trouser.castShadow=true;leg.add(trouser);const boot=new THREE.Mesh(new THREE.BoxGeometry(.25,.16,.38),mat(0x241c16));boot.position.set(0,-.53,.08);leg.add(boot);legPivots.push(leg);
}
const belt=new THREE.Mesh(new THREE.TorusGeometry(.31,.055,6,16),metalMat);belt.rotation.x=Math.PI/2;belt.position.y=.83;player.add(belt);
const pack=new THREE.Mesh(new THREE.BoxGeometry(.42,.52,.24),mat(0x6b482b));pack.position.set(0,1.15,-.31);pack.castShadow=true;player.add(pack);
// تفاصيل الشخصية: عباءة، حواف جلدية، مشابك، ملامح وجه ومعدات سفر
const cloak=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.78,5,10),mat(0x303a32));cloak.position.set(0,.98,-.22);cloak.scale.set(1,.95,.42);cloak.castShadow=true;player.add(cloak);
const buckle=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,.055),metalMat);buckle.position.set(0,.84,.34);player.add(buckle);
for(const side of [-1,1]){
 const shoulder=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),leatherMat);shoulder.scale.set(1,.65,1);shoulder.position.set(side*.46,1.43,0);player.add(shoulder);
 const glove=new THREE.Mesh(new THREE.SphereGeometry(.125,8,7),leatherMat);glove.position.set(side*.48,.83,0);player.add(glove);
 const pouch=new THREE.Mesh(new THREE.BoxGeometry(.2,.23,.16),leatherMat);pouch.position.set(side*.27,.91,.22);player.add(pouch);
}
const hoodRim=new THREE.Mesh(new THREE.TorusGeometry(.255,.035,6,16),mat(0x806a48));hoodRim.position.set(0,1.79,.02);hoodRim.rotation.x=Math.PI/2;headGroup.add(hoodRim);

player.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
player.position.set(7,height(7,8),8);scene.add(player);
let walkingBlend=0,jumpVelocity=0,baseGround=height(7,8);
let yaw=.65,pitch=.35,distance=19,drag=false,last={x:0,y:0},entered=false,day=0,clockMinutes=480,elapsed=0;const cameraGoal=new THREE.Vector3();
const target=new THREE.Vector3(7,0,8),keys=new Set(),move=new Set();
const resourceNodes=[];
function resourceNode(x,z,type,label,color,amount=1){const g=new THREE.Group();const mesh=new THREE.Mesh(type==='wood'?new THREE.CylinderGeometry(.18,.25,1.8,7):type==='stone'?new THREE.DodecahedronGeometry(.7,1):new THREE.SphereGeometry(.48,8,7),mat(color));mesh.castShadow=true;mesh.position.y=type==='wood'?.9:.45;g.add(mesh);g.position.set(x,height(x,z),z);scene.add(g);resourceNodes.push({mesh:g,type,label,amount,used:false})}
for(let i=0;i<24;i++){const a=Math.random()*Math.PI*2,r=9+Math.random()*36,x=target.x+Math.cos(a)*r,z=target.z+Math.sin(a)*r;resourceNode(x,z,i%3===0?'stone':i%3===1?'wood':'herbs',i%3===0?'حجر':i%3===1?'خشب':'أعشاب',i%3===0?0x85877d:i%3===1?0x76502f:0x7d9b55,i%3===1?1:1)}
const hairColorFor=name=>['مريم','ليلى','زهراء','هدى','سلمى','آمنة','رنا','دلال'].includes(name)?0x30251f:['عمر','فارس','جابر','بشير','كاظم','يونس','مهند'].includes(name)?0x493322:0x24201d;
const villagers=[];
function villager(x,z,name,job){
 const g=new THREE.Group(),coatColors={'سالم':0x657b43,'مريم':0x8c5968,'حازم':0x806044,'نورس':0x465d70,'عمر':0x776247,'ليلى':0x965f68,'فارس':0x665b4c,'زهراء':0x477b72,'جابر':0x8a7547,'هدى':0x80658d,'رعد':0x455b70,'سلمى':0x72864a,'بشير':0x8b6740,'آمنة':0x8b5966,'كاظم':0x596d54,'رنا':0x9a705b,'يونس':0x586d79,'دلال':0x936b79,'مهند':0x78634a,'سعيد':0x4b6272},coat=mat(coatColors[name]||0x75634a),skin=mat(0xb98768),hair=mat(name==='سالم'?0x493322:0x30251f),boots=mat(0x33251d);
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.31,.7,5,10),coat);body.position.y=.91;g.add(body);
 const beltMesh=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,6,14),leatherMat);beltMesh.position.y=.72;beltMesh.rotation.x=Math.PI/2;g.add(beltMesh);
 const headNode=new THREE.Group();headNode.position.y=1.52;g.add(headNode);
 detailedFace(headNode,['مريم','زهراء','ليلى','آمنة','رنا','دلال'].includes(name)?0xb98268:['نورس','عمر','فارس','جابر','كاظم','يونس'].includes(name)?0xa87555:0xc08a68,hairColorFor(name),name==='مريم'?0x547b70:name==='نورس'?0x4a5c62:0x765238,name==='حازم'||name==='نورس');
 const armPivots=[],legPivots=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.38,1.25,0);const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.48,4,8),coat);sleeve.position.y=-.27;sleeve.rotation.z=side*.12;arm.add(sleeve);const hand=new THREE.Mesh(new THREE.SphereGeometry(.085,8,6),skin);hand.position.y=-.55;arm.add(hand);g.add(arm);armPivots.push(arm);
  const leg=new THREE.Group();leg.position.set(side*.14,.48,0);const lower=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.43,4,8),boots);lower.position.y=-.2;leg.add(lower);const boot=new THREE.Mesh(new THREE.BoxGeometry(.2,.13,.29),boots);boot.position.set(0,-.43,.08);leg.add(boot);g.add(leg);legPivots.push(leg);
 }
 const apron=new THREE.Mesh(new THREE.BoxGeometry(.34,.43,.035),mat(name==='حازم'?0x49372a:0x6b563e));apron.position.set(0,.78,.29);g.add(apron);
 if(name==='نورس'){const helmet=new THREE.Mesh(new THREE.SphereGeometry(.27,12,8,0,Math.PI*2,0,Math.PI*.5),metalMat);helmet.position.y=1.77;g.add(helmet);const shield=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.07,8),mat(0x79603a));shield.position.set(.48,.92,-.04);shield.rotation.z=Math.PI/2;g.add(shield)}
 if(name==='مريم'){const hood=new THREE.Mesh(new THREE.SphereGeometry(.27,12,8,0,Math.PI*2,0,Math.PI*.7),mat(0x543b48));hood.position.y=1.62;g.add(hood)}
 if(name==='حازم'){const tool=new THREE.Mesh(new THREE.BoxGeometry(.08,.62,.08),leatherMat);tool.position.set(.43,.85,.08);g.add(tool)}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 g.position.set(x,height(x,z),z);scene.add(g);villagers.push({mesh:g,name,job,homeX:x,homeZ:z,phase:Math.random()*6,armPivots,legPivots});
}
villager(10,5,'سالم','مزارع');villager(17,-3,'مريم','معالجة الأعشاب');villager(-1,-9,'حازم','نجار');villager(23,8,'نورس','حارس');
villager(-350,-250,'عمر','صياد');villager(-372,-270,'ليلى','خبازة');
villager(360,-320,'جابر','راعٍ');villager(375,-340,'هدى','ناسجة');
villager(-405,372,'بشير','تاجر');villager(-430,385,'آمنة','طحّانة');
villager(405,400,'يونس','رحّالة');villager(380,375,'دلال','بائعة');

const wildlife=[];
function animal(x,z,kind){
 const g=new THREE.Group(),fur=mat(kind==='غزال'?0x98734d:0x8c8877,.82),dark=mat(0x30271f),innerEar=mat(0xc58b82),noseMat=mat(0x332824,.45);
 const torso=new THREE.Mesh(new THREE.SphereGeometry(kind==='غزال'?.55:.34,24,18),fur);torso.scale.set(1.35,.82,.72);torso.position.y=kind==='غزال'?.95:.48;g.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(kind==='غزال'?.22:.18,20,16),fur);head.position.set(0,kind==='غزال'?1.45:.62,.48);g.add(head);
 const eyes=[];for(const side of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(kind==='غزال'?.035:.028,8,6),mat(0x171411));eye.position.set(side*(kind==='غزال'?.16:.125),kind==='غزال'?1.49:.65,.625);g.add(eye);eyes.push(eye)}
 const muzzle=new THREE.Mesh(new THREE.SphereGeometry(kind==='غزال'?.09:.07,16,12),fur);muzzle.position.set(0,kind==='غزال'?1.37:.56,.66);muzzle.scale.set(1,.7,1);g.add(muzzle);const noseTip=new THREE.Mesh(new THREE.SphereGeometry(kind==='غزال'?.045:.038,10,8),noseMat);noseTip.position.set(0,kind==='غزال'?1.34:.54,.72);g.add(noseTip);
 if(kind==='أرنب'){for(const side of [-1,1]){const inner=new THREE.Mesh(new THREE.ConeGeometry(.052,.29,8),innerEar);inner.position.set(side*.11,.88,.51);inner.rotation.z=side*.12;g.add(inner)}const whiskers=new THREE.Group();for(const side of [-1,1])for(let j=0;j<2;j++){const whisker=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.22,5),mat(0xd8d0c0));whisker.position.set(side*.07,.55,.72);whisker.rotation.z=side*(.8+j*.25);whiskers.add(whisker)}g.add(whiskers)}if(kind==='غزال'){const chestFur=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),mat(0xc9b18b));chestFur.position.set(0,.91,.36);chestFur.scale.set(.7,1.4,.55);g.add(chestFur)}
 const legs=[];
 if(kind==='غزال'){
  for(const sx of [-1,1])for(const sz of [-1,1]){const leg=new THREE.Group();leg.position.set(sx*.28,.72,sz*.22);const shin=new THREE.Mesh(new THREE.CylinderGeometry(.035,.052,.68,7),dark);shin.position.y=-.34;leg.add(shin);g.add(leg);legs.push(leg)}
  for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.07,.55,5),dark);ear.position.set(side*.13,1.83,.45);ear.rotation.z=side*.25;g.add(ear);const antler=new THREE.Group();antler.position.set(side*.12,1.65,.39);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.018,.035,.48,5),dark);antler.add(stem);for(let branch=0;branch<2;branch++){const tine=new THREE.Mesh(new THREE.CylinderGeometry(.012,.022,.25,5),dark);tine.position.set(side*.07,.12+branch*.13,0);tine.rotation.z=side*-.55;antler.add(tine)}g.add(antler)}
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),fur);tail.position.set(0,.98,-.72);g.add(tail);
 }else{
  for(const sx of [-1,1])for(const sz of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.18,3,6),dark);leg.position.set(sx*.2,.22,sz*.2);g.add(leg);legs.push(leg)}
  for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.09,.42,6),fur);ear.position.set(side*.11,.86,.5);g.add(ear)}
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),fur);tail.position.set(0,.55,-.43);g.add(tail);
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 g.position.set(x,height(x,z),z);scene.add(g);wildlife.push({mesh:g,head,kind,legs,eyes,homeX:x,homeZ:z,phase:Math.random()*8,speed:.35+Math.random()*.4,flee:0});
}
for(let i=0;i<5;i++){const a=i/5*Math.PI*2;animal(Math.cos(a)*30+18,Math.sin(a)*28-12,'غزال');}
for(let i=0;i<7;i++){const a=Math.random()*Math.PI*2,r=12+Math.random()*30;animal(Math.cos(a)*r+10,Math.sin(a)*r+4,'أرنب');}

let survivalTick=0,weatherTick=0;
function updateSurvival(dt,hour){
if(!entered)return;survivalTick+=dt;weatherTick+=dt;
if(survivalTick>18){survivalTick=0;game.hunger=Math.max(0,game.hunger-.8);game.thirst=Math.max(0,game.thirst-1.2);game.stamina=Math.min(100,game.stamina+2);if(game.hunger===0||game.thirst===0)game.health=Math.max(1,game.health-2);$('#health-bar').style.width=game.health+'%';$('#stamina-bar').style.width=game.stamina+'%';$('#hunger-bar').style.width=game.hunger+'%';$('#thirst-bar').style.width=game.thirst+'%';saveGame()}
if(weatherTick>85){weatherTick=0;const weathers=['صحو','ضباب','مطر خفيف','عاصفة'];const w=weathers[Math.floor(Math.random()*weathers.length)];$('#weather-label').textContent=w;toast('تغير الطقس: '+w)}
for(const v of villagers){const oldX=v.mesh.position.x,oldZ=v.mesh.position.z;const nx=v.homeX+Math.sin(elapsed*.22+v.phase)*1.3,nz=v.homeZ+Math.cos(elapsed*.18+v.phase)*1.3;moveWithCollision(v.mesh,nx-oldX,nz-oldZ,.48);v.mesh.position.y=height(v.mesh.position.x,v.mesh.position.z);const moving=Math.hypot(v.mesh.position.x-oldX,v.mesh.position.z-oldZ)>.001;const step=Math.sin(elapsed*3.8+v.phase)*(moving?.28:.035);v.armPivots[0].rotation.x=step;v.armPivots[1].rotation.x=-step;v.legPivots[0].rotation.x=-step*.8;v.legPivots[1].rotation.x=step*.8;v.mesh.rotation.y=Math.atan2(v.mesh.position.x-oldX,v.mesh.position.z-oldZ)}
for(const a of wildlife){const dx=a.mesh.position.x-target.x,dz=a.mesh.position.z-target.z,dist=Math.hypot(dx,dz);let vx=0,vz=0;if(entered&&dist<10){a.flee=Math.max(a.flee,2.8);vx=dx/(dist||1);vz=dz/(dist||1)}else{const wander=Math.sin(elapsed*a.speed+a.phase);vx=Math.cos(elapsed*a.speed*.7+a.phase)*.42;vz=Math.sin(elapsed*a.speed+a.phase)*.32;a.flee=Math.max(0,a.flee-dt)}const pace=a.flee>0?5.2:1.1;const ax=vx*pace*dt+(a.flee<=0?(a.homeX-a.mesh.position.x)*dt*.12:0),az=vz*pace*dt+(a.flee<=0?(a.homeZ-a.mesh.position.z)*dt*.12:0);moveWithCollision(a.mesh,ax,az,a.kind==='غزال'?.55:.3);a.mesh.position.x=THREE.MathUtils.clamp(a.mesh.position.x,-790,790);a.mesh.position.z=THREE.MathUtils.clamp(a.mesh.position.z,-790,790);a.mesh.position.y=height(a.mesh.position.x,a.mesh.position.z);if(Math.abs(vx)+Math.abs(vz)>.05)a.mesh.rotation.y=Math.atan2(vx,vz);a.head.rotation.x=a.flee>0?-.12:Math.sin(elapsed*1.4+a.phase)*.08;a.legs.forEach((leg,i)=>{leg.rotation.x=Math.sin(elapsed*(a.flee>0?11:4)+a.phase+(i%2)*Math.PI)* (a.flee>0?.72:.18)});}
}

addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='f')interact()});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
canvas.addEventListener('pointerdown',e=>{drag=true;last={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-last.x)*.0045;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-last.y)*.003,-.15,1.12);last={x:e.clientX,y:e.clientY}});
canvas.addEventListener('wheel',e=>distance=THREE.MathUtils.clamp(distance+e.deltaY*.025,8,65),{passive:true});
const stick=$('#joystick-base'),knob=$('#joystick-knob');let stickPointer=null;
function steer(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.34,len=Math.hypot(dx,dy),scale=len>max?max/len:1,x=dx*scale,y=dy*scale;knob.style.transform='translate('+x+'px,'+y+'px)';for(const k of ['forward','back','left','right'])move.delete(k);if(y< -12)move.add('forward');if(y>12)move.add('back');if(x< -12)move.add('left');if(x>12)move.add('right')}
stick.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);steer(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)steer(e)});
function releaseStick(){stickPointer=null;knob.style.transform='translate(0,0)';for(const k of ['forward','back','left','right'])move.delete(k)}
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>stick.addEventListener(ev,releaseStick));
document.querySelectorAll('[data-move="sprint"]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();move.add('sprint')});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>move.delete('sprint')))});$('#jump-button').addEventListener('pointerdown',e=>{e.preventDefault();if(entered&&player.position.y<=height(target.x,target.z)+.08)jumpVelocity=6.2});
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2600)}
const game={health:100,stamina:100,hunger:100,thirst:100,wood:0,stone:0,herbs:3,food:2,coins:12,level:1,xp:0,discovered:0,quest:0};
try{Object.assign(game,JSON.parse(localStorage.getItem('shadowProtocolSave')||'{}'))}catch{}
function saveGame(){try{localStorage.setItem('shadowProtocolSave',JSON.stringify(game))}catch{}}
function panelButton(label,action){return '<button class="game-action" data-action="'+action+'">'+label+'</button>'}
function openPanel(which){
let title='',kicker='سجل العالم',body='';
if(which==='library'){kicker='مركز العالم';title='المكتبة';body='<p>كل أنظمة اللعبة وأدواتها في مكان واحد.</p>'+panelButton('الحقيبة والمقتنيات','open-inventory')+panelButton('الخريطة الموسعة','open-map')+panelButton('سجل الرحلة والمهام','open-journal')+panelButton('الصناعة والأدوات','open-craft')+panelButton('السوق والتجارة','open-market')+panelButton('البناء والمأوى','open-build')+panelButton('السكان والعلاقات','open-people')+panelButton('المهارات والتطور','open-skills')}
if(which==='inventory'){kicker='المقتنيات';title='حقيبة المسافر';body='<div class="stat-grid"><div>خشب <b>'+game.wood+'</b></div><div>حجر <b>'+game.stone+'</b></div><div>أعشاب <b>'+game.herbs+'</b></div><div>طعام <b>'+game.food+'</b></div><div>عملات <b>'+game.coins+'</b></div><div>ماء <b>'+Math.round(game.thirst)+'%</b></div></div>'}
if(which==='map'){kicker='دليل الرحّالة';title='خريطة الأقاليم الكبرى';body='<div class="world-map"><span class="map-river"></span><span class="map-forest">غابة السنديان</span><span class="map-village">المستوطنة</span><span class="map-fire">موقد الحراسة</span><span class="map-player" style="left:'+((target.x+800)/1600*100)+'%;top:'+((target.z+800)/1600*100)+'%">أنت</span><span class="map-mountain">الجبال</span><span class="map-port">مرفأ النهر</span><span class="map-hills">قرية التلال</span><span class="map-farm">مزارع السهل</span><span class="map-ruins">أطلال الحصن</span></div><p>عالم بمساحة لعب تقارب ١٦٠٠ × ١٦٠٠ متر: غابات وأنهار وقرى ومزارع وأطلال وحصون وممرات جبلية.</p><p>الاكتشافات: '+game.discovered+' · موقعك: '+Math.round(target.x)+' ، '+Math.round(target.z)+'</p>'}
if(which==='journal'){kicker='ملاحظات ميدانية';title='سجل الرحلة';body='<p>الوادي هادئ، لكنه ليس خالياً. آثار غريبة تظهر قرب الأشجار بعد الغروب.</p><p><b>المهمة الحالية:</b> '+(game.quest===0?'اكتشف موقد الحراسة':game.quest===1?'اجمع ٣ قطع خشب وحجراً واحداً':'عد إلى المستوطنة وابدأ بناء مأوى')+'</p><p>المستوى '+game.level+' · الخبرة '+game.xp+'</p>'}
if(which==='craft'){kicker='ورشة الصانع';title='الصناعة البدائية';body='<p>حوّل الموارد إلى أدوات تساعدك على البقاء.</p>'+panelButton('صناعة فأس بدائي · ٣ خشب + ٢ حجر','axe')+panelButton('صناعة ضماد · عشب واحد','bandage')+panelButton('تحضير وجبة · طعامان','meal')+panelButton('صناعة رمح خشبي · ٢ خشب','spear')}
if(which==='market'){kicker='سوق المستوطنة';title='تجارة الوادي';body='<p>تاجر المستوطنة يشتري الموارد ويبيع المؤن.</p>'+panelButton('شراء طعام · ٣ عملات','buyfood')+panelButton('شراء ماء · ٢ عملة','buywater')+panelButton('بيع ٢ خشب · ٤ عملات','sellwood')+panelButton('بيع الأعشاب · ٣ عملات','sellherbs')}
if(which==='build'){kicker='ورشة البناء';title='ابنِ مأواك الأول';body='<p>ابدأ بتأسيس مكان آمن قبل حلول الظلام.</p>'+panelButton('بناء كوخ خشبي · ٦ خشب + ٣ حجر','hut')+panelButton('إشعال موقد نار · ٢ خشب + حجر','camp')+panelButton('ترقية المأوى · ٤ خشب','upgrade')}
if(which==='people'){kicker='أهل المستوطنة';title='وجوه الوادي';body=villagers.map(v=>'<div class="person-card"><b>'+v.name+'</b><span>'+v.job+'</span><small>يقيم في المستوطنة · يتجول خلال النهار</small></div>').join('')+'<p>الحياة الاجتماعية ستتوسع مع تطور المستوطنة والعلاقات والمهن.</p>'}
if(which==='skills'){kicker='تطور الشخصية';title='مهارات البقاء';body='<div class="stat-grid"><div>المستوى <b>'+game.level+'</b></div><div>الخبرة <b>'+game.xp+'</b></div><div>الاكتشاف <b>'+game.discovered+'</b></div><div>الصحة <b>'+Math.round(game.health)+'٪</b></div></div><p>اجمع الموارد، اصنع الأدوات، واستكشف المناطق لزيادة خبرتك.</p>'+panelButton('تأمل واسترح · استعد بعض الطاقة','rest')}
$('#panel-kicker').textContent=kicker;$('#panel-title').textContent=title;$('#panel-content').innerHTML=body;$('#side-panel').classList.add('open')}
function gameAction(action){
const fail=m=>toast('لا تملك الموارد الكافية: '+m);
if(action.startsWith('open-')){const dest=action.slice(5);openPanel(dest);return}
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
if(action==='rest'){game.stamina=Math.min(100,game.stamina+35);game.health=Math.min(100,game.health+8);game.thirst=Math.max(0,game.thirst-3);toast('استرحت قليلاً واستعدت عافيتك.')}
saveGame();const open=$('#side-panel').classList.contains('open');if(open){const panel=whichPanel();openPanel(panel||'inventory')}
}
function whichPanel(){const t=$('#panel-title').textContent;if(t==='حقيبة المسافر')return'inventory';if(t==='الصناعة البدائية')return'craft';if(t==='تجارة الوادي')return'market';if(t==='ابنِ مأواك الأول')return'build';if(t==='وجوه الوادي')return'people';if(t==='مهارات البقاء')return'skills';return'journal'}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)gameAction(b.dataset.action)});
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));$('#panel-close').onclick=()=>$('#side-panel').classList.remove('open');$('#menu-toggle').onclick=()=>openPanel('journal');
$('#interact-prompt').addEventListener('click',interact);
function interact(){
let nearest=null,dist=8;
for(const n of resourceNodes){const d=target.distanceTo(n.mesh.position);if(d<dist){nearest=n;dist=d}}
if(nearest){game[nearest.type]+=nearest.amount;nearest.mesh.visible=false;nearest.used=true;game.xp+=5;saveGame();toast('جمعت '+nearest.label+' · '+nearest.amount);if(game.quest===1&&game.wood>=3&&game.stone>=1){game.quest=2;$('#quest-title').textContent='عد إلى المستوطنة وابنِ مأوى';$('#quest-desc').textContent='أصبحت تملك ما يكفي للبدء.'}return}
let person=null,personDist=7;for(const v of villagers){const d=target.distanceTo(v.mesh.position);if(d<personDist){person=v;personDist=d}}if(person){const lines={'سالم':'وصلت في وقت مناسب. الحقول تحتاج إلى يدين قويتين، والسوق يشتري فائض محصولنا.','مريم':'الأعشاب تنمو قرب الماء. لا تستهِن بالجروح والبرد حين يحل الليل.','حازم':'أستطيع تعليمك البناء، لكن الخشب والحجر أساس كل شيء.','نورس':'لا تبتعد عن النار بعد الغروب. رأيت ظلالاً تتحرك بين الأشجار.'};toast(person.name+': '+lines[person.name]);$('#panel-kicker').textContent='حديث مع أحد السكان';$('#panel-title').textContent=person.name+' · '+person.job;$('#panel-content').innerHTML='<p>'+lines[person.name]+'</p><p>يمكنك زيارة السوق أو جمع الموارد أو تطوير مأواك.</p>';$('#side-panel').classList.add('open');return}
const animalNear=wildlife.find(a=>target.distanceTo(a.mesh.position)<4);if(animalNear){toast(animalNear.kind+' يراقبك ثم يبتعد بهدوء.');animalNear.homeX+=Math.sign(animalNear.homeX-target.x)*5;animalNear.homeZ+=Math.sign(animalNear.homeZ-target.z)*5;return}
const d=target.distanceTo(fire.position);if(d<10){game.discovered++;game.quest=Math.max(game.quest,1);saveGame();toast('اكتشاف: آثار حديثة تتجه إلى الغابة الشمالية.');$('#panel-kicker').textContent='اكتشاف جديد';$('#panel-title').textContent='نار كان يفترض أن تنطفئ';$('#panel-content').innerHTML='<p>الرماد دافئ. آثار أقدام حديثة تقود إلى أشجار الصنوبر السوداء. لست أول من وصل إلى هنا.</p><p>بدأت مهمتك التالية: اجمع الخشب والحجر لصناعة أدواتك.</p>';$('#side-panel').classList.add('open');$('#quest-title').textContent='اجمع الخشب والحجر';$('#quest-desc').textContent='اجمع ٣ قطع خشب وحجراً واحداً.';return}
toast('اقترب من مورد أو من موقد الحراسة للتفاعل.')}
$('#begin').addEventListener('click',()=>{entered=true;$('#hero').style.display='none';$('.region-card').style.display='none';$('#hud').classList.add('active');$('#mobile-controls').style.display='block';$('#control-hint').classList.add('visible');setTimeout(()=>$('#control-hint').classList.remove('visible'),6500);toast('أصبحت البرية ملكك. راقب حافة الغابة.');});
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-(animate.last||now))/1000,.04);animate.last=now;elapsed+=dt;clockMinutes+=dt*1.4;if(clockMinutes>=1440){clockMinutes-=1440;day++}
const hour=Math.floor(clockMinutes/60),minute=Math.floor(clockMinutes%60);$('#world-clock').textContent='اليوم '+String(day+1).padStart(2,'0')+' · '+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
updateSurvival(dt,hour);const night=hour<6||hour>19;const daylight=THREE.MathUtils.clamp((Math.sin((hour-6)/13*Math.PI)+.12),.12,1);sun.intensity=.35+daylight*2.5;scene.fog.color.set(night?0x17232a:0x9bb6b0);scene.background.copy(scene.fog.color);scene.fog.density=night?.014:.009;renderer.toneMappingExposure=night?.72:1.12;
const fwd=(keys.has('w')||keys.has('arrowup')||move.has('forward')?1:0)-(keys.has('s')||keys.has('arrowdown')||move.has('back')?1:0),side=(keys.has('d')||keys.has('arrowright')||move.has('right')?1:0)-(keys.has('a')||keys.has('arrowleft')||move.has('left')?1:0),moving=!!(fwd||side),sprinting=keys.has('shift')||move.has('sprint');
if(entered&&moving){const speed=sprinting&&game.stamina>2?10.5:5.8;const norm=1/Math.max(1,Math.hypot(fwd,side));const dx=(Math.sin(yaw)*fwd+Math.cos(yaw)*side)*speed*dt*norm,dz=(Math.cos(yaw)*fwd-Math.sin(yaw)*side)*speed*dt*norm;moveWithCollision(player,dx,dz,.58);target.x=THREE.MathUtils.clamp(player.position.x,-780,780);target.z=THREE.MathUtils.clamp(player.position.z,-780,780);player.rotation.y=Math.atan2(Math.sin(yaw)*fwd+Math.cos(yaw)*side,Math.cos(yaw)*fwd-Math.sin(yaw)*side);game.stamina=Math.max(0,game.stamina-(sprinting?dt*8:dt*.45));}
walkingBlend=THREE.MathUtils.lerp(walkingBlend,moving?1:0,Math.min(1,dt*9));const swing=Math.sin(elapsed*(sprinting?13:8))*walkingBlend;armPivots[0].rotation.x=swing*.72;armPivots[1].rotation.x=-swing*.72;legPivots[0].rotation.x=-swing*.68;legPivots[1].rotation.x=swing*.68;torso.position.y=1.05+Math.abs(swing)*.035;player.position.x=target.x;player.position.z=target.z;const floor=height(target.x,target.z);if(jumpVelocity||player.position.y>floor+.02){jumpVelocity-=16*dt;player.position.y+=jumpVelocity*dt;if(player.position.y<floor){player.position.y=floor;jumpVelocity=0}}else player.position.y=floor;target.y=player.position.y;
if(entered&&!moving&&game.stamina<100)game.stamina=Math.min(100,game.stamina+dt*4);
const camDist=entered?distance:distance;cameraGoal.set(target.x+Math.sin(yaw)*Math.cos(pitch)*camDist,target.y+Math.sin(pitch)*camDist+4,target.z+Math.cos(yaw)*Math.cos(pitch)*camDist);camera.position.lerp(cameraGoal,Math.min(1,dt*5.5));camera.lookAt(target.x,target.y+1.15,target.z);
flame.scale.setScalar(.88+Math.sin(elapsed*13)*.13);glow.intensity=2+Math.sin(elapsed*17)*.65;const water=riverGeo.attributes.position;for(let i=0;i<water.count;i++){const x=water.getX(i),z=water.getZ(i);water.setY(i,height(x,z)+.22+Math.sin(z*.22+elapsed*2.8+x*.13)*.045+Math.sin(z*.08-elapsed*1.7)*.025)}water.needsUpdate=true;riverGeo.computeVertexNormals();riverMat.opacity=.88+Math.sin(elapsed*1.4)*.035;
const near=target.distanceTo(fire.position)<10||resourceNodes.some(n=>!n.used&&target.distanceTo(n.mesh.position)<7)||villagers.some(v=>target.distanceTo(v.mesh.position)<6)||wildlife.some(a=>target.distanceTo(a.mesh.position)<4);$('#interact-prompt').style.display=entered&&near?'block':'none';if(entered&&hour>19&&hour<22)$('#weather-label').textContent='حلول الليل';renderer.render(scene,camera)}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>$('#loading').classList.add('hidden'),1100);
