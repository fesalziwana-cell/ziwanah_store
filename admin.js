const KEY="ziwanahProducts";
const getProducts=()=>JSON.parse(localStorage.getItem(KEY)||"null")||[];
const save=p=>localStorage.setItem(KEY,JSON.stringify(p));
const $=id=>document.getElementById(id);
function isLogged(){return sessionStorage.getItem("ziwanahAdmin")==="1"}
function showState(){ $("loginBox").classList.toggle("hidden",isLogged()); $("dashboard").classList.toggle("hidden",!isLogged()); if(isLogged())renderAdmin();}
$("loginBtn").onclick=()=>{if($("adminUser").value==="admin"&&$("adminPass").value==="123456"){sessionStorage.setItem("ziwanahAdmin","1");$("loginMsg").textContent="";showState()}else $("loginMsg").textContent="بيانات الدخول غير صحيحة."};
$("logoutBtn").onclick=()=>{sessionStorage.removeItem("ziwanahAdmin");showState()};
$("cancelEdit").onclick=clearForm;
function clearForm(){$("productForm").reset();$("editId").value="";$("formTitle").textContent="إضافة منتج"}
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const products=getProducts(), id=$("editId").value;
 let image=id!==""?(products[Number(id)].image||""):"";
 const file=$("pImage").files[0];
 if(file)image=await readFile(file);
 const product={name:$("pName").value.trim(),category:$("pCategory").value.trim(),price:$("pPrice").value.trim()||"السعر عند الاستفسار",description:$("pDescription").value.trim(),image};
 if(!product.name||!product.category)return alert("أدخل اسم المنتج والقسم");
 if(id==="")products.push(product);else products[Number(id)]=product;
 save(products);clearForm();renderAdmin();alert("تم حفظ المنتج.");
});
function readFile(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function renderAdmin(){
 const q=($("adminSearch").value||"").toLowerCase(), products=getProducts();
 const list=products.map((p,i)=>({...p,i})).filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q));
 $("adminProducts").innerHTML=list.length?list.map(p=>`<div class="admin-item"><div class="thumb">${p.image?`<img src="${p.image}" alt="${p.name}">`:"<div style='display:grid;place-items:center;height:100%;font-size:55px'>📦</div>"}</div><div class="body"><h3>${p.name}</h3><p>${p.category}</p><p>${p.price}</p><div class="admin-actions"><button class="btn outline small" onclick="editProduct(${p.i})">✏️ تعديل</button><button class="btn danger small" onclick="deleteProduct(${p.i})">🗑️ حذف</button></div></div></div>`).join(""):"<p>لا توجد منتجات.</p>";
}
window.editProduct=i=>{const p=getProducts()[i];$("editId").value=i;$("pName").value=p.name;$("pCategory").value=p.category;$("pPrice").value=p.price;$("pDescription").value=p.description||"";$("pImage").value="";$("formTitle").textContent="تعديل المنتج";window.scrollTo({top:0,behavior:"smooth"})};
window.deleteProduct=i=>{if(!confirm("حذف هذا المنتج؟"))return;const p=getProducts();p.splice(i,1);save(p);renderAdmin()};
$("adminSearch").addEventListener("input",renderAdmin);
$("clearProducts").onclick=()=>{if(confirm("سيتم حذف كل المنتجات. هل أنت متأكد؟")){save([]);renderAdmin()}};
showState();