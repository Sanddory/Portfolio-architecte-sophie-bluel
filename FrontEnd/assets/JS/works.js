// Constante pour l'URL de l'API
const apiUrl_works = "http://localhost:5678/api/works";
const apiUrl_categories = "http://localhost:5678/api/categories";
const galleryEl = document.querySelector(".gallery"); //galleryEl: Une variable qui récupère l'élément HTML avec la classe "gallery", où les données seront affichées.
const selectEl = document.querySelector(".select");
const galleryAdmin = document.querySelector(".modal-gallery");
const ButtonModifierDiv = document.querySelector(".edit-position");
const optionEl = document.querySelector(".js-categoryId");
const previousModalPic = document.getElementById("previous-modal");
const modalWrapper1 = document.querySelector(".modal-wrapper");
const modalWrapper2 = document.querySelector(".modal-wrapper2");
const addpicBtn = document.querySelector(".addModalpic");


const imageInput = document.getElementById('photo');
const titleInput = document.querySelector(".form-title input");
const formOptions = document.querySelector(".form-options select");

const labelImg = document.querySelector('.label-img'); // Élément pour afficher l'image sélectionnée

let data_works = []; //data: Un tableau vide qui sera utilisé pour stocker les données récupérées depuis l'API.
let data_categories = [];



// Fonction asynchrone pour créer le bouton modfier si on a le token 
async function fetchData() {
  try {
    if (sessionStorage.getItem("Token")){
      const ButtonModifier = document.createElement("button");
      ButtonModifier.innerHTML = "Modifier";
      ButtonModifier.id = "open-modal";
      ButtonModifier.className = "fa-solid fa-trash-can";

      ButtonModifier.addEventListener("click", function () {  // un listener pour ouvrir la bonne modale 
      modalContainer.style.display = "block"; // Ouvrir la modale
      modalWrapper1.style.display = "block";
      modalWrapper2.style.display = "none";
      });
      ButtonModifierDiv.appendChild(ButtonModifier); //Créer le bouton modifier dans le html 
    }

    // Fonction pour récupérer les données de l'API et les afficher 

    const response_works = await fetch(apiUrl_works); //const qui prend les données des images de l'api
    const response_categories = await fetch(apiUrl_categories); //const qui prend les données des categories de l'api
    data_works = await response_works.json(); //En cas de succès, la réponse est convertie en JSON en utilisant response.json(), puis les données sont stockées dans la variable data_works.
    data_categories = await response_categories.json();
    renderDataWorks(data_works); //La fonction renderDataWork est appelée pour afficher les données dans la galerie.
    renderDataCategories(data_categories); //Fonction qui créer les boutons de filtres et qui les filtres
    renderOption(data_categories); //afficher les catégories dans la modale
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

// Fonction pour afficher les catégories dans la modale
function renderOption(data) {
  data.forEach(item => {
    const newOption = document.createElement("option");
    newOption.innerText = item.name;
    newOption.value = item.id;
    optionEl.appendChild(newOption);
  })
}

// Fonction pour afficher les données dans la galerie et la galerie ADMIN

function renderDataWorks(data) { //Cette fonction prend un tableau de données en argument et affiche ces données dans la galerie.
  galleryEl.innerHTML = ""; //Elle commence par vider le contenu de l'élément HTML avec la classe "gallery"
  galleryAdmin.innerHTML = "";
  data.forEach(item => {
    const newFigure = document.createElement("figure");
    const newImg = document.createElement("img"); //Ensuite, elle itère sur chaque élément du tableau de données, crée un élément figure avec une image et une légende, puis ajoute cet élément à la galerie.
    newImg.src = item.imageUrl;
    const newFigCaption = document.createElement("figcaption");
    newFigCaption.textContent = item.title;
    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);
    galleryEl.appendChild(newFigure);

    const newImgAdmin = document.createElement("figureAdmin");
    const deleteButton = document.createElement("buttonAdmin");
    const newImgAdmin2 = document.createElement("img");
    newImgAdmin2.className = "imgAdm";
    newImgAdmin2.src = item.imageUrl;
    deleteButton.className = "fa-solid fa-trash-can";
    deleteButton.id = item.id;

    // Ajouter un listener au button 
    deleteButton.addEventListener('click', () => {
      deleteImg(item.id);
    })
    newImgAdmin.appendChild(newImgAdmin2);
    newImgAdmin.appendChild(deleteButton);
    galleryAdmin.appendChild(newImgAdmin);


  });
}

async function deleteImg (id) {
  const token = sessionStorage.getItem('Token')
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",  //Elle envoie une requête DELETE au serveur local
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${tokenSession}` 
      }, 
    });
}

// Fonction qui créer les boutons de filtres et qui les filtres 
function renderDataCategories(data) {

  data.forEach(item_categories => {
    const ButtonCat = document.createElement("button");
    ButtonCat.textContent = item_categories.name;
    ButtonCat.id = item_categories.name;
    ButtonCat.className = "select--btn";
    ButtonCat.addEventListener('click', () => {
      const filteredData = data_works.filter(item => item.category.name === item_categories.name);
      renderDataWorks(filteredData); 
    })
    selectEl.appendChild(ButtonCat); // lie la const (qui connecte le HTML) à la const qui créer les Buttons avec l'API 
  })
}
const allEl = document.getElementById("all"); //Il y a quatre éléments HTML avec les IDs "all", "obj", "appart" et "hot-restau" qui servent de filtres pour la galerie.

allEl.addEventListener('click', () => {   // Lorsque l'utilisateur clique sur l'un de ces éléments, un événement de clic déclenche une fonction qui filtre les données en fonction de la catégorie, puis appelle renderData pour afficher les données filtrées.
  renderDataWorks(data_works); 
});



// Sélectionnez le formulaire
const modalForm = document.getElementById('submit-btn');

// Ajoutez un gestionnaire d'événements pour le formulaire
modalForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Appelle la fonction pour ajouter l'image à l'API
    addImgViaModal();
});

  async function addImgViaModal () {

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('category', formOptions.value);

  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",  //Elle envoie une requête au serveur local
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`,
      }, 
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      // Afficher l'image sélectionnée à la place des éléments du formulaire
      
    } else {
      console.error('Erreur lors du téléversement de l\'image à l\'API.');
    }
  } catch (error) {
    console.error('Erreur de communication avec l\'API:', error);
  }
}


// Ajoutez un nouveau listener pour le champ de fichier
document.getElementById('photo').addEventListener('change', function () {
  // Afficher l'image sélectionnée à la place des éléments du formulaire
  labelImg.innerHTML = ""; // Supprime les éléments existants
  const imgElement = document.createElement('img');
  imgElement.src = URL.createObjectURL(this.files[0]);
  imgElement.style.maxWidth = '50%';
  labelImg.appendChild(imgElement);
});





// fermer la Modale 

const modalContainer = document.querySelector(".modal-container");
const closeModal = document.getElementById("close-modal");
const closeModal2 = document.getElementById("close-modal2");

closeModal.addEventListener("click", function () {
  modalContainer.style.display = "none"; // Fermer la modale
  
});

closeModal2.addEventListener("click", function () {
  modalContainer.style.display = "none"; // Fermer la modale
  
});

previousModalPic.addEventListener("click", () => {
  modalWrapper1.style.display = "block";
  modalWrapper2.style.display = "none";
})

addpicBtn.addEventListener("click", () => {
  modalWrapper1.style.display = "none";
  modalWrapper2.style.display = "block";
})

// Écouteur d'événement pour le chargement du document
document.addEventListener("DOMContentLoaded", () => { //Lorsque le document HTML est entièrement chargé, l'événement "DOMContentLoaded" est déclenché.
  fetchData(); //Lors de cet événement, la fonction fetchData est appelée pour récupérer les données depuis l'API et les afficher dans la galerie.
});


