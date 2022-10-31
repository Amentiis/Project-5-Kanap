/**
 * On récupére l'id du produit qui se situe dans l'url de la page
 */
var chemin = window.location.href; //chemin reçoit le chemin de l'url
var url = new URL(chemin);
var id = url.searchParams.get("id");

let linkForNumber = document.getElementsByTagName('a');
const nameProduct = document.getElementById("title");
const priceProduct = document.getElementById("price");
const priceDescription = document.getElementById("description");
const option = document.getElementsByTagName('option');
const buttonAdd = document.getElementById('addToCart');
const quantityInput = document.getElementById('quantity');
colorInput = document.getElementById('colors');
const NextToSettingsQuantity = document.getElementsByClassName("item__content");
var AlertQuantityColor = document.createElement("p")
NextToSettingsQuantity[0].appendChild(AlertQuantityColor);
AlertQuantityColor.style.color = "#FF0000";
AlertQuantityColor.style.textAlign = "center";
AlertQuantityColor.style.borderRadius = "15px"
AlertQuantityColor.style.padding = "20px";
AlertQuantityColor.style.transition= "all 500ms linear";
AlertQuantityColor.style.opacity= "0";
AlertQuantityColor.style.fontWeight= "500";
AlertQuantityColor.style.border= "solid 2px #000000";
AlertQuantityColor.textContent = "";

itemImg = document.getElementsByClassName("item__img");
let imageProduct;
let altImageProduct;
let color = "";
let quantity;
let redColor = "#FF0000";
let greenColor = "#18b215"


/**
 * On appelle l'api avec en paramètre l'id du produit que l'on récupére dans l'url de la page
 */
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products){
    idElement = products._id
    nameProduct.innerText = products.name;
    priceProduct.innerText = products.price ;
    priceDescription.innerText = products.description;
    imageProduct = products.imageUrl;
    altImageProduct = products.altTxt;
    
    var img = document.createElement('img');
    img.setAttribute("src", imageProduct);
    img.setAttribute("alt", imageProduct)
    itemImg[0].appendChild(img);

    for(let color in products.colors){
      var optionColor = document.createElement('option');
      optionColor.setAttribute("value",products.colors[color]);
      optionColor.textContent = products.colors[color];
      colorInput.appendChild(optionColor);
    }  
  })

  .catch(function(err) {
    // Une erreur est survenue
  });

//Création de l'Evenement input sur l'élément quantité
  quantityInput.addEventListener('input', function(event){
    quantity = event.target.value;
  });

//Création de l'Evenement input sur l'élément couleur
  colorInput.addEventListener('input', function(event){
    color = event.target.value;
  });


//Création de l'Evenement click sur le bouton "Ajouter au panier"
  buttonAdd.addEventListener('click',function(){
    panier = [];
    let article = {
      id,
      quantity,
      color,
    }
    checkData(article.id,article.quantity,article.color,article);
  });

/**
 * Vérifie les données rentrée par l'utilisateur, et l'informe si il y a un problème.
 */

 function checkData(articleId,articleQuantity,articleColor,article){
  panierString = localStorage.getItem("card");
  let flag ;
    if ( (articleQuantity <= 0  || articleQuantity === undefined || articleQuantity > 100 ) && articleColor === ""){
      /* ---STYLE--- */
      styleText(redColor);
      AlertQuantityColor.style.fontWeight= "600";
      AlertQuantityColor.textContent = `Vous devez précisez une quantité valide (Comprise entre 1 et 100) et une couleur valide`;
      hideText(3000);
      /* ---STYLE--- */
    }
    else if (articleQuantity <= 0  || articleQuantity === undefined || articleQuantity > 100 ){
       /* ---STYLE--- */
      styleText(redColor),
      AlertQuantityColor.style.fontWeight= "600";
      AlertQuantityColor.textContent = "Vous devez précisez une quantité valide (Comprise entre 1 et 100)";
      hideText(3000);
       /* ---STYLE--- */
    }
    else if(articleColor === undefined || articleColor===null || articleColor=== "" ){
       /* ---STYLE--- */
      styleText(redColor);
      AlertQuantityColor.style.fontWeight= "600";
      AlertQuantityColor.textContent = "Vous devez précisez une couleur";
      hideText(3000);
       /* ---STYLE--- */
    }
    else if(panierString === null){
      panier.push(article);
      localStorage.setItem("card",JSON.stringify(panier));
       /* ---STYLE--- */
      var productName = document.getElementById('title').textContent;
      styleText("#000000");
      AlertQuantityColor.style.fontWeight= "500";
      AlertQuantityColor.textContent = `Vous venez de rajouter ${articleQuantity} ${productName} de couleur ${articleColor} à votre panier `;
      hideText(5000);
       /* ---STYLE--- */
    }else{
        /* ---STYLE--- */
      var productName = document.getElementById('title').textContent;
      styleText("#000000");
      AlertQuantityColor.style.fontWeight= "500";
      AlertQuantityColor.textContent = `Vous venez de rajouter ${articleQuantity} ${productName} de couleur ${articleColor} à votre panier `;
      hideText(5000);
        /* ---STYLE--- */
      panier = JSON.parse(panierString);
      flag = 0;
      for(var i=0; i<panier.length; i++) {
        if(articleId === panier[i].id && articleColor === panier[i].color) {
          panier[i].quantity = parseInt(panier[i].quantity) + parseInt(quantity);
          localStorage.setItem("card",JSON.stringify(panier));
          menuQuantity();
          flag = 1;
        }
      }
      if(flag ===0){
        panier.push(article);
        localStorage.setItem("card",JSON.stringify(panier));
        menuQuantity();
      }
    }
}

/**
 * Cache le texte 
 */
function hideText(timer){
  setTimeout(function(){
    AlertQuantityColor.style.opacity= "0";
  },timer);
}

/**
 * Affiche le texte avec une couleur;
 */
function styleText(color){
      AlertQuantityColor.style.opacity= "1";
      AlertQuantityColor.style.color= `${color}`;
      AlertQuantityColor.style.backgroundColor = "#FFFF"; 
}


var paragrapheNumber = document.createElement('p');
paragrapheNumber.style.fontWeight= "200";
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
  