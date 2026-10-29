(() => {
 const sidebar=document.querySelector('.sidebar');
 const button=document.getElementById('btnContraerMenuLateral');
 if(!sidebar || !button)return;
 const root=document.documentElement;
 const usuario=sessionStorage.getItem('usuarioLogueado') || 'local';
 const clave=`corssen_menu_lateral_${usuario}`;
 function aplicar(contraido){
  root.dataset.menuLateral=contraido?'contraido':'expandido';
  button.setAttribute('aria-expanded',String(!contraido));
  button.setAttribute('aria-label',contraido?'Mostrar menú lateral':'Ocultar menú lateral');
  button.title=contraido?'Mostrar menú lateral':'Ocultar menú lateral';
  button.querySelector('.menu-toggle-icono').textContent=contraido?'☰':'‹';
  button.querySelector('.menu-toggle-texto').textContent=contraido?'Mostrar menú':'Ocultar menú';
  // Inert preserves role-based visibility while removing hidden links from keyboard navigation.
  [...sidebar.children].forEach(el=>{if(el!==button)el.inert=contraido && window.matchMedia('(min-width:1025px)').matches;});
 }
 let contraido=false;
 try {contraido=localStorage.getItem(clave)==='contraido';}catch(_){}
 aplicar(contraido);
 button.addEventListener('click',()=>{
  const nuevo=root.dataset.menuLateral!=='contraido';aplicar(nuevo);
  try {localStorage.setItem(clave,nuevo?'contraido':'expandido');}catch(_){}
 });
 window.matchMedia('(min-width:1025px)').addEventListener('change',()=>aplicar(root.dataset.menuLateral==='contraido'));
})();
