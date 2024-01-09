// Constante pour l'URL de l'API
const apiUrl_works = "http://localhost:5678/api/works";
const apiUrl_categories = "http://localhost:5678/api/categories";
const galleryEl = document.querySelector(".gallery"); //galleryEl: Une variable qui récupère l'élément HTML avec la classe "gallery", où les données seront affichées.
const selectEl = document.querySelector(".select");
const galleryAdmin = document.querySelector(".modal-gallery");
const ButtonModifierDiv = document.querySelector(".edit-position");
const optionEl = document.querySelector(".js-categoryId");
const previousModalPic = document.getElementById("previous-modal");
const modalWindow1 = document.querySelector(".modal-window");
const modalWindow2 = document.querySelector(".modal-window2");
const addpicBtn = document.querySelector(".addModalpic");
const imageInput = document.getElementById('photo');
const titleInput = document.querySelector(".form-title input");
const formOptions = document.querySelector(".form-options select");
const formModal = document.querySelector(".modal-form");
const labelImg = document.querySelector('.label-img'); // Élément pour afficher l'image sélectionnée

let data_works = []; //data: Un tableau vide qui sera utilisé pour stocker les données récupérées depuis l'API.
let data_categories = [];

formModal.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  await addImgViaModal (); // Appel de la fonction de connexion
});


async function refreshDataAndRender() {
  try {
    const response_works = await fetch(apiUrl_works);
    data_works = await response_works.json();
    renderDataWorks(data_works);
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
  }
}

// Fonction asynchrone pour créer le bouton modfier si on a le token 
async function fetchData() {
  try {
    if (sessionStorage.getItem("Token")){
      const ButtonModifier = document.createElement("button");
      ButtonModifier.innerHTML = "Modifier";
      ButtonModifier.id = "open-modal";
      ButtonModifier.className = "fa-solid fa-trash-can";

      const loginEl = document.querySelector(".remplacer");
      loginEl.innerHTML = "logout";
      loginEl.addEventListener("click", () => {
        // Supprime le jeton d'authentification de la session et redirige vers la page d'accueil
        sessionStorage.removeItem("Token");
        window.location.href = "index.html";
      });

      ButtonModifier.addEventListener("click", function () {  // un listener pour ouvrir la bonne modale 
      modalContainer.style.display = "block"; // Ouvrir la modale
      modalWindow1.style.display = "block";
      modalWindow2.style.display = "none";
      });
      ButtonModifierDiv.appendChild(ButtonModifier); //Créer le bouton modifier dans le html 
    }

    // récupérer les données de l'API et les afficher 

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
    const newOption = document.createElement("option"); // Crée un nouvel élément 'option' pour le selecteur
    newOption.innerText = item.name; // Définit le texte interne de l'option avec la propriété 'name' de l'élément actuel
    newOption.value = item.id; // // Définit la valeur de l'attribut 'value' de l'option avec la propriété 'id' de l'élément actuel
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

    newFigure.id = `workFigure_${item.id}`;
    newImg.id = `workImage_${item.id}`;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigCaption);
    galleryEl.appendChild(newFigure);

    const newImgAdmin = document.createElement("figureAdmin");
    const deleteButton = document.createElement("buttonAdmin");
    const newImgAdmin2 = document.createElement("img");
    newImgAdmin2.className = "imgAdm";

    newImgAdmin.id = `adminFigure_${item.id}`;

    newImgAdmin2.src = item.imageUrl;
    deleteButton.className = "fa-solid fa-trash-can";
    deleteButton.id = `deleteButton_${item.id}`;

    // Ajouter un listener au button 
    deleteButton.addEventListener('click', () => {
      deleteImg(item.id);
      // Supprimer l'élément du DOM après la suppression réussie
      const adminFigure = document.getElementById(`adminFigure_${item.id}`);
      adminFigure.remove();
    })
    newImgAdmin.appendChild(newImgAdmin2);
    newImgAdmin.appendChild(deleteButton);
    galleryAdmin.appendChild(newImgAdmin);


  });
}

async function deleteImg (id) {
  const token = sessionStorage.getItem('Token')
  try {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",  //Elle envoie une requête DELETE au serveur local
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      }, 
    });

    if (response.ok) {
      // Rafraîchir les données et le rendu après la suppression
      await refreshDataAndRender();
      modalContainer.style.display = "none";
    } else {
      console.error(`Erreur lors de la suppression de l'image avec l'ID ${id}.`);
    }
  } catch (error) {
    console.error('Erreur de communication avec l\'API:', error);
  }
}


var currentButton = null;

function changeColor(button) {
  if (currentButton !== null) { //Débute une condition vérifiant si currentButton n'est pas null, c'est-à-dire s'il y a déjà un bouton sélectionné.
    currentButton.classList.remove("selected"); //Retire la classe CSS "selected" du bouton actuellement sélectionné.
    currentButton.disabled = false; // Réactiver l'ancien bouton en désactivant sa propriété disabled. Cela permet de rétablir la capacité du bouton à réagir aux événements.
  }

  button.classList.add("selected"); //Ajoute la classe CSS "selected" au nouveau bouton, le mettant en surbrillance ou lui appliquant un style particulier.
  button.disabled = true; // Désactiver le nouveau bouton
  currentButton = button; //Met à jour la variable currentButton avec le nouveau bouton, maintenant sélectionné.
}

// Fonction qui créer les boutons de filtres et qui les filtres 
function renderDataCategories(data) {

  data.forEach(item_categories => {
    const ButtonCat = document.createElement("button");
    ButtonCat.textContent = item_categories.name; //Définit le texte du bouton comme le nom de la catégorie de l'élément actuel.
    ButtonCat.id = item_categories.name; //Attribue l'ID du bouton comme le nom de la catégorie de l'élément actuel.
    ButtonCat.className = "select--btn"; //Ajoute une classe CSS au bouton.
    ButtonCat.addEventListener('click', () => {
      const filteredData = data_works.filter(item => item.category.name === item_categories.name); //Filtrage des données (data_works) en fonction de la catégorie du bouton cliqué.
      renderDataWorks(filteredData); // Appelle une fonction renderDataWorks pour afficher les données filtrées.
      changeColor(ButtonCat); //Appelle une fonction changeColor pour changer la couleur du bouton.
    })
    selectEl.appendChild(ButtonCat); // lie la const (qui connecte le HTML) à la const qui créer les Buttons avec l'API 
  })
}
const allButton = document.getElementById("all"); //Il y a quatre éléments HTML avec les IDs "all", "obj", "appart" et "hot-restau" qui servent de filtres pour la galerie.

allButton.addEventListener('click', () => {   // Lorsque l'utilisateur clique sur le button all, un événement de clic déclenche une fonction qui filtre les données en fonction de la catégorie, puis appelle renderData pour afficher les données filtrées.

  renderDataWorks(data_works); 
  changeColor(allButton);
});


  async function addImgViaModal () {
    console.log("babla");
  const formData = new FormData();
  formData.append('image', imageInput.files[0]); //Ajoute le premier fichier sélectionné dans l'élément imageInput à l'objet FormData avec la clé 'image'.
  formData.append('title', titleInput.value); //Ajoute la valeur de l'élément titleInput à l'objet FormData avec la clé 'title'.
  formData.append('category', formOptions.value); //joute la valeur de l'élément formOptions à l'objet FormData avec la clé 'category'.

    const token = sessionStorage.getItem("Token") //Récupère le jeton d'authentification stocké dans la session storage et le stocke dans la variable token.

  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",  //Elle envoie une requête au serveur local
      headers: {
         
        "Authorization": `Bearer ${token}`,
      }, 
      body: formData, //Inclut les données du formulaire dans le corps de la requête.
    });
    if (response.ok) {
      const data = await response.json(); //Convertit la réponse JSON en objet JavaScript et le stocke dans la variable data.
      // Afficher l'image sélectionnée à la place des éléments du formulaire
      const imageDisplay = document.getElementById('js-modal-form'); // Remplacez 'imageDisplay' par l'ID réel de l'élément d'affichage de l'image
      imageDisplay.src = data.imageUrl; // Assurez-vous que votre API retourne l'URL de l'image après le téléchargement
      
      // Rafraîchir les données et le rendu après l'ajout
      await refreshDataAndRender();
      // Fermer la modale après l'ajout
      modalContainer.style.display = "none";
      imageInput.value = ""; // Efface la valeur du champ de fichier
      titleInput.value = ""; // Efface la valeur du champ de titre
      formOptions.selectedIndex = 0; // Réinitialise la sélection du champ de catégorie à la première option
    
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
  imgElement.src = URL.createObjectURL(this.files[0]); // afficher une prévisualisation instantanée de l'image sélectionnée
  imgElement.style.maxWidth = '35%';
  imgElement.style.position = 'relative';
  imgElement.style.left = '33%';
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
  modalWindow1.style.display = "block";
  modalWindow2.style.display = "none";
})

addpicBtn.addEventListener("click", () => {
  modalWindow1.style.display = "none";
  modalWindow2.style.display = "block";
})

// Écouteur d'événement pour le chargement du document
document.addEventListener("DOMContentLoaded", () => {  //Lorsque le document HTML est entièrement chargé, l'événement "DOMContentLoaded" est déclenché.
  fetchData(); //Lors de cet événement, la fonction fetchData est appelée pour récupérer les données depuis l'API et les afficher dans la galerie.
  
});


// Récupérez le token 
const userToken = sessionStorage.getItem('Token'); //Récupère le jeton d'utilisateur stocké dans la session storage et le stocke dans la variable userToken.

// Vérifiez si l'utilisateur est connecté en utilisant le token (ajustez cela en fonction de votre méthode d'authentification)
if (userToken) {
    // Si l'utilisateur est connecté, changez la propriété display à "block"
    const asideElement = document.querySelector('.admin__rod ');
    
    if (asideElement) {
     
        asideElement.style.display = 'flex';
    }
}

