import { CATEGORIES_URL, getJSONData } from './init.js';

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";

let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// Ordena las categorías según el criterio
function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort((a, b) => parseInt(b.productCount) - parseInt(a.productCount));
    }
    return result;
}

// Guarda el ID de la categoría seleccionada en localStorage y redirige
export function setCatID(id) {
    fetch(`http://localhost:3000/api/cats_products/${id}`, {
        method: 'GET', 
    })
        .then(response => response.json())
        .then(data => {
            window.location = "products.html";
        })
        .catch(error => console.error('Error:', error));
}

// Exponer al objeto global
window.setCatID = setCatID;

function showCategoriesList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

// Ordena y muestra las categorías
function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray !== undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
    showCategoriesList();
}

// Elementos del DOM
const elements = {
    sortAsc: document.getElementById("sortAsc"),
    sortDesc: document.getElementById("sortDesc"),
    sortByCount: document.getElementById("sortByCount"),
    clearRangeFilter: document.getElementById("clearRangeFilter"),
    rangeFilterCount: document.getElementById("rangeFilterCount"),
    rangeFilterCountMin: document.getElementById("rangeFilterCountMin"),
    rangeFilterCountMax: document.getElementById("rangeFilterCountMax"),
};

// Configura los event listeners
function setupEventListeners() {
    elements.sortAsc.addEventListener("click", () => sortAndShowCategories(ORDER_ASC_BY_NAME));
    elements.sortDesc.addEventListener("click", () => sortAndShowCategories(ORDER_DESC_BY_NAME));
    elements.sortByCount.addEventListener("click", () => sortAndShowCategories(ORDER_BY_PROD_COUNT));
    elements.clearRangeFilter.addEventListener("click", () => {
        elements.rangeFilterCountMin.value = "";
        elements.rangeFilterCountMax.value = "";
        minCount = undefined;
        maxCount = undefined;
        showCategoriesList();
    });
    elements.rangeFilterCount.addEventListener("click", () => {
        minCount = parseInt(elements.rangeFilterCountMin.value) || undefined;
        maxCount = parseInt(elements.rangeFilterCountMax.value) || undefined;
        showCategoriesList();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getJSONData(CATEGORIES_URL).then(resultObj => {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            showCategoriesList();
        }
    });

    setupEventListeners();
});
