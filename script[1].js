const productsEl=document.querySelector('#products');
const dialog=document.querySelector('#orderDialog');
const form=document.querySelector('#orderForm');
const statusEl=document.querySelector('#status');
document.querySelector('#year').textContent=new Date().getFullYear();
let products=[];
async function loadProducts(){
  try{
    const r=await fetch('/.netlify/functions/products');
    if(!r.ok) throw new Error('catalogue indisponible');
    products=await r.json();
  }catch(e){
    products=[
      {sku:'FC26',name:'FC 26',description:'Jeu vidéo — disponibilité à configurer',price_label:'Prix à définir'},
      {sku:'PSN',name:'Carte PSN',description:'Code PlayStation — plusieurs valeurs',price_label:'Prix à définir'},
      {sku:'XBOX',name:'Carte Xbox',description:'Code Xbox — plusieurs valeurs',price_label:'Prix à définir'},
      {sku:'VBUCKS',name:'V-Bucks',description:'Crédits Fortnite — plusieurs valeurs',price_label:'Prix à définir'},
      {sku:'ROBUX',name:'Robux',description:'Crédits Roblox — plusieurs valeurs',price_label:'Prix à définir'}
    ];
    statusEl.textContent='Catalogue de démonstration';
  }
  render();
}
function render(){
  productsEl.innerHTML='';
  products.forEach(p=>{
    const card=document.createElement('article');card.className='product';
    const tag=document.createElement('span');tag.className='tag';tag.textContent='DIGIT STORE';
    const h=document.createElement('h3');h.textContent=p.name;
    const desc=document.createElement('p');desc.textContent=p.description||'Produit numérique';
    const price=document.createElement('p');price.textContent=p.price_label||'Prix communiqué avant paiement';
    const btn=document.createElement('button');btn.textContent='Commander';btn.disabled=p.available===false;
    btn.addEventListener('click',()=>openOrder(p));
    card.append(tag,h,desc,price,btn);productsEl.append(card);
  });
  if(!products.length) statusEl.textContent='Aucun produit disponible pour le moment.';
}
function openOrder(p){
  document.querySelector('#selectedName').textContent=p.name;
  document.querySelector('#sku').value=p.sku;
  document.querySelector('#orderMessage').textContent='Mode démo : aucun paiement réel ne sera lancé.';
  dialog.showModal();
}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const button=document.querySelector('#payButton');
  button.disabled=true;
  try{
    const r=await fetch('/.netlify/functions/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:document.querySelector('#sku').value,email:document.querySelector('#email').value.trim()})});
    const data=await r.json();
    document.querySelector('#orderMessage').textContent=data.message||'Demande reçue.';
  }catch(e){document.querySelector('#orderMessage').textContent='Impossible de traiter la demande. Réessayez plus tard.'}
  finally{button.disabled=false}
});
loadProducts();
