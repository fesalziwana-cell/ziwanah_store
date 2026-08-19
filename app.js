const SUPABASE_URL = "https://yafgyjhscrcezmhdkclm.supabase.co"; // حط الـ Project URL تبعك
const SUPABASE_ANON_KEY = "هنا تحط الـ anon key تبعك";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const defaultProducts=[
{name:"خلاط حمام",category:"الخلاطات",price:"السعر عند الاستفسار",description:"خلاط حمام بجودة ممتازة",image:""},
{name:"خلاط مطبخ",category:"الخلاطات",price:"السعر عند الاستفسار",description:"خلاط مطبخ بتصميم عصري",image:""},
{name:"خزان مياه",category:"الخزانات",price:"السعر عند الاستفسار",description:"خزانات مياه بمقاسات مختلفة",image:""},
{name:"وصلات PPR",category:"PPR",price:"السعر عند الاستفسار",description:"وصلات PPR للاستخدامات الصحية",image:""}
];
const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("خطأ في جلب المنتجات:", error);
    return [];
  }

  return data;
};

const saveProducts=p=>localStorage.setItem("ziwanahProducts",JSON.stringify(p));
function renderCategories(){
 const products=getProducts(), counts={};
 products.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
 const names=Object.keys(counts);
 const icons=["🚿","💧","🔧","🔩","🚽","🧰"];
 const grid=document.getElementById("categoryGrid");
 grid.innerHTML=names.map((n,i)=>`<div class="category-card" onclick="filterCategory('${n.replaceAll("'","\\'")}')"><b>${icons[i%icons.length]}</b><h3>${n}</h3><p>${counts[n]} منتج</p></div>`).join("");
 const select=document.getElementById("categoryFilter");
 select.innerHTML='<option value="">كل الأقسام</option>'+names.map(n=>`<option>${n}</option>`).join("");
}
function renderProducts(){
 const products=getProducts(), q=(document.getElementById("searchInput")?.value||"").toLowerCase(), c=document.getElementById("categoryFilter")?.value||"";
 const list=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q))&&(!c||p.category===c));
 const grid=document.getElementById("productsGrid");
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-image">${p.image?`<img src="${p.image}" alt="${p.name}">`:"<span style='font-size:55px'>📦</span>"}</div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.description||""}</p><div class="price">${p.price||"السعر عند الاستفسار"}</div></div></article>`).join(""):"<p>لا توجد منتجات مطابقة للبحث.</p>";
}
function filterCategory(c){document.getElementById("categoryFilter").value=c;renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});}
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("categoryFilter").addEventListener("change",renderProducts);
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
const phone=localStorage.getItem("ziwanahPhone")||"";
document.getElementById("phoneText").textContent=phone||"أضف رقم الهاتف من لوحة الإعدادات";
const wa=localStorage.getItem("ziwanahWhatsApp")||"";
if(wa)document.getElementById("whatsappBtn").href="https://wa.me/"+wa; else document.getElementById("whatsappBtn").style.display="none";
renderCategories();renderProducts();