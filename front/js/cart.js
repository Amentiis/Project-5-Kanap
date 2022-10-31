cartItems = document.getElementById("cart__items");
let kanaps = document.getElementsByClassName("cart__item");
var totalPrice = 0;
totalPriceElement = document.getElementById("totalPrice");
totalPriceElement.textContent= 0;
var quantityTotal = 0;
totalQuantityElement = document.getElementById("totalQuantity");
totalQuantityElement.textContent= 0;
let linkForNumber = document.getElementsByTagName('a');

// Initialisation des variables données
fistNameData = "" ;
lastNameData = "" ;
addressData = "" ; 
cityData = "" ; 
emailData = ""; 

// Variable Couleur
let redColor = "#FF0000";
let greenColor = "#18b215"

panier = JSON.parse(localStorage.getItem("card"));
//console.log(panier);


afficheProduct(panier);

function afficheProduct(panier){

  for(let product in panier){ 
    panier = JSON.parse(localStorage.getItem("card")).sort((a, b) => (a.id > b.id) ? 1 : -1)
    idElement = panier[product].id; 
    fetch(`http://localhost:3000/api/products/${idElement}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (products){
        idElement = panier[product].id; 
        colorElement = panier[product].color;
        quantityElement = panier[product].quantity
        nomProduit = products.name;
        prixProduit = products.price ;
        imageProduit = products.imageUrl;
        altImageProduit = products.altTxt;
        cartcreation();
       
    });  
}
}


/**
 * Crée tous les éléments dans le panier
 */
function cartcreation(){
    var article = document.createElement('article');
    article.classList.add("cart__item")
    article.setAttribute("data-id",idElement)
    article.setAttribute("data-color",colorElement)
    cartItems.appendChild(article);

    var divImg = document.createElement('div');
    divImg.classList.add("cart__item__img")
    article.appendChild(divImg);

    var img = document.createElement('img');
    img.setAttribute("src",imageProduit)
    img.setAttribute("alt",altImageProduit)
    divImg.appendChild(img);

    var divContent = document.createElement('div');
    divContent.classList.add("cart__item__content");
    article.appendChild(divContent);

    var divContentDescription = document.createElement('div');
    divContentDescription.classList.add("cart__item__content__description");
    divContent.appendChild(divContentDescription);

    var titre = document.createElement('h2')
    titre.textContent = nomProduit;
    divContentDescription.appendChild(titre);

    var paragrapheColor = document.createElement('p');
    paragrapheColor.textContent = "Couleur : " + colorElement;
    divContentDescription.appendChild(paragrapheColor);

    var paragraphePrice = document.createElement('p');
    paragraphePrice.textContent = "prix : " + prixProduit + "€";
    divContentDescription.appendChild(paragraphePrice);

    var divSettings = document.createElement('div');
    divSettings.classList.add("cart__item__content__settings");
    divContent.appendChild(divSettings);

    var divSettingsQuantity = document.createElement('div');
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
    divSettings.appendChild(divSettingsQuantity);

    var paragrapheQuantity = document.createElement('p');
    paragrapheQuantity.textContent = "Qté : "
    divSettingsQuantity.appendChild(paragrapheQuantity);

    var inputQuantity = document.createElement('input');
    inputQuantity.setAttribute("type", "number");
    
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.setAttribute("name","itemQuantity");
    inputQuantity.setAttribute("min",1);
    inputQuantity.setAttribute("max",100);
    inputQuantity.setAttribute("value",quantityElement);
    divSettingsQuantity.appendChild(inputQuantity);

    var divSettingsDelete = document.createElement('div')
    divSettingsDelete.classList.add("cart__item__content__settings__delete");
    divSettings.appendChild(divSettingsDelete);

    var paragrapheDelete = document.createElement('p');
    paragrapheDelete.classList.add("deleteItem");
    paragrapheDelete.textContent = "Supprimer";
    divSettingsDelete.appendChild(paragrapheDelete);

    createListenerForDeleteButton(paragrapheDelete);
    createListenerForInputQuantity(inputQuantity);

    localStorage.setItem("quantityTotal",makeTotalQuantityAndPrice());
}


/**
 * Modifie la Quantité des produits affiché
 */

  function modifyQuantity(modifquantity,idcolorKanapsModify) {
    
    // on récupérer dans une variable l'endroit ou se situe le produit correspondant au produit sélectionné
    let productFound = panier.find(p => p. id == idcolorKanapsModify.id && p.color == idcolorKanapsModify.color); 
    // on fait la différence entre la quantité du produit de base et la quantité que l'on vient de changer
    var difference = modifquantity - productFound.quantity;
    // on change la quantity du produit dans la panier par la nouvelle quantité choisi
    productFound.quantity = modifquantity; 
    // on récupére la valeur de la quantité total stocké dans le localstorage et on l'a met à jour
    quantityTotal = parseInt(localStorage.getItem("quantityTotal"));
    localStorage.setItem("quantityTotal", quantityTotal + difference);
    totalQuantityElement.textContent= localStorage.getItem("quantityTotal");
    localStorage.setItem("card", JSON.stringify(panier));
    fetch(`http://localhost:3000/api/products/${productFound.id}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (products){
        prixProduit = products.price ;
        if(parseInt(difference)<0){
          makeTotalPriceRemove(prixProduit,difference)
          menuQuantity();
        }else if (parseInt(difference)>0){
          makeTotalPriceAdd(prixProduit,difference)
          menuQuantity();
        }
    });  

  }


/**
 * Fait le total de la quantité et  au lancement de la page;
 */
function makeTotalQuantityAndPrice(){
  quantityTotal = quantityTotal + parseInt(quantityElement);
  totalQuantityElement.textContent= quantityTotal;
  totalPrice = totalPrice + (parseInt(prixProduit) * parseInt(quantityElement));
  totalPriceElement.textContent= totalPrice;
  return quantityTotal;
}

/**
 * Calculer et affiche le prix total une fois incrémentation d'un article
 */
function makeTotalPriceAdd(prix,difference){
  totalPrice = totalPrice + (parseInt(prix) * difference);
  totalPriceElement.textContent= totalPrice;
}
/**
 * Calculer et affiche le prix total une fois décrémentation d'un article
 */
function makeTotalPriceRemove(prix,difference){
  totalPrice = totalPrice - (parseInt(prix) * -difference);
  totalPriceElement.textContent= totalPrice;
}


/**
 * Création de l'Evenement click sur le bouton "supprimer"
 */

function createListenerForDeleteButton (buttonDelete){
  buttonDelete.addEventListener('click', (e) => {
    let idcolorKanaps = buttonDelete.closest(".cart__item");
    deleteProductFromCart(idcolorKanaps.dataset,idcolorKanaps);
  });
  }


/**
 * Création de l'Evenement input sur les différents sélecteur de quantité
 */

function createListenerForInputQuantity(inputquantity){
  inputquantity.addEventListener('input',function(event){
    modifquantity = parseInt(event.target.value);
    if(isNaN(modifquantity)){
      inputquantity.value = 1;
    }else if(modifquantity == 0){
      inputquantity.value = 1;
    }else{
      let idcolorKanapsModify = inputquantity.closest(".cart__item");
      modifyQuantity(modifquantity,idcolorKanapsModify.dataset);
    }
  })
};


/**
 * Suppression de l'élément sélectionné du panier;
 */
 function deleteProductFromCart (productSelected,IdDelete) {
  panier = JSON.parse(localStorage.getItem("card"));
  const newCart = panier.filter((product) => {
  if (product.id !== productSelected.id || product.color !== productSelected.color)
   return product;
   else if(product.id == productSelected.id && product.color == productSelected.color){
    fetch(`http://localhost:3000/api/products/${product.id}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (products){
      //On récupére le prix de l'article via l'api, car le prix ne doit pas être stocké dans le localstorage
      priceOfDeleteProduct = products.price;
      //On récupére la quantité de produit qu'il y avait dans le produit que l'on souhaite supprimer
      quantityOfDeleteProduct = product.quantity;
      //On crée une variable ou l'on stock la valeur actuel de quantitytotal du localstorage
      quantityTotal = parseInt(localStorage.getItem("quantityTotal"));
      //On calcule ici le prix en faisant une multiplication de la quantité de l'article et de son prix
      price = quantityOfDeleteProduct * priceOfDeleteProduct;
      //On récupérer la variable totalPrice que l'on va soustraire avec notre variable price
      totalPrice = totalPrice - price;
      //On Affiche ensuite la valeur totalPrice dans l'élément TotalPriceElement
      totalPriceElement.textContent= totalPrice;
      //On actualise ensuite la quantité total affiché à l'écran
      quantityTotal = quantityTotal - parseInt(quantityOfDeleteProduct);
      localStorage.setItem("quantityTotal",quantityTotal)
      totalQuantityElement.textContent= localStorage.getItem("quantityTotal");
      //Après cela on supprime l'élement sélectionné
      IdDelete.remove();
      //On stock dans le localStorage notre nouveau panier sans l'article selectionné
      localStorage.setItem("card", JSON.stringify(newCart));
      menuQuantity();
});
}
});
}



// Confirmation Commande
firstName = document.getElementById("firstName");
lastName = document.getElementById("lastName");
address = document.getElementById("address");
city = document.getElementById("city");
email = document.getElementById("email");
firstNameData = "" ;
lastNameData = "" ;
addressData = "" ; 
cityData = "" ; 
emailData = ""; 


//Création de l'Evenement input sur l'élément firstName
firstName.addEventListener('input',function(e){
  firstNameData = e.target.value;
  if(firstNameData === ""){
    document.getElementById("firstNameErrorMsg").textContent = "";
  }else{
    testFirstName = nameRegExp.test(firstNameData)
    checkFirstName()
  }
})

//Création de l'Evenement input sur l'élément lastName
lastName.addEventListener('input',function(e){
  lastNameData = e.target.value;
  if(lastNameData === ""){
    document.getElementById("lastNameErrorMsg").textContent = "";
  }else{
    testLastName = nameRegExp.test(lastNameData)
    checkLastName()
  }
})

//Création de l'Evenement input sur l'élément address
address.addEventListener('input',function(e){
  addressData = e.target.value;
  if(addressData === ""){
    document.getElementById("addressErrorMsg").textContent = "";
  }else{
    testAddress = addressRegExp.test(addressData)
    checkAddress()
  }
})

//Création de l'Evenement input sur l'élément city
city.addEventListener('input',function(e){
  cityData = e.target.value;
  if(cityData === ""){
    document.getElementById("cityErrorMsg").textContent = "";
  }else{
    testCity = cityRegExp.test(cityData)
    checkCity()
  }
})

//Création de l'Evenement input sur l'élement email
email.addEventListener('input',function(e){
  emailData = e.target.value;
  if(emailData === ""){
    document.getElementById("emailErrorMsg").textContent = "";
  }else{
    testEmail = emailRegExp.test(emailData);
    checkMail();
  }

})




/**
 * Vérification de l'input mail
 */

function checkMail(){
  if (testEmail === true){
    document.getElementById("emailErrorMsg").style.color = "#fbbcbc";
    document.getElementById("emailErrorMsg").textContent = "Adresse Email valide ✔️"
    return true;
    
  }else{
    document.getElementById("emailErrorMsg").style.color = "#FF0000";
    document.getElementById("emailErrorMsg").textContent = "Adresse Email nom valide ❌"
    return false;
  } 
}

/**
 * Vérification de l'input FirstName
 */

function checkFirstName(){
  if (testFirstName === true){
    document.getElementById("firstNameErrorMsg").style.color = "#fbbcbc";
    document.getElementById("firstNameErrorMsg").textContent = "Prénom valide ✔️"
    return true;
    
  }else{
    document.getElementById("firstNameErrorMsg").style.color = "#FF0000";
    document.getElementById("firstNameErrorMsg").textContent = "Prénom non valide ❌"
    return false;
  } 
}
/**
 * Vérification de l'input LastName
 */
function checkLastName(){
  if (testLastName === true){
    document.getElementById("lastNameErrorMsg").style.color = "#fbbcbc";
    document.getElementById("lastNameErrorMsg").textContent = "Nom valide ✔️"
    return true;
    
  }else{
    document.getElementById("lastNameErrorMsg").style.color = "#FF0000";
    document.getElementById("lastNameErrorMsg").textContent = "Nom non valide ❌"
    return false;
  } 
}

/**
 * Vérification de l'input City
 */
function checkCity(){
  if (testCity === true){
    document.getElementById("cityErrorMsg").style.color = "#fbbcbc";
    document.getElementById("cityErrorMsg").textContent = "Ville valide ✔️"
    return true;
    
  }else{
    document.getElementById("cityErrorMsg").style.color = "#FF0000";
    document.getElementById("cityErrorMsg").textContent = "Ville non valide ❌"
    return false;
  } 
}
/**
 * Vérification de l'input Address
 */

function checkAddress(){
  if (testAddress === true){
    document.getElementById("addressErrorMsg").style.color = "#fbbcbc";
    document.getElementById("addressErrorMsg").textContent = "Adresse valide ✔️"
    return true;
    
  }else{
    document.getElementById("addressErrorMsg").style.color = "#FF0000";
    document.getElementById("addressErrorMsg").textContent = "Adresse non valide ❌"
    return false;
  } 
}

let contact = {
  firstName,
  lastName,
  address,
  city,
  email,
}


var AlertConfirmation = document.createElement("p")
AlertConfirmation.style.color = "#FFF";
AlertConfirmation.style.textAlign = "center";
AlertConfirmation.style.borderRadius = "15px"
AlertConfirmation.style.padding = "20px";
AlertConfirmation.style.transition= "all 500ms linear";
AlertConfirmation.style.opacity= "0";
AlertConfirmation.textContent = "";
AlertConfirmation.style.backgroundColor = "#FFF"; 
AlertConfirmation.style.fontWeight = "600";
AlertConfirmation.style.border= "solid 2px #000000";
cardSubmit = document.getElementsByClassName("cart__order__form");
cardSubmit[0].appendChild(AlertConfirmation);



//Création de l'Evenement click sur l'élément commander

document.getElementById("order").addEventListener('click',function(event){
  panier = JSON.parse(localStorage.getItem("card"));
  event.preventDefault();
  if (panier === "" || panier === null || panier.length === 0){
    styleText(redColor)
    AlertConfirmation.textContent = "Vous devez avoir un panier";
    hideText(4000);
    return;
  }else if (firstNameData == "" || lastNameData == "" || addressData == ""  || cityData == "" || emailData == ""){
    styleText(redColor)
    AlertConfirmation.textContent = "Vous devez remplir tous les champs d'information";
    hideText(4000);
  }else if (checkFirstName() === true && checkLastName() === true && checkAddress() === true && checkCity() === true && checkMail() === true){ 
    styleText("#000000")
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 5secondes";
    document.getElementById("order").setAttribute("disabled","");
    compteur();
    hideText(5000);
  }else{
    styleText(redColor)
    AlertConfirmation.textContent = "Vous devez fournir des informations valides";
    hideText(4000);
  }
})



/**
 * Permet d'envoyer les données traité à l'api afin de récupérer les données de retour qui permettront de confirmer la commande
 */
function PostedData(){

  fetch("http://localhost:3000/api/products/order", {
	method: "POST",
	headers: { 
'Accept': 'application/json', 
'Content-Type': 'application/json' 
},
	body: JSON.stringify({
    contact : {
      firstName : firstName.value,
      lastName : lastName.value,
      address : address.value,
      city : city.value,
      email : email.value,
    },
    products : makeArray(panier),
  })
}).then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(value) {
  location.replace(`./confirmation.html?order=${value.orderId}`)
});
}


/**
 * Transforme la variable panier en une Array pouvant être traité par l'API
 */
function makeArray(panier){
  let ArrayProductid = [];
  for(let i in panier){
    ArrayProductid.push(panier[i].id);
  }
  return ArrayProductid
}

//REGEX

let nameRegExp = new RegExp(
  "^[A-zÀ-ú,'-]+$",'i'
  );

let addressRegExp = new RegExp(
  "^[A-zÀ-ú0-9 ,'-]+$",'i'
  );  

let cityRegExp = new RegExp(
  "^[A-zÀ-ú ,'-]+$",'i'
  ); 

let emailRegExp = new RegExp("^[a-zA-Z0-9.-_-]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");


var paragrapheNumber = document.createElement('p');
paragrapheNumber.style.fontWeight= "500";
paragrapheNumber.style.color= "#000000";
linkForNumber[2].appendChild(paragrapheNumber)
menuQuantity()

function menuQuantity(){
  panier = JSON.parse(localStorage.getItem("card"))
  let quantityElement = 0
  for(let product in panier){ 
        quantityElement += parseInt(panier[product].quantity)
    }; 
  if (quantityElement == 0 || quantityElement === null || quantityElement === undefined ){
    paragrapheNumber.textContent = '';
  }else{
    paragrapheNumber.textContent = `(${quantityElement})`;
  }
}

/**
 * Cache le texte au bout d'un temps envoyer à la fonction
 */

 function hideText(timer){
  setTimeout(function(){
    AlertConfirmation.style.opacity= "0";
  },timer);
}

/**
 * Affiche le texte avec une couleur envoyer à la fonction
 */
function styleText(color){
  AlertConfirmation.style.opacity= "1";
  AlertConfirmation.style.color= `${color}`;
}

/**
 * Permet un décompte pour renvoyer l'utilisateur sur la page confirmation de commande au bout de 5secondes
 */
 function compteur(){
  setTimeout(function(){
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 4secondes";
  },1000);
  setTimeout(function(){
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 3secondes";
  },2000);
  setTimeout(function(){
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 2secondes";
  },3000);
  setTimeout(function(){
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 1secondes";
  },4000);
  setTimeout(function(){
    AlertConfirmation.textContent = "Commande Validée, vous allez être redirigé dans 0secondes";
    document.getElementById("order").removeAttribute("disabled","");
    PostedData()
  },5000);
} 