// Constantes pour les éléments du formulaire

const formLogin = document.querySelector("form");
//Recherche et sélectionne le premier élément de formulaire dans le document HTML.
const mailInput = document.querySelector("#login_email");
//Recherche et sélectionne l'élément avec l'ID "login_email" dans le document HTML, un champ d'entrée pour l'adresse e-mail.
const passwordInput = document.querySelector("#password");
//Recherche et sélectionne l'élément avec l'ID "password" dans le document HTML, un champ d'entrée pour le mot de passe.


// Écouteur d'événement pour la soumission du formulaire
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  await login(); // Appel de la fonction de connexion
});
//Ajoute un écouteur d'événement pour la soumission du formulaire. 
//Lorsque le formulaire est soumis, cela empêche son comportement par défaut,
//puis appelle la fonction asynchrone login().

// Fonction asynchrone pour gérer la connexion
const login = async () => {
  try {
    // Crée un objet userInfo contenant les valeurs des champs d'adresse e-mail et de mot de passe du formulaire.
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
    //Envoie une requête POST asynchrone au serveur local avec les informations 
    //de connexion au format JSON. La réponse est stockée dans la variable response.

    // Traitement de la réponse du serveur
    const resultat = await response.json();  
    //Attend que la réponse du serveur soit convertie en JSON et stocke le résultat dans la variable resultat.

    // Sélection des éléments d'affichage
    const error_p = document.querySelector('.error');
    const success_p = document.querySelector(".success");
    //Sélectionne des éléments dans le document HTML avec les classes "error" et "success", 
    //pour afficher des messages d'erreur ou de réussite.

    if (resultat.token) {  //Vérifie si la réponse du serveur contient un jeton.
      // Authentification réussie
      sessionStorage.setItem("Token", resultat.token);  //Stocke le jeton d'authentification dans la session du navigateur.
      success_p.innerHTML = "Authentification réussie"; //Affiche un message de réussite dans l'élément avec la classe "success".


      // Redirection vers la page d'accueil après 1,5 seconde
      setTimeout(() => {  //Après 1,5 seconde, efface le message de réussite et redirige l'utilisateur vers "index.html".
        success_p.innerHTML = ""; 
        window.location.href = "index.html";
      }, 1500);
    } else {
      // Authentification échouée
      error_p.innerHTML = "Authentification échouée";


      // Redirection vers la page de connexion après 1,5 seconde
      setTimeout(() => {  //Après 1,5 seconde, efface le message d'erreur et redirige l'utilisateur vers "login.html".
        error_p.innerHTML = "";
        window.location.href = "login.html";
      }, 1500);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
  }
};