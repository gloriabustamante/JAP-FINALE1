const BASE_URL = "http://localhost:3000/api";

const CATEGORIES_URL = `${BASE_URL}/categories`;
const PUBLISH_PRODUCT_URL = `${BASE_URL}/publish`;
const PRODUCTS_URL = `${BASE_URL}/products`;
const PRODUCT_INFO_URL = `${BASE_URL}/products`;
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/comments`;
const CART_INFO_URL = `${BASE_URL}/cart`;
const CART_BUY_URL = `${BASE_URL}/cart/buy`;

const EXT_TYPE = ".json";


let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}