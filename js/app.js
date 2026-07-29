
let photos=[],heroIndex=null,hero={x:0,y:0,w:420,h:522,src:null};
let selectedLayers=['heroLayer'], dragMode=null, startX=0,startY=0,startRect=null, zoom=100;
let replaceMode=false;

const layerData=[
 {id:'heroLayer',name:'Hero Photo Area',type:'Photo Frame',locked:false,hidden:false,rotation:0,opacity:1,z:1},
 {id:'support1Layer',name:'Support Photo 1',type:'Photo Frame',locked:false,hidden:true,rotation:0,opacity:1,z:2},
 {id:'support2Layer',name:'Support Photo 2',type:'Photo Frame',locked:false,hidden:true,rotation:0,opacity:1,z:3},
 {id:'support3Layer',name:'Support Photo 3',type:'Photo Frame',locked:false,hidden:true,rotation:0,opacity:1,z:4},
 {id:'support4Layer',name:'Support Photo 4',type:'Photo Frame',locked:false,hidden:true,rotation:0,opacity:1,z:5},
 {id:'titleLayer',name:'Title',type:'Text',locked:false,hidden:false,rotation:0,opacity:1,z:10},
 {id:'subtitleLayer',name:'Subtitle',type:'Text',locked:false,hidden:false,rotation:0,opacity:1,z:11}
];

/* ---- Auto Layout Engine: photo-count -> slot rectangles within the 420x522 photo zone ---- */
const SUPPORT_SLOTS=['support1Layer','support2Layer','support3Layer','support4Layer'];
const LAYOUT_TEMPLATES={
 1:{heroLayer:{x:0,y:0,w:420,h:522}},
 2:{heroLayer:{x:0,y:0,w:420,h:388},support1Layer:{x:0,y:396,w:420,h:126}},
 3:{heroLayer:{x:0,y:0,w:420,h:388},support1Layer:{x:0,y:396,w:204,h:126},support2Layer:{x:212,y:396,w:208,h:126}},
 4:{heroLayer:{x:0,y:0,w:420,h:356},support1Layer:{x:0,y:364,w:134,h:158},support2Layer:{x:142,y:364,w:134,h:158},support3Layer:{x:284,y:364,w:136,h:158}},
 5:{heroLayer:{x:0,y:0,w:420,h:296},support1Layer:{x:0,y:304,w:204,h:105},support2Layer:{x:212,y:304,w:208,h:105},support3Layer:{x:0,y:417,w:204,h:105},support4Layer:{x:212,y:417,w:208,h:105}}
};
const slotPhoto={support1Layer:{x:0,y:0,w:0,h:0,src:null},support2Layer:{x:0,y:0,w:0,h:0,src:null},support3Layer:{x:0,y:0,w:0,h:0,src:null},support4Layer:{x:0,y:0,w:0,h:0,src:null}};

const Workspace={
 loadFactory(f){
  topTitle.textContent='OCF Beta V3.0 · '+f[1];
  activeFactoryName.textContent=f[0]+' '+f[1]; activeFactoryDesc.textContent=f[2];
  titleLayer.textContent=f[3]; subtitleLayer.textContent='Official Locked Mode · '+f[4];
  titleInput.value=f[3]; subtitleInput.value='Official Locked Mode · '+f[4];
  this.resetPhoto(); renderQueue(); updateHero(); selectLayer('heroLayer',false); renderLayers(); syncProps(); updateStatusBar();
 },
 resetPhoto(){
  photos=[];heroIndex=null;
  replaceMode=false;
  clearSlot('heroLayer');
  SUPPORT_SLOTS.forEach(clearSlot)
 }
};

function markPass(){foundationStatus.textContent='PASS';cssStatus.textContent='PASS';jsStatus.textContent='PASS';routerStatus.textContent='PASS'}
function backDashboard(){ScreenRouter.showScreen('dashboard');topTitle.textContent='OCF Beta V3.0 Editor Core'}
function newProject(){ScreenRouter.showScreen('dashboard');focusSection('factoryOverviewPanel')}
function uploadPhotos(){replaceMode=false;photoInput.click()}

/* ---- Workflow menu navigation ---- */
function focusSection(id){
 const el=document.getElementById(id);
 if(!el)return;
 el.scrollIntoView({behavior:'smooth',block:'nearest'});
 el.classList.add('focusFlash');
 setTimeout(()=>el.classList.remove('focusFlash'),900)
}
function menuUploadPhotos(){uploadPhotos();focusSection('uploadHeading')}
function menuPhotoQueue(){focusSection('queueHeading')}
function menuChooseHero(){
 focusSection('queueHeading');
 const hint=document.getElementById('queueHint');
 if(hint){
  hint.textContent=photos.length?'Click a photo below, or its Hero button, to set it as the Hero image.':'Upload photos first, then choose one as the Hero image.';
  hint.classList.add('show');
  setTimeout(()=>hint.classList.remove('show'),3000)
 }
 if(heroIndex!==null){
  const queueEl=document.getElementById('photoQueue');
  const items=queueEl?queueEl.querySelectorAll('.photoItem'):[];
  const heroEl=items[heroIndex];
  if(heroEl){heroEl.classList.add('heroHintFlash');setTimeout(()=>heroEl.classList.remove('heroHintFlash'),1200)}
 }
}
function menuCanvas(){focusSection('canvasSection')}
function menuTransform(){focusSection('transformHeading')}
function menuLayers(){focusSection('layersHeading')}
function menuExport(){focusSection('exportHeading')}

/* ---- Photo upload: deterministic order + in-place hero replace ---- */
function handlePhotos(e){
 const files=[...e.target.files];
 e.target.value='';
 if(replaceMode){
  replaceMode=false;
  const file=files.find(f=>['image/jpeg','image/png','image/webp'].includes(f.type));
  if(!file)return;
  const idx=heroIndex;
  const r=new FileReader();
  r.onload=ev=>{
   photos[idx]={...photos[idx],name:file.name,src:ev.target.result};
   measurePhotoDimensions(photos[idx]);
   loadHero(ev.target.result);
   renderQueue();updateStatusBar()
  };
  r.readAsDataURL(file);
  return;
 }
 addPhotoFiles(files)
}
function addPhotoFiles(files){
 const valid=files.filter(f=>['image/jpeg','image/png','image/webp'].includes(f.type));
 if(!valid.length)return;
 const startIndex=photos.length;
 valid.forEach((file,offset)=>{photos[startIndex+offset]={id:Date.now()+Math.random()+offset,name:file.name,src:null}});
 if(heroIndex===null)heroIndex=startIndex;
 renderQueue();updateStatusBar();autoLayout();
 valid.forEach((file,offset)=>{
  const idx=startIndex+offset;
  const r=new FileReader();
  r.onload=ev=>{
   photos[idx].src=ev.target.result;
   measurePhotoDimensions(photos[idx]);
   renderQueue();updateStatusBar();autoLayout()
  };
  r.readAsDataURL(file)
 })
}
/* ---- Measures natural pixel dimensions once a photo's image data is available. Feeds PhotoAnalyzer only - never read by Renderer/Export. ---- */
function measurePhotoDimensions(photo){
 const img=new Image();
 img.onload=()=>{
  photo.width=img.naturalWidth;
  photo.height=img.naturalHeight
 };
 img.src=photo.src
}
function setupDropZone(){dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('dragover')});dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));dropZone.addEventListener('drop',e=>{e.preventDefault();dropZone.classList.remove('dragover');addPhotoFiles([...e.dataTransfer.files])})}
function renderQueue(){
 photoQueue.innerHTML='';
 if(!photos.length){photoQueue.innerHTML='<div class="emptyQueue">No photos uploaded yet</div>';updateQueueStatus();return}
 photos.forEach((p,i)=>{
  const item=document.createElement('div');
  item.className='photoItem'+(i===heroIndex?' hero':'')+(p.src?'':' loading');
  item.innerHTML=`<div class="photoThumb" style="${p.src?`background-image:url('${p.src}')`:''}">${p.src?'':'…'}</div><div><div class="photoName">${p.name} ${i===heroIndex?'<span class="heroBadge">HERO</span>':''}</div><div class="photoMeta">${p.src?('Order '+(i+1)):'Loading…'}</div></div><div class="photoActions"><button class="miniBtn gold">Hero</button><button class="miniBtn light">Rename</button><button class="miniBtn red">Delete</button></div>`;
  item.onclick=()=>setHero(i);
  item.querySelectorAll('button')[0].onclick=e=>{e.stopPropagation();setHero(i)};
  item.querySelectorAll('button')[1].onclick=e=>{e.stopPropagation();renamePhoto(i)};
  item.querySelectorAll('button')[2].onclick=e=>{e.stopPropagation();deletePhoto(i)};
  photoQueue.appendChild(item)
 });
 updateQueueStatus()
}
function setHero(i){if(!photos[i]||!photos[i].src)return;heroIndex=i;loadHero(photos[i].src);renderQueue();updateStatusBar()}
function renamePhoto(i){const n=prompt('Rename photo:',photos[i].name);if(n&&n.trim()){photos[i].name=n.trim();renderQueue()}}
function deletePhoto(i){
 const wasHero=(heroIndex===i);
 photos.splice(i,1);
 if(!photos.length){
  heroIndex=null;
  clearSlot('heroLayer');
  SUPPORT_SLOTS.forEach(clearSlot)
 }else if(wasHero){
  heroIndex=Math.min(i,photos.length-1);
  hero.src=null
 }else if(heroIndex>i){
  heroIndex--
 }
 renderQueue();updateStatusBar();
 if(photos.length)autoLayout()
}
function updateQueueStatus(){totalPhotosStatus.textContent=photos.length;photoCount.textContent=photos.length+' photo(s)';heroNameStatus.textContent=(heroIndex!==null&&photos[heroIndex])?photos[heroIndex].name:'None'}

function loadHero(src){hero.src=src;heroImg.onload=()=>fitHeroToFrame();heroImg.src=src}
function fitHeroToFrame(){
 const frame=getRect('heroLayer');
 const fw=frame.w||420,fh=frame.h||522;
 const fit=calculateCoverFit(heroImg.naturalWidth,heroImg.naturalHeight,fw,fh);
 hero.x=fit.x;hero.y=fit.y;hero.w=fit.width;hero.h=fit.height;
 updateHero()
}
function updateHero(){if(hero.src){heroLayer.classList.add('hasPhoto');heroImg.style.display='block';heroImg.style.left=hero.x+'px';heroImg.style.top=hero.y+'px';heroImg.style.width=hero.w+'px';heroImg.style.height=hero.h+'px'}else{heroLayer.classList.remove('hasPhoto');heroImg.style.display='none'}canvasSizeStatus.textContent='1080 × 1920'}

function loadSlotImage(slotId,src){
 const img=getEl(slotId+'Img');
 if(!img)return;
 slotPhoto[slotId].src=src;
 img.onload=()=>fitSlotToFrame(slotId);
 img.src=src
}
function fitSlotToFrame(slotId){
 const img=getEl(slotId+'Img');
 if(!img||!img.naturalWidth)return;
 const frame=getRect(slotId);
 const fw=frame.w||1,fh=frame.h||1;
 const fit=calculateCoverFit(img.naturalWidth,img.naturalHeight,fw,fh);
 const st=slotPhoto[slotId];
 st.x=fit.x;st.y=fit.y;st.w=fit.width;st.h=fit.height;
 updateSlotImage(slotId)
}
function updateSlotImage(slotId){
 const img=getEl(slotId+'Img');
 const layer=getEl(slotId);
 if(!img||!layer)return;
 const st=slotPhoto[slotId];
 if(st.src){
  layer.classList.add('hasPhoto');
  img.style.display='block';
  img.style.left=st.x+'px';img.style.top=st.y+'px';
  img.style.width=st.w+'px';img.style.height=st.h+'px'
 }else{
  layer.classList.remove('hasPhoto');
  img.style.display='none'
 }
}

/* ---- Unified pure cover-fit calculation. Used by Hero and every support slot - no separate algorithms. ---- */
function calculateCoverFit(imageWidth,imageHeight,frameWidth,frameHeight){
 const scale=Math.max(frameWidth/imageWidth,frameHeight/imageHeight);
 const width=imageWidth*scale,height=imageHeight*scale;
 const x=(frameWidth-width)/2,y=(frameHeight-height)/2;
 return {x,y,width,height}
}

/* ---- Pure Photo Analyzer: inspects already-known photo metadata only. No DOM access, no image loading, no mutation, deterministic. ---- */
const PhotoAnalyzer={
 analyze(photos){
  return photos.map((photo,index)=>this.analyzeOne(photo,index))
 },
 analyzeOne(photo,index){
  const width=typeof photo.width==='number'?photo.width:null;
  const height=typeof photo.height==='number'?photo.height:null;
  const aspectRatio=(width&&height)?width/height:null;
  let orientation=null;
  if(aspectRatio!=null){
   orientation=Math.abs(aspectRatio-1)<0.01?'square':(aspectRatio>1?'landscape':'portrait')
  }
  return {
   id:photo.id,
   width,
   height,
   aspectRatio,
   orientation,
   uploadIndex:index
   /* future fields (faceCount, qualityScore, brightness, subject, dominantColor) can be added here without changing analyze()'s interface */
  }
 }
};

/* ---- Content Model: plain data only, no DOM references ---- */
function buildContentModel(){
 const heroPhoto=heroIndex!==null?photos[heroIndex]:null;
 const others=photos.filter((p,i)=>i!==heroIndex);
 const analysisList=PhotoAnalyzer.analyze(photos);
 const photoModels=photos.map((p,i)=>({id:p.id,analysis:analysisList[i]}));
 return {
  activeFactoryId:FactoryManager.active?FactoryManager.active[1]:null,
  photoIds:photos.map(p=>p.id),
  heroPhotoId:heroPhoto?heroPhoto.id:null,
  supportingPhotoIds:others.slice(0,SUPPORT_SLOTS.length).map(p=>p.id),
  overflowPhotoIds:others.slice(SUPPORT_SLOTS.length).map(p=>p.id),
  title:titleInput?titleInput.value:'',
  subtitle:subtitleInput?subtitleInput.value:'',
  photos:photoModels
 }
}
function findPhotoById(photoId){return photos.find(p=>p.id===photoId)}

/* ---- Fixed text frames, matching current CSS exactly (#titleLayer/#subtitleLayer). Position does not vary by photo count. ---- */
const TEXT_FRAMES={
 titleLayer:{x:24,y:585,width:360,height:44},
 subtitleLayer:{x:24,y:666,width:360,height:28}
};

/* ---- Factory Definitions: structured config per factory, replacing ad-hoc assumptions in the resolver ---- */
const FACTORY_DEFINITIONS={
 'Greeting Factory':{id:'greeting-factory',name:'Greeting Factory',description:'Official greeting posters.',defaultTitle:'OFFICIAL GREETING POSTER',defaultSubtitle:'Official Locked Mode · Greeting Classic',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Stray Dog Factory':{id:'stray-dog-factory',name:'Stray Dog Factory',description:'Operation workflow.',defaultTitle:'OPERASI KAWALAN ANJING LIAR',defaultSubtitle:'Official Locked Mode · Operation 5 Pages',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Tree Cutting Factory':{id:'tree-cutting-factory',name:'Tree Cutting Factory',description:'Before / action / after.',defaultTitle:'KERJA PEMOTONGAN POKOK',defaultSubtitle:'Official Locked Mode · Before Action After',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Building Inspection Factory':{id:'building-inspection-factory',name:'Building Inspection Factory',description:'Inspection summary workflow.',defaultTitle:'PEMERIKSAAN BANGUNAN',defaultSubtitle:'Official Locked Mode · Inspection Report',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Event Factory':{id:'event-factory',name:'Event Factory',description:'Event highlight workflow.',defaultTitle:'SOROTAN PROGRAM RASMI',defaultSubtitle:'Official Locked Mode · Event Highlight',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Album Factory':{id:'album-factory',name:'Album Factory',description:'Multi-page official album.',defaultTitle:'ALBUM RASMI',defaultSubtitle:'Official Locked Mode · Album Layout',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}},
 'Billboard Factory':{id:'billboard-factory',name:'Billboard Factory',description:'Screen and billboard output.',defaultTitle:'PAPARAN RASMI',defaultSubtitle:'Official Locked Mode · Billboard 4:3 / 16:9',allowedTemplates:['template-1','template-2','template-3','template-4','template-5'],photoRules:{minPhotos:1,maxVisible:5,heroPolicy:'first-uploaded'},theme:{primaryColor:'#D4AF37',secondaryColor:'#102A43'}}
};
function getFactoryDefinition(factoryName){return FACTORY_DEFINITIONS[factoryName]||null}

/* ---- Pure Template Selector: Factory Definition + Content Model -> template id string only. No DOM access, no rendering, deterministic. ---- */
const TemplateSelector={
 select({factoryDefinition,contentModel}){
  const rules=(factoryDefinition&&factoryDefinition.photoRules)||{maxVisible:5};
  const maxVisible=rules.maxVisible||5;
  const heroCount=contentModel.heroPhotoId?1:0;
  const photoCount=heroCount+contentModel.supportingPhotoIds.length;
  const preferredTotal=Math.max(1,Math.min(photoCount,maxVisible));
  const preferredTemplateId='template-'+preferredTotal;
  const allowedTemplates=factoryDefinition&&factoryDefinition.allowedTemplates;
  if(!allowedTemplates||allowedTemplates.includes(preferredTemplateId))return preferredTemplateId;
  /* Deterministic fallback: preferred template not allowed for this factory - use the highest allowed template
     whose photo count does not exceed the preferred count, so the poster never shows more slots than photos
     provided. If no allowed template qualifies, fall back to 'template-1'. */
  const allowedNumeric=allowedTemplates
   .map(id=>parseInt(String(id).replace('template-',''),10))
   .filter(n=>!isNaN(n)&&n<=preferredTotal)
   .sort((a,b)=>b-a);
  return allowedNumeric.length?'template-'+allowedNumeric[0]:'template-1'
 }
};
function templateNumberFromId(templateId){
 const n=parseInt(String(templateId).replace('template-',''),10);
 return isNaN(n)?1:n
}

/* ---- Pure Layout Resolver: selected template id + Content Model -> Composition Model. No DOM access, no image loading, no rendering, no template-selection logic, deterministic. ---- */
const LayoutResolver={
 resolve({selectedTemplateId,contentModel,canvas}){
  const templateNumber=templateNumberFromId(selectedTemplateId);
  const template=LAYOUT_TEMPLATES[templateNumber]||LAYOUT_TEMPLATES[1];
  const elements=[];
  if(contentModel.heroPhotoId&&template.heroLayer){
   elements.push({
    id:'hero',
    type:'photo',
    photoId:contentModel.heroPhotoId,
    role:'hero',
    frame:{x:template.heroLayer.x,y:template.heroLayer.y,width:template.heroLayer.w,height:template.heroLayer.h},
    fit:'cover',
    zIndex:1
   })
  }
  contentModel.supportingPhotoIds.forEach((photoId,idx)=>{
   const slotKey=SUPPORT_SLOTS[idx];
   const rect=template[slotKey];
   if(!rect)return;
   elements.push({
    id:'support-'+(idx+1),
    type:'photo',
    photoId,
    role:'support',
    frame:{x:rect.x,y:rect.y,width:rect.w,height:rect.h},
    fit:'cover',
    zIndex:2+idx
   })
  });
  elements.push({
   id:'title',
   type:'text',
   text:contentModel.title,
   frame:{...TEXT_FRAMES.titleLayer},
   zIndex:10
  });
  elements.push({
   id:'subtitle',
   type:'text',
   text:contentModel.subtitle,
   frame:{...TEXT_FRAMES.subtitleLayer},
   zIndex:11
  });
  return {templateId:'template-'+templateNumber,elements}
 }
};

/* ---- Renderer adapter: applies a Composition Model to the current DOM. Only place layout output touches the DOM. ---- */
const COMPOSITION_TO_DOM_SLOT={hero:'heroLayer','support-1':'support1Layer','support-2':'support2Layer','support-3':'support3Layer','support-4':'support4Layer'};
function applySlotFrame(slotId,frame){
 const l=layerData.find(x=>x.id===slotId);
 const el=getEl(slotId);
 if(l&&!l.locked)setRect(slotId,{x:frame.x,y:frame.y,w:frame.width,h:frame.height});
 if(l)l.hidden=false;
 if(el)el.classList.remove('hidden')
}
function applySlotPhoto(slotId,src){
 if(slotId==='heroLayer'){
  if(hero.src!==src)loadHero(src);else fitHeroToFrame()
 }else{
  if(slotPhoto[slotId].src!==src)loadSlotImage(slotId,src);else fitSlotToFrame(slotId)
 }
}
function clearSlot(slotId){
 if(slotId==='heroLayer'){
  hero={x:0,y:0,w:420,h:522,src:null};
  heroImg.removeAttribute('src');
  updateHero()
 }else{
  slotPhoto[slotId]={x:0,y:0,w:0,h:0,src:null};
  const img=getEl(slotId+'Img');
  if(img){img.removeAttribute('src');img.style.display='none'}
  const el=getEl(slotId);
  if(el){el.classList.remove('hasPhoto');el.classList.add('hidden')}
  const l=layerData.find(x=>x.id===slotId);
  if(l)l.hidden=true
 }
}
const COMPOSITION_TEXT_TO_DOM={title:'titleLayer',subtitle:'subtitleLayer'};
function applyTextContent(slotId,text){
 const el=getEl(slotId);
 if(!el)return;
 for(const node of el.childNodes){
  if(node.nodeType===3){node.textContent=text;return}
 }
 el.insertBefore(document.createTextNode(text),el.firstChild)
}
function renderComposition(composition){
 const usedSlots=new Set();
 composition.elements.forEach(el=>{
  if(el.type==='photo'){
   const slotId=COMPOSITION_TO_DOM_SLOT[el.id];
   if(!slotId)return;
   usedSlots.add(slotId);
   applySlotFrame(slotId,el.frame);
   const photo=findPhotoById(el.photoId);
   if(photo&&photo.src)applySlotPhoto(slotId,photo.src)
  }else if(el.type==='text'){
   const slotId=COMPOSITION_TEXT_TO_DOM[el.id];
   if(!slotId)return;
   /* frame intentionally not applied yet - CSS min-height lets wrapped titles grow; wiring position/size is deferred to the dynamic-rendering phase */
   applyTextContent(slotId,el.text)
  }
 });
 SUPPORT_SLOTS.forEach(slotId=>{if(!usedSlots.has(slotId))clearSlot(slotId)});
 renderLayers();updateStatusBar()
}

/* ---- Orchestration: Content Model -> Layout Resolver -> Composition Model -> Renderer adapter ---- */
function autoLayout(){
 if(!photos.length)return;
 const contentModel=buildContentModel();
 const factoryDefinition=getFactoryDefinition(FactoryManager.active?FactoryManager.active[1]:null);
 const selectedTemplateId=TemplateSelector.select({factoryDefinition,contentModel});
 const composition=LayoutResolver.resolve({selectedTemplateId,contentModel,canvas:{width:420,height:522}});
 renderComposition(composition)
}

function getEl(id){return document.getElementById(id)}
function getRect(id){const el=getEl(id);return {x:parseFloat(el.style.left)||0,y:parseFloat(el.style.top)||0,w:parseFloat(el.style.width)||el.offsetWidth,h:parseFloat(el.style.height)||el.offsetHeight}}
function setRect(id,r){const el=getEl(id);el.style.left=r.x+'px';el.style.top=r.y+'px';el.style.width=r.w+'px';el.style.height=r.h+'px'}
function selectLayer(id,ctrl){if(ctrl){selectedLayers.includes(id)?selectedLayers=selectedLayers.filter(x=>x!==id):selectedLayers.push(id)}else selectedLayers=[id];document.querySelectorAll('.layerObj').forEach(o=>o.classList.toggle('selected',selectedLayers.includes(o.id)));renderLayers();syncProps();updateStatusBar()}
function currentLayer(){return layerData.find(l=>l.id===selectedLayers[0])}
function renderLayers(){
 layersList.innerHTML='';
 layerData.slice().sort((a,b)=>(b.z||0)-(a.z||0)).forEach(l=>{
  const row=document.createElement('div');
  row.className='layerRow'+(selectedLayers.includes(l.id)?' active':'');
  row.innerHTML=`<button>${l.hidden?'🙈':'👁'}</button><button>${l.locked?'🔒':'🔓'}</button><div class="layerName">${l.name}</div>`;
  row.onclick=e=>selectLayer(l.id,e.ctrlKey);
  row.children[0].onclick=e=>{e.stopPropagation();toggleHide(l.id)};
  row.children[1].onclick=e=>{e.stopPropagation();toggleLock(l.id)};
  layersList.appendChild(row)
 })
}
function toggleHide(id){const l=layerData.find(x=>x.id===id);l.hidden=!l.hidden;getEl(id).classList.toggle('hidden',l.hidden);renderLayers();updateStatusBar()}
function toggleLock(id){const l=layerData.find(x=>x.id===id);l.locked=!l.locked;getEl(id).classList.toggle('locked',l.locked);renderLayers()}
function renameLayer(){const l=currentLayer();if(renameLayerInput.value.trim()){l.name=renameLayerInput.value.trim();renderLayers();syncProps();updateStatusBar()}}
function syncProps(){const l=currentLayer();if(!l)return;const r=getRect(l.id);selectedCountStatus.textContent=selectedLayers.length;selectedStatus.textContent=l.name;objectTypeStatus.textContent=l.type;currentLayerStatus.textContent=l.name;renameLayerInput.value=l.name;propX.value=Math.round(r.x);propY.value=Math.round(r.y);propW.value=Math.round(r.w);propH.value=Math.round(r.h);propRot.value=l.rotation||0;propOpacity.value=Math.round((l.opacity||1)*100)}

function clampNum(v,min,max,fallback){
 v=parseFloat(v);
 if(!isFinite(v))v=fallback;
 if(min!==undefined)v=Math.max(min,v);
 if(max!==undefined)v=Math.min(max,v);
 return v
}
function normalizeRotation(r){r=r%360;if(r<0)r+=360;return Math.round(r)}
function applyProps(){
 const l=currentLayer();
 if(!l||l.locked){syncProps();return}
 const x=clampNum(propX.value,undefined,undefined,0);
 const y=clampNum(propY.value,undefined,undefined,0);
 const w=clampNum(propW.value,30,undefined,30);
 const h=clampNum(propH.value,20,undefined,20);
 const rot=normalizeRotation(clampNum(propRot.value,undefined,undefined,0));
 const op=clampNum(propOpacity.value,0,100,100);
 setRect(l.id,{x,y,w,h});
 l.rotation=rot;l.opacity=op/100;
 getEl(l.id).style.transform=`rotate(${rot}deg)`;
 getEl(l.id).style.opacity=l.opacity;
 syncProps();updateStatusBar()
}

function blurActiveField(){const ae=document.activeElement;if(ae&&ae!==document.body&&typeof ae.blur==='function')ae.blur()}
function objectDown(e,id){blurActiveField();selectLayer(id,e.ctrlKey);const l=layerData.find(x=>x.id===id);if(l.locked)return;if(e.target.classList.contains('handle'))return;dragMode='move';startX=e.clientX;startY=e.clientY;startRect=getRect(id);e.preventDefault()}
function handleDown(e,mode){const l=currentLayer();if(l&&l.locked){e.stopPropagation();e.preventDefault();return}dragMode=mode;startX=e.clientX;startY=e.clientY;startRect=getRect(selectedLayers[0]);e.stopPropagation();e.preventDefault()}
document.addEventListener('mousemove',e=>{
 if(!dragMode)return;
 const id=selectedLayers[0];const l=currentLayer();
 if(!id||!l||l.locked)return;
 let r={...startRect};const dx=e.clientX-startX,dy=e.clientY-startY;
 if(dragMode==='move'){r.x+=dx;r.y+=dy;snap(r)}
 else if(dragMode==='resize'){r.w=Math.max(30,r.w+dx);r.h=Math.max(20,r.h+dy)}
 else if(dragMode==='rotate'){l.rotation=normalizeRotation(dx);getEl(id).style.transform=`rotate(${l.rotation}deg)`;propRot.value=l.rotation;return}
 setRect(id,r);syncProps();updateStatusBar()
})
document.addEventListener('mouseup',()=>{dragMode=null;guideV.style.display='none';guideH.style.display='none'})
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  const ae=document.activeElement;
  if(ae&&['TEXTAREA','INPUT'].includes(ae.tagName))ae.blur()
 }
})
function snap(r){guideV.style.display='none';guideH.style.display='none';if(Math.abs((r.x+r.w/2)-210)<8){r.x=210-r.w/2;guideV.style.display='block'}if(Math.abs((r.y+r.h/2)-373)<8){r.y=373-r.h/2;guideH.style.display='block'}}
function align(where){
 selectedLayers.forEach(id=>{
  const l=layerData.find(x=>x.id===id);
  if(l&&l.locked)return;
  let r=getRect(id);
  if(where==='left')r.x=0;if(where==='center')r.x=(420-r.w)/2;if(where==='right')r.x=420-r.w;
  if(where==='top')r.y=0;if(where==='middle')r.y=(746-r.h)/2;if(where==='bottom')r.y=746-r.h;
  setRect(id,r)
 });
 syncProps()
}
function applyZ(l){getEl(l.id).style.zIndex=l.z}
function bringForward(){selectedLayers.forEach(id=>{const l=layerData.find(x=>x.id===id);if(!l||l.locked)return;l.z=(l.z||1)+1;applyZ(l)});renderLayers();updateStatusBar()}
function sendBackward(){selectedLayers.forEach(id=>{const l=layerData.find(x=>x.id===id);if(!l||l.locked)return;l.z=Math.max(1,(l.z||1)-1);applyZ(l)});renderLayers();updateStatusBar()}
function bringFront(){const maxZ=Math.max(...layerData.map(x=>x.z||1));selectedLayers.forEach(id=>{const l=layerData.find(x=>x.id===id);if(!l||l.locked)return;l.z=maxZ+1;applyZ(l)});renderLayers();updateStatusBar()}
function sendBack(){const minZ=Math.min(...layerData.map(x=>x.z||1));selectedLayers.forEach(id=>{const l=layerData.find(x=>x.id===id);if(!l||l.locked)return;l.z=minZ-1;applyZ(l)});renderLayers();updateStatusBar()}

function heroPointerDown(e){objectDown(e,'heroLayer')}
function resizePointerDown(e){handleDown(e,'resize')}
function replaceHeroPhoto(){
 if(heroIndex===null){uploadPhotos();return}
 replaceMode=true;
 photoInput.click()
}
function editTextLayer(id){
 selectLayer(id,false);
 const input=id==='titleLayer'?titleInput:subtitleInput;
 input.focus();input.select()
}
function updateText(){titleLayer.textContent=titleInput.value;subtitleLayer.textContent=subtitleInput.value}
function setZoom(v){zoom=v;canvasWrap.style.transform=`scale(${zoom/100})`;updateStatusBar()}
function updateStatusBar(){if(!document.getElementById('sbCanvas'))return;sbCanvas.textContent='1080 × 1920';sbZoom.textContent=zoom+'%';sbSelected.textContent=currentLayer()?currentLayer().name:'None';sbLayers.textContent=layerData.length;sbPhotos.textContent=photos.length}

/* ---- Export: real PNG, drawn manually onto a canvas (no external dependency) ---- */
function exportFilename(){
 const raw=(FactoryManager.active?FactoryManager.active[1]:'OCF_Poster');
 const name=raw.replace(/[^a-z0-9]+/gi,'_');
 const d=new Date();
 const pad=n=>String(n).padStart(2,'0');
 const stamp=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
 return `${name}_${stamp}.png`
}
function wrapLines(ctx,text,maxWidth){
 const words=text.split(/\s+/).filter(Boolean);
 const lines=[];let cur='';
 words.forEach(w=>{
  const test=cur?cur+' '+w:w;
  if(ctx.measureText(test).width>maxWidth&&cur){lines.push(cur);cur=w}
  else cur=test
 });
 if(cur)lines.push(cur);
 return lines.length?lines:['']
}
function drawHero(ctx,scale){
 const l=layerData.find(x=>x.id==='heroLayer');
 if(!hero.src||l.hidden)return;
 const frame=getRect('heroLayer');
 ctx.save();
 const fcx=(frame.x+frame.w/2)*scale,fcy=(frame.y+frame.h/2)*scale;
 ctx.translate(fcx,fcy);
 ctx.rotate((l.rotation||0)*Math.PI/180);
 ctx.globalAlpha=l.opacity!=null?l.opacity:1;
 ctx.beginPath();
 ctx.rect(-frame.w*scale/2,-frame.h*scale/2,frame.w*scale,frame.h*scale);
 ctx.clip();
 const ix=-frame.w*scale/2+hero.x*scale,iy=-frame.h*scale/2+hero.y*scale;
 ctx.drawImage(heroImg,ix,iy,hero.w*scale,hero.h*scale);
 ctx.restore()
}
function drawGradientOverlay(ctx,scale){
 const w=420*scale,h=746*scale,gh=h*0.48;
 const grad=ctx.createLinearGradient(0,h-gh,0,h);
 grad.addColorStop(0,'rgba(16,42,67,0)');
 grad.addColorStop(0.33,'rgba(16,42,67,.35)');
 grad.addColorStop(0.67,'rgba(16,42,67,.78)');
 grad.addColorStop(1,'rgba(16,42,67,1)');
 ctx.fillStyle=grad;
 ctx.fillRect(0,h-gh,w,gh)
}
function drawTextLayer(ctx,scale,id){
 const l=layerData.find(x=>x.id===id);
 if(l.hidden)return;
 const frame=getRect(id);
 const text=(id==='titleLayer'?titleInput.value:subtitleInput.value)||'';
 if(!text.trim())return;
 const isTitle=id==='titleLayer';
 const fontSize=(isTitle?30:16)*scale;
 const fontWeight=isTitle?900:700;
 const color=isTitle?'#ffffff':'#dce7ff';
 ctx.save();
 const cx=(frame.x+frame.w/2)*scale,cy=(frame.y+frame.h/2)*scale;
 ctx.translate(cx,cy);
 ctx.rotate((l.rotation||0)*Math.PI/180);
 ctx.globalAlpha=l.opacity!=null?l.opacity:1;
 ctx.fillStyle=color;
 ctx.font=`${fontWeight} ${fontSize}px Arial`;
 ctx.textBaseline='top';ctx.textAlign='left';
 const lines=wrapLines(ctx,text,frame.w*scale);
 const lineHeight=fontSize*1.15;
 const startY=-frame.h*scale/2;
 lines.forEach((ln,i)=>ctx.fillText(ln,-frame.w*scale/2,startY+i*lineHeight));
 ctx.restore()
}
function downloadCanvasAsPNG(cvs,filename){
 cvs.toBlob(blob=>{
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),2000)
 },'image/png')
}
function exportPNG(){
 const EXPORT_W=1080,EXPORT_H=1920,SCALE=EXPORT_W/420;
 const cvs=document.createElement('canvas');
 cvs.width=EXPORT_W;cvs.height=EXPORT_H;
 const ctx=cvs.getContext('2d');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,EXPORT_W,EXPORT_H);
 layerData.slice().sort((a,b)=>(a.z||0)-(b.z||0)).forEach(l=>{
  if(l.hidden)return;
  if(l.id==='heroLayer'){drawHero(ctx,SCALE);drawGradientOverlay(ctx,SCALE)}
  else if(l.id==='titleLayer'||l.id==='subtitleLayer')drawTextLayer(ctx,SCALE,l.id)
  /* support slots intentionally not drawn yet - auto-layout phase only, export not in scope */
 });
 downloadCanvasAsPNG(cvs,exportFilename())
}

window.addEventListener('DOMContentLoaded',()=>{ScreenRouter.init();FactoryManager.render();markPass();renderQueue();setupDropZone();renderLayers();selectLayer('heroLayer',false);updateStatusBar()})
