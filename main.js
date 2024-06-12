// Düzenleme Seçenekleri
let editElement; // Düzenleme yapılan öğeyi temsil eder.
let editFlag = false; // düzenleme modunda olup olmadıgını belirtir.
let editID = ""; //Düzenleme yapılan öğenin benzersiz kimliği

//Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form"); // form yapısını aldık ve form'a atadık
const grocery = document.getElementById("grocery"); //inputu js cektik ve grocery değişkenine atadık
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

// Fonksiyonlar

//Ekrana bildirim bastırıcak fonksiyondur
const displayAlert = (text, action) => {
  alert.textContent = text; // alert etiketinin içerisini dışarıdan gönderilen parametre ile degistirdik
  alert.classList.add(`alert-${action}`); // p etiketine dinamik class ekledik

  setTimeout(() => {
    alert.textContent = ""; //P etiketinin içerisini boş stringe cevirdik
    alert.classList.remove(`alert-${action}`); //Eklediğimiz classı kaldırdık
  }, 2000);
};

// Varsayılan degerlere döndürür.
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const addItem = (e) => {
  e.preventDefault(); // Forumun gönderilme olayında sayfanın yenilenmesinini engeller
  const value = grocery.value; // grocery(input) değerini value atadık
  const id = new Date().getTime().toString();

  //eğer inputun içerisi boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir article öğesi oluşturdu.
    let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur.
    attr.value = id;
    element.setAttributeNode(attr); // oluşturdugumuz ıd'yi data özellik olarak set ettik
    element.classList.add("grocery-item"); //article etiketine class ekledik

    element.innerHTML = `
    <p class="item">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
    `;

    //Butonlara ulaşıp olaydinleyici  eklenildi dışarıdan ulaşıp fonksiyon çalıştırıldı
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); // oluşturdugumuz article etiketini html'e ekledik

    displayAlert("Başarıyla eklenildi", "success");
    //Varsayılan değerlere döndürücek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value; //Güncellicegimiz elemanın içerigini değiştirdik
    displayAlert("Basarıyla Degistirildi", "success");

    editLocalStorage(editID, value);
    setBackToDefault();
  }
};

//Silme butonuna tıklanıldıgında çalışır
const deleteItem = (e) => {
  //Target kullanarak seçtiğimiz etiketin kapsayıcılarına ulaştık .
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element); //Bulduğumuz "article" etiketini list alanı içerisinden kaldırdık.
  displayAlert("Başarıyla kaldırıldı", "danger"); //Ekrana gönderdigimiz parametrelere göre bildirim bastırır.

  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //Düzenleme yapacagımız etiketi seçtik
  grocery.value = editElement.innerText; //Düzenlediğimiz etiketin içeriğini inputa aktardık.
  editFlag = true; //düzenleme modu aktifleştirdik.
  editID = element.dataset.id; //Düzenlenen öğenin kimliğini gönderdik
  submitBtn.textContent = "Düzenle"; //Düzenle butonuna tıklanıldıgında ekle butonu düzenle olarak değişsin.
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    //Foreach ile dizi içerisinde bulunan hher bir elemanı dönüp her bir ögeyi listeden kaldirdik
    items.forEach((item) => list.removeChild(item));
  }

  displayAlert("liste boş", "danger");
  localStorage.removeItem("list");
};

//Yerel depoya ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);

  localStorage.setItem("list", JSON.stringify(items));
};
//Yerel depodan ögeleri alma işlemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

const createListItem = (id, value) => {
  const element = document.createElement("article"); // Yeni bir article öğesi oluşturdu.
  let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur.
  attr.value = id;
  element.setAttributeNode(attr); // oluşturdugumuz ıd'yi data özellik olarak set ettik
  element.classList.add("grocery-item"); //article etiketine class ekledik

  element.innerHTML = `
  <p class="item">${value}</p>
          <div class="btn-container">
            <button type="button" class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
  `;

  //Butonlara ulaşıp olaydinleyici  eklenildi dışarıdan ulaşıp fonksiyon çalıştırıldı
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  list.appendChild(element); // oluşturdugumuz article etiketini html'e ekledik
};

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => createListItem(item.id, item.value));
  }
};

// OLAY İZLEYİCİLERİ

form.addEventListener("submit", addItem); // Form gönderildiğinde addItem Fonksiyonu çalışır

clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded", setupItems);
