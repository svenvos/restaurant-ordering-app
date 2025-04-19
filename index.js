import { menuArray } from "/data.js";

const mainContent = document.getElementById("main-content");
const menuContainer = document.getElementById("menu-container");
const completeOrderBtn = document.getElementById("complete-order-btn");
const modal = document.getElementById("modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const paymentForm = document.getElementById("payment-form");

let allItemsInOrder = [];

document.addEventListener("click", (e) => {
    if (e.target.dataset.addOrderBtn) {
        basket.style.display = "flex";
        basket.style.flexDirection = "column";
        addToOrder(e.target.dataset.addOrderBtn);
    } else if (e.target.dataset.remove) {
        removeItemFromOrder(e.target.dataset.remove);
    }
});

completeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
    mainContent.style.opacity = "0.5";
});

modalCloseBtn.addEventListener("click", () => {
    modal.style.display = "none";
    mainContent.style.opacity = "1";
});

paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    modal.style.display = "none";
    mainContent.style.opacity = "1";
    const paymentFormData = new FormData(paymentForm);
    const fullName = paymentFormData.get("full-name");
    renderThankYouMessage(fullName);
});

function renderThankYouMessage(fullName) {
    document.getElementById("basket").innerHTML = `
        <div class="thank-you-message-container">
            <p class="thank-you-message">Thanks, ${fullName}! Your order is on it's way!</p>
        </div>
    `;
}

menuContainer.innerHTML = menuArray.map((menuItem) => {
    return `
        <div class="menu-item">
            <div class="left">
                <p class="emoji">${menuItem.emoji}</p>
                <div class="menu-item-info">
                    <h2>${menuItem.name}</h2>
                    <p class="small">${menuItem.ingredients.join(", ")}</p>
                    <p class="price">$${menuItem.price}</p>
                </div>
            </div>
            <div class="add-to-order" data-add-order-btn="${menuItem.id}">
                <i class="fa-solid fa-plus" data-add-order-btn="${menuItem.id}"></i>
            </div>
        </div>
    `;
}).join("");

function addToOrder(menuItemId) {
    const menuItemToAdd = menuArray.filter((item) => {
        return item.id === Number(menuItemId);
    })[0];

    allItemsInOrder.push(menuItemToAdd);
    renderBasket(allItemsInOrder);
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function renderBasket(itemsInOrder) {
    let basketHtml = "";
    itemsInOrder.forEach((item) => {
        basketHtml += `
            <div class="order-item-el">
                <div class="left">
                    <h4>${item.name}</h4>
                    <p class="remove" data-remove="${item.id}">remove</p>
                </div>
                <p class="price">$${item.price}</p>
            </div>
        `;
    });

    document.getElementById("order-el").innerHTML = basketHtml;
    calculateTotalPrice();
}

function calculateTotalPrice() {
    const totalPriceItems = allItemsInOrder.map((item) => {
        return item.price;
    }).reduce((total, currentElement) => {
        return total + currentElement;
    });

    renderTotalPrice(totalPriceItems);
}

function renderTotalPrice(totalPriceItems) {
    document.getElementById("total-price-el").innerHTML = `
        <p>Total price:</p>
        <p class="price">$${totalPriceItems}</p>
    `;
}

function removeItemFromOrder(menuItemId) {
    const itemToRemove = allItemsInOrder.filter((item) => {
        return item.id === menuItemId;
    })[0];

    const indexOfItemToRemove = allItemsInOrder.indexOf(itemToRemove) - 1;
    console.log(indexOfItemToRemove);
    allItemsInOrder.splice(indexOfItemToRemove, 1);

    if (allItemsInOrder.length === 0) {
        document.getElementById("basket").style.display = "none";
    } else {
        renderBasket(allItemsInOrder);
    }
}
