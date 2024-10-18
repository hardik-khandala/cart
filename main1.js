<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart</title>
    <style>
        .card { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
        .img { width: 100px; height: 100px; }
        .btngrp { display: flex; justify-content: space-between; margin-top: 10px; }
        .q { margin: 0 10px; }
        .addtocart { margin-top: 10px; }
        .price { margin-top: 10px; }
        .cart-item { margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
    </style>
</head>
<body>

    <div id="productList"></div>
    <h2>Cart</h2>
    <div id="cartList"></div>

    <script>
        // Fetch product data from JSON
        fetch("productList.json")
            .then((res) => res.json())
            .then((data) => Demo(data))
            .catch((error) => console.log("Error: ", error))

        // Function to render product list
        function Demo(data) {
            let container = document.getElementById('productList');

            data.forEach((item) => {
                let card = document.createElement("div");
                card.classList.add("card");
                card.id = `item${item.id}`;

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

                let fprice;
                let btnd = document.createElement("button");
                btnd.innerText = "-";
                btnd.classList.add('btnd');
                btnd.id = `btnDecrement${item.id}`;
                a.appendChild(btnd);
                btnd.addEventListener('click', () => {
                    let qty = Number(document.getElementById(`txtQty${item.id}`).innerText);
                    if (qty > 1) {
                        qty--;
                        document.getElementById(`txtQty${item.id}`).innerText = qty;
                        fprice = fprice - item.price;
                        updateCartItemInLocalStorage(item.id, qty, fprice);
                        result(fprice);
                    }
                });

                let q = document.createElement('span');
                q.classList.add('q');
                q.id = `txtQty${item.id}`;
                q.innerText = '1';
                a.appendChild(q);

                let btni = document.createElement("button");
                btni.innerText = "+";
                btni.classList.add('btni');
                btni.id = `btnIncrement${item.id}`;
                btni.addEventListener('click', () => {
                    qty = Number(document.getElementById(`txtQty${item.id}`).innerText);
                    qty++;
                    document.getElementById(`txtQty${item.id}`).innerText = qty;
                    fprice = qty * item.price;
                    updateCartItemInLocalStorage(item.id, qty, fprice);
                    result(fprice);
                });
                a.appendChild(btni);

                let addtocart = document.createElement('button');
                addtocart.classList.add('addtocart');
                addtocart.innerText = "Add to Cart";
                addtocart.id = `btnCart${item.id}`;
                addtocart.addEventListener('click', () => {
                    let cartItems = getCartFromLocalStorage();
                    let itemInCart = cartItems.find(cartItem => cartItem.id === item.id);
                    let qty = Number(document.getElementById(`txtQty${item.id}`).innerText);

                    if (itemInCart) {
                        itemInCart.quantity += qty;
                        itemInCart.totalPrice = itemInCart.quantity * item.price;
                    } else {
                        cartItems.push({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            quantity: qty,
                            totalPrice: qty * item.price
                        });
                    }

                    saveCartToLocalStorage(cartItems);
                    updateCartPage();
                });
                buttonGrp.appendChild(addtocart);

                let price = document.createElement('h6');
                price.classList.add('price');
                card.appendChild(price);
                price.innerText = `Total: ${Number(item.price).toFixed(2)}`;

                function result(fprice) {
                    price.innerText = `Total: ${Number(fprice).toFixed(2)}`;
                }

                container.appendChild(card);
            });
        }

        // Local storage functions
        function saveCartToLocalStorage(cartItems) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }

        function getCartFromLocalStorage() {
            let cartItems = localStorage.getItem('cart');
            return cartItems ? JSON.parse(cartItems) : [];
        }

        function updateCartItemInLocalStorage(productId, quantity, totalPrice) {
            let cartItems = getCartFromLocalStorage();
            let cartItem = cartItems.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity = quantity;
                cartItem.totalPrice = totalPrice;
            }
            saveCartToLocalStorage(cartItems);
            updateCartPage();
        }

        // Update cart page with current items
        function updateCartPage() {
            let cartItems = getCartFromLocalStorage();
            let container1 = document.getElementById('cartList');
            container1.innerHTML = ''; // Clear the cart before updating

            cartItems.forEach(cartItem => {
                let cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <h4>${cartItem.title}</h4>
                    <p>Quantity: ${cartItem.quantity}</p>
                    <p>Total Price: ${cartItem.totalPrice.toFixed(2)}</p>
                `;
                container1.appendChild(cartItemElement);
            });
        }

        // Load cart data on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateCartPage();
        });

    </script>

</body>
</html>