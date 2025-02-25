export const BASE_URL = "http://localhost:3000/api";

export const CATEGORIES_URL = `${BASE_URL}/categories`;
export const PUBLISH_PRODUCT_URL = `${BASE_URL}/publish`;
export const PRODUCTS_URL = `${BASE_URL}/products`;
export const CATEGORIES_PRODUCTS = `${BASE_URL}/cats_products`;
export const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/comments`;
export const CART_INFO_URL = `${BASE_URL}/cart`;
export const CART_BUY_URL = `${BASE_URL}/cart/buy`;

export const EXT_TYPE = ".json";

let showSpinner = function() {
    document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function() {
    document.getElementById("spinner-wrapper").style.display = "none";
};

export function getJSONData(url, token) {
    let result = {};
    showSpinner();

    return fetch(url, {
        method: 'GET',
        headers: {
            'access-token': token
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
    .then(function(response) {
        result.status = "ok";
        result.data = response;
        hideSpinner();
        return result;
    })
    .catch(function(error) {
        result.status = "error";
        result.data = error;
        hideSpinner();
        return result;
    });
}
