// Constantes pour les éléments du formulaire
const formLogin = document.querySelector("form");
const mailInput = document.querySelector("#login_email");
const passwordInput = document.querySelector("#password");

// Écouteur d'événement pour la soumission du formulaire
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  await login(); // Appel de la fonction de connexion
});

// Fonction asynchrone pour gérer la connexion
const login = async () => {
  try {
    // Récupération des informations du formulaire
    const userInfo = {
      email: mailInput.value, //récupérer les info du formulaire
      password: passwordInput.value //récupérer les info du formulaire
    };

    // Envoi des données de connexion au serveur
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",  //Elle envoie une requête POST au serveur local
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfo)  
    });

    // Traitement de la réponse du serveur
    const resultat = await response.json();  

    // Sélection des éléments d'affichage
    const error_p = document.querySelector('.error');
    const success_p = document.querySelector(".success");

    if (resultat.token) {
      // Authentification réussie
      sessionStorage.setItem("Token", resultat.token);  
      success_p.innerHTML = "Authentification réussie";

      // Redirection vers la page d'accueil après 1,5 seconde
      setTimeout(() => {
        success_p.innerHTML = "";
        window.location.href = "index.html";
      }, 1500);
    } else {
      // Authentification échouée
      error_p.innerHTML = "Authentification échouée";

      // Redirection vers la page de connexion après 1,5 seconde
      setTimeout(() => {
        error_p.innerHTML = "";
        window.location.href = "login.html";
      }, 1500);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
  }
};