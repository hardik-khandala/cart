fetch("productList.json")
    .then((res) => res.json())
    .then((data) => Demo(data))
    .catch((error) => console.log("Error: ", error))


function Demo(data){
    let container = document.getElementById('productList')

    data.forEach((item) => {
        let card = document.createElement("div")
        card.classList.add("card");
        card.id = `item${item.id}`

        let image = document.createElement("img");
        image.setAttribute("src", `${item.image}`)
        image.classList.add('img')
        card.appendChild(image)

        let cateRating = document.createElement("div");
        cateRating.classList.add("ratings");
        card.appendChild(cateRating);


        let categary = document.createElement("p");
        categary.innerText = `Categary: ${item.category}`
        cateRating.appendChild(categary)

        let ratings = document.createElement("p");
        ratings.innerText = `Rating: ${item.rating.rate} (${item.rating.count})`
        cateRating.appendChild(ratings);

        let productName = document.createElement("h4");
        productName.innerText = item.title;
        productName.classList.add("title")
        card.appendChild(productName);

        let disc = document.createElement("p");
        disc.innerText = item.description;
        disc.classList.add("desc")
        card.appendChild(disc)

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
        btnd.id = `btnDecrement${item.id}`
        a.appendChild(btnd)
        btnd.addEventListener('click', () => {
            let qty = Number(document.getElementById(`txtQty${item.id}`).innerText);
            if(qty>1){
                qty--;
                document.getElementById(`txtQty${item.id}`).innerText = qty;
                fprice = fprice - item.price
                result(fprice)
            }
        })

        let q = document.createElement('span');
        q.classList.add('q')
        q.id = `txtQty${item.id}`
        q.innerText = '1';
        a.appendChild(q)

        let btni = document.createElement("button");
        btni.innerText = "+";
        btni.classList.add('btni')
        btni.id = `btnIncrement${item.id}`
        btni.addEventListener('click', () => {
            qty = Number(document.getElementById(`txtQty${item.id}`).innerText);
            qty++;
            document.getElementById(`txtQty${item.id}`).innerText = qty;
            fprice = qty * item.price
            result(fprice)
        })
        a.appendChild(btni)

        let addtocart = document.createElement('button');
        addtocart.classList.add('addtocart');
        addtocart.innerText = "Add to Cart";
        addtocart.id = `btnCart${item.id}`
        addtocart.addEventListener('click', () => {
            let container1 = document.getElementById('cartList');

        })
        buttonGrp.appendChild(addtocart);

        let price = document.createElement('h6');
        price.classList.add('price')
        card.appendChild(price)
        price.innerText = `Total: ${Number(item.price).toFixed(2)}`
        function result(fprice){
            price.innerText = `Total: ${Number(fprice).toFixed(2)}`
        }

        container.appendChild(card);

    })
}

