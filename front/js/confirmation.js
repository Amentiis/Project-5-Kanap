/**
 * On cherche à récupérer id de la commande qui se situe dans l'url de la page afin de l'afficher
 */
var chemin = window.location.href; //chemin reçoit le chemin de l'url
var url = new URL(chemin); //Utilisation de l'objet url avec chemin comme paramètre
var order = url.searchParams.get("order"); //stockage de la valeur de l'id de la commande dans la variable order

//Initialisation de l'élement orderId + modification du textcontent par la variable order
document.getElementById("orderId").textContent = order;

// Commande effectuée on supprime le panier de l'utilisateur en supprimant toutes les données de localstorage
localStorage.clear();