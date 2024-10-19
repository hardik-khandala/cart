fetch("productList.json")
    .then((res) => res.json())
    .then((data) => Demo(data))
    .catch((error) => console.log("Error: ", error));

let cart = []; // Array to store cart items

function Demo(data) {
    let container = document.getElementById('productList');

    data.forEach((item) => {
        let card = createProductCard(item, false); // false = product list
        container.appendChild(card);
    });
}

function createProductCard(item, isCart) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = isCart ? `cartItem${item.id}` : `item${item.id}`;

    let image = document.createElement("img");
    image.setAttribute("src", `${item.image}`);
    image.classList.add('img');
    card.appendChild(image);

    let cateRating = document.createElement("div");
    cateRating.classList.add("ratings");
    card.appendChild(cateRating);

    let categary = document.createElement("p");
    categary.innerText = `Category: ${item.category}`;
    cateRating.appendChild(categary);

    let ratings = document.createElement("p");
    ratings.innerText = `Rating: ${item.rating.rate} (${item.rating.count})`;
    cateRating.appendChild(ratings);

    let productName = document.createElement("h4");
    productName.innerText = item.title;
    productName.classList.add("title");
    card.appendChild(productName);

    let disc = document.createElement("p");
    disc.innerText = item.description;
    disc.classList.add("desc");
    card.appendChild(disc);

    let buttonGrp = document.createElement("div");
    buttonGrp.classList.add("btngrp");
    card.appendChild(buttonGrp);

    let a = document.createElement("div");
    a.classList.add('a');
    buttonGrp.appendChild(a);

    let qty = isCart ? item.cartQty : 1; // Use the cartQty for cart items

    let btnd = document.createElement("button");
    btnd.innerText = "-";
    btnd.classList.add('btnd');
    btnd.id = isCart ? `cartListDecrement${item.id}` : `btnDecrement${item.id}`;
    a.appendChild(btnd);
    btnd.addEventListener('click', () => {
        if (qty > 1) {
            qty--;
            updateQtyAndPrice(item.id, qty, item.price);
        }
    });

    let q = document.createElement('span');
    q.classList.add('q');
    q.id = isCart ? `cartListtxtQty${item.id}` : `txtQty${item.id}`;
    q.innerText = qty;
    a.appendChild(q);

    let btni = document.createElement("button");
    btni.innerText = "+";
    btni.classList.add('btni');
    btni.id = isCart ? `cartListIncrement${item.id}` : `btnIncrement${item.id}`;
    btni.addEventListener('click', () => {
        qty++;
        updateQtyAndPrice(item.id, qty, item.price);
    });
    a.appendChild(btni);

    if (!isCart) {
        let addtocart = document.createElement('button');
        addtocart.classList.add('addtocart');
        addtocart.innerText = "Add to Cart";
        addtocart.id = `btnCart${item.id}`;
        addtocart.addEventListener('click', () => {
            addToCart(item);
        });
        buttonGrp.appendChild(addtocart);
    } else {
        let removeBtn = document.createElement('button');
        removeBtn.innerText = "Remove";
        removeBtn.id = `btnRemove${item.id}`;
        removeBtn.addEventListener('click', () => {
            removeFromCart(item.id);
        });
        buttonGrp.appendChild(removeBtn);
    }

    let price = document.createElement('h6');
    price.classList.add('price');
    card.appendChild(price);
    price.id = isCart ? `TotalPrice${item.id}` : `TotalPriceMain${item.id}`;
    price.innerText = `Total: ${(qty * item.price).toFixed(2)}`;

    return card;
}

// Update both product list and cart list for the same item
function updateQtyAndPrice(id, qty, price) {
    let total = qty * price;

    // Update in the main product list
    document.getElementById(`txtQty${id}`).innerText = qty;
    document.getElementById(`TotalPriceMain${id}`).innerText = `Total: ${total.toFixed(2)}`;

    // Update in the cart list if the item is in the cart
    if (document.getElementById(`cartListtxtQty${id}`)) {
        document.getElementById(`cartListtxtQty${id}`).innerText = qty;
        document.getElementById(`TotalPrice${id}`).innerText = `Total: ${total.toFixed(2)}`;

        // Update the cart array
        let cartItem = cart.find(c => c.id === id);
        if (cartItem) {
            cartItem.cartQty = qty;
            calculateGrandTotal(); // Update grand total after every change
        }
    }
}

function addToCart(item) {
    let cartList = document.getElementById('cartList');
    let cartItem = cart.find(c => c.id === item.id);

    // Get the quantity from the product list (if already updated there)
    let productQty = parseInt(document.getElementById(`txtQty${item.id}`).innerText) || 1;

    if (!cartItem) {
        // Set the cart quantity to match the product list quantity
        item.cartQty = productQty;
        cart.push(item);

        let cartCard = createProductCard(item, true); // true = cart list
        cartList.appendChild(cartCard);
    } else {
        // If the item is already in the cart, sync the quantities
        cartItem.cartQty = productQty;
        updateQtyAndPrice(item.id, productQty, item.price);
    }

    calculateGrandTotal(); // Update grand total whenever a new item is added
}

function removeFromCart(id) {
    let cartList = document.getElementById('cartList');
    let cartItemIndex = cart.findIndex(c => c.id === id);

    if (cartItemIndex > -1) {
        cart.splice(cartItemIndex, 1); // Remove from the cart array
        let cartItem = document.getElementById(`cartItem${id}`);
        cartList.removeChild(cartItem); // Remove from the DOM
    }
    calculateGrandTotal(); // Update grand total after removal
}

// Calculate grand total of all items in the cart
function calculateGrandTotal() {
    let grandTotal = cart.reduce((acc, item) => {
        return acc + (item.cartQty * item.price);
    }, 0);

    let grandTotalElement = document.getElementById('grandTotal');
    
    // Create grand total element only once
    if (!grandTotalElement) {
        grandTotalElement = document.createElement('h4');
        grandTotalElement.id = 'grandTotal';
        document.getElementById('cartContainer').appendChild(grandTotalElement); // Append it to a separate container
    }
    
    grandTotalElement.innerText = `Grand Total: ${grandTotal.toFixed(2)}`;
}
