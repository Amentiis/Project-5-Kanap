let productDescriptionElement ;
let productNameElement;
let sourceImage;
let idElement;
let altImage;
let itemElement = document.getElementById('items')
let linkForNumber = document.getElementsByTagName('a');



fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) =>{
    //Boucle qui va chercher tous les produits dans l'API et qui les met dans des variables
    for(let product in products){ 
        idElement = products[product]._id
        sourceImage = products[product].imageUrl;
        productNameElement = products[product].name;
        productDescriptionElement = products[product].description;
        altImage = products[product].altTxt;
        //Création des différents Elements HTML qui compose la page d'accueil
        var lien = document.createElement("a");
        lien.setAttribute('href',`product.html?id=${idElement}`)
        itemElement.appendChild(lien);
        var article = document.createElement("article");
        lien.appendChild(article);
        var img = document.createElement("img");
        img.setAttribute('src', sourceImage);
        img.setAttribute('alt', altImage);
        article.appendChild(img);
        var titre = document.createElement("h3")
        titre.classList.add("productName")
        titre.textContent = `${productNameElement}`
        article.appendChild(titre);
        var description = document.createElement("p");
        description.classList.add("productDescription")
        description.textContent = `${productDescriptionElement}`
        article.appendChild(description);    
    };
   
  })
  .catch(function(err) {
    // Une erreur est survenue
  });

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






