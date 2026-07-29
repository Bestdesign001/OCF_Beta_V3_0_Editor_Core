
const ScreenRouter={current:null,screens:{},init(){this.screens={dashboard:document.getElementById('dashboardScreen'),workspace:document.getElementById('workspaceScreen')};this.showScreen('dashboard')},showScreen(name){Object.keys(this.screens).forEach(k=>{const s=this.screens[k];s.classList.toggle('active',k===name);s.setAttribute('aria-hidden',k===name?'false':'true')});this.current=name;updateStatusBar()}};
function showScreen(name){ScreenRouter.showScreen(name)}
