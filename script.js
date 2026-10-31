// Produits fictifs pour tester la boutique. Remplace-les par des offres que tu es autorisé à vendre.
const products = [
  {id:1,name:"Aventure Galaxy",platform:"PC",category:"Aventure",price:5000,icon:"🚀",colors:["#5431a0","#17112c"]},
  {id:2,name:"Football Arena",platform:"PlayStation",category:"Sport",price:7500,icon:"⚽",colors:["#176e62","#102c36"]},
  {id:3,name:"Racing Velocity",platform:"Xbox",category:"Course",price:6500,icon:"🏎️",colors:["#a64d32","#35162d"]},
  {id:4,name:"Mystery Quest",platform:"PC",category:"Aventure",price:4000,icon:"🗝️",colors:["#72542a","#21162c"]},
  {id:5,name:"Battle Tactics",platform:"Mobile",category:"Stratégie",price:2500,icon:"🛡️",colors:["#28518a","#15152e"]},
  {id:6,name:"Pixel World",platform:"Mobile",category:"Créativité",price:2000,icon:"👾",colors:["#9b477e","#321c50"]},
  {id:7,name:"Shadow Mission",platform:"PlayStation",category:"Action",price:8000,icon:"🌌",colors:["#424078","#151020"]},
  {id:8,name:"Speed Legends",platform:"Xbox",category:"Course",price:6000,icon:"🏁",colors:["#8d3f4e","#24172e"]}
];
let cart = [];
let activeFilter = "Tous";
const money = n => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const panel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

function renderProducts(){
  const term = document.getElementById("search").value.toLowerCase().trim();
  const shown = products.filter(p => (activeFilter === "Tous" || p.platform === activeFilter) && (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
  productsEl.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="cover" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
        <span class="platform-tag">${p.platform.toUpperCase()}</span><span class="cover-icon">${p.icon}</span>
      </div>
      <div class="product-info"><h3>${p.name}</h3><p>${p.category} · Produit exemple</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+ Ajouter</button></div>
      </div>
    </article>`).join("");
  document.getElementById("empty").classList.toggle("hidden", shown.length !== 0);
}
function addToCart(id){
  const found = cart.find(item => item.id === id);
  if(found) found.qty++; else cart.push({id,qty:1});
  renderCart(); showToast("Article ajouté au panier !");
}
function changeQty(id,delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}
function renderCart(){
  const count = cart.reduce((s,x)=>s+x.qty,0);
  const total = cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  cartItems.innerHTML = cart.length ? cart.map(item => {
    const p = products.find(x=>x.id===item.id);
    return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} · ${p.platform}</small></div><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div>`;
  }).join("") : '<p class="empty">Ton panier est vide.</p>';
}
function openCart(){panel.classList.add("open");overlay.classList.remove("hidden")}
function closeCart(){panel.classList.remove("open");overlay.classList.add("hidden")}
let toastTimer;
function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
document.getElementById("filters").addEventListener("click",e=>{
  const button=e.target.closest("[data-filter]");if(!button)return;
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts();
});
document.getElementById("search").addEventListener("input",renderProducts);
productsEl.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add))});
cartItems.addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(b)changeQty(Number(b.dataset.qty),Number(b.dataset.delta))});
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){showToast("Ton panier est vide.");return;}
  alert("Commande de démonstration uniquement. Aucun paiement ni achat réel n'est effectué. Les produits et les prix sont des exemples.");
});
renderProducts();renderCart();
