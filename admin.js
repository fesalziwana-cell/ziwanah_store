const SUPABASE_URL = "https://yafgyjhscrcezmhdkclm.supabase.co";
const SUPABASE_ANON_KEY = "ضع المفتاح هنا";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("خطأ في تسجيل الدخول");
    return;
  }

  document.getElementById("adminPanel").style.display = "block";
  loadProducts();
}
async function addProduct() {
  const name = document.getElementById("pname").value;
  const category = document.getElementById("pcategory").value;
  const price = document.getElementById("pprice").value;
  const description = document.getElementById("pdesc").value;
  const image = document.getElementById("pimage").value;

  const { error } = await supabase.from("products").insert([
    { name, category, price, description, image }
  ]);

  if (error) {
    alert("خطأ في الإضافة");
    return;
  }

  alert("تمت الإضافة بنجاح");
  loadProducts();
}
async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  const container = document.getElementById("productsList");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div>
        <b>${p.name}</b> - ${p.price}
        <button onclick="deleteProduct(${p.id})">حذف</button>
        <button onclick="editProduct(${p.id})">تعديل</button>
      </div>
    `;
  });
}
async function deleteProduct(id) {
  await supabase.from("products").delete().eq("id", id);
  loadProducts();
}
