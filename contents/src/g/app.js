// JavaScript för att implementera kraven A-E.
//Definition for common functions or tools
let OwnObjectArray = {
    findIndex(objectArray,sPropertyName,sPropertyValue) {
        try{
            if (Array.isArray(objectArray))
                return objectArray.findIndex(objItem => objItem[sPropertyName] === sPropertyValue);
            else
                return -1;
        }catch(e){return false}
    }
};

//Constructor definitions
function Product(pId, pName, pPrice, pDescription, pImage, pUrl, pInStock, pReviews) {
    this.Id = pId;
    this.Name = pName;
    this.Price = pPrice;
    this.Description = pDescription;
    this.Image = pImage;
    this.Url = pUrl;
    this.InStock = pInStock;
    this.Reviews = [];
}
function Review(rId, pId, cName, cComment, rRating) {
    this.Id = rId;
    this.ProductID = pId;
    this.Name = cName;
    this.Comment = cComment;
    this.Rating = rRating;
}

//Global variables
let urlProducts = "http://demo.edument.se/api/products/";
let urlOrders = "http://localhost:3000/orders/";
let arrProducts = [];

//Get HTML elements
let dspProducts = $("#dspProducts");
let dspCart = $("#dspCart");
let dspOrders = $("#dspOrders");

//Functions
function retreiveCart() {
    if (typeof(Storage) !== "undefined") {
        if (sessionStorage.wsShoppingCart)
            return JSON.parse(sessionStorage.wsShoppingCart) || []; //returns an array
    } else
        console.log("Error");
}
function storeCart(arrShoppingCart) {
    if (typeof(Storage) !== "undefined") {
        sessionStorage.wsShoppingCart = JSON.stringify(arrShoppingCart);
    } else
        console.log("Error");
}
function updateStock(ProductId) {
    let productIndex = OwnObjectArray.findIndex(arrProducts,"Id",ProductId);
    if (productIndex > -1){
        if (arrProducts[productIndex].InStock > 0)
            arrProducts[productIndex].InStock--;
    }
    showProducts();
}
function addToCart(objProduct) {
    //Retrieve cart
    let arrShoppingCart = retreiveCart() || [];

    //Add to cart
    let productIndex = OwnObjectArray.findIndex(arrShoppingCart,"Id",objProduct.Id);
    if (productIndex > -1){
        //Update only product quantity
        arrShoppingCart[productIndex].Quantity++;
    }else{
        //Add new product with quantity = 1 into cart
        objProduct.Quantity = 1; //Create new property
        arrShoppingCart.push(objProduct);
    }

    storeCart(arrShoppingCart);//Store cart
    updateStock(objProduct.Id);//Update the stock
    showCart();
}
function renderProduct(objProduct){
    let product = $("<article>");
    let productContent = `<p>${objProduct.Name}</p>
                        <p><img src="${objProduct.Image}" alt="Product image"></p>
                        <p>In stock: ${objProduct.InStock} item(s)</p>`;

    let productButton = $("<button>").text("Add to cart");

    if (objProduct.InStock > 0){
        $(productButton).click(function () {
            addToCart(objProduct);
            alert(objProduct.Name + " added to the shopping card");
        });
    }else
        $(productButton).prop('disabled', true);

    product.append(productContent,productButton);
    dspProducts.append(product);
}
function showProducts(){
    dspProducts.html(""); //Clear all data before render all products
    for (let j in arrProducts)
        renderProduct(arrProducts[j]);
}
function renderCartItem(objInCart){
    return `<tr>
                <td>${objInCart.Name}</td>
                <td>${objInCart.Price}</td>
                <td>${objInCart.Quantity}</td>
                <td>${(objInCart.Price*objInCart.Quantity).toFixed(3)}</td>
            </tr>`;
}
function showCart(){
    //Clear all data before render the shopping cart
    dspCart.html("");

    //Retrieve cart
    let arrShoppingCart = retreiveCart() || [];

    let cart = $("<table>").attr("style","border:1px solid");
    let firstRow = `<tr><td colspan="4"><h2>SHOPPING CART</h2></td></tr>
                    <tr>
                        <td>PRODUCT</td>
                        <td>PRICE</td>
                        <td>QUANTITY</td>
                        <td>TOTAL</td>
                    </tr>`;
    let sum = 0;

    cart.append(firstRow);
    for (let i in arrShoppingCart){
        cart.append(renderCartItem(arrShoppingCart[i]));
        sum += arrShoppingCart[i].Price*arrShoppingCart[i].Quantity;
    }

    let sumView = $("<p>").html("<h3>SUM: " + sum.toFixed(3) + "</h3>");
    dspCart.append(cart,sumView);
}
function showButtonOrder(){
    let buttonOrder = $("<button>").text("Send this order");

    $(buttonOrder).click(function () {
        let arrShoppingCart = retreiveCart() || [];
        console.log(arrShoppingCart);

        if (arrShoppingCart.length > 0){
            let order = [];

            for (let i in arrShoppingCart){
                let orderItem = {
                    productId: arrShoppingCart[i].Id,
                    noUnits: arrShoppingCart[i].Quantity
                };
                order.push(orderItem);
            }

            let sendData = {items:order};
            $.post(urlOrders,sendData)
                .done(function (data){
                    console.log("Post successfully!",data);

                    //Clear cart
                    sessionStorage.removeItem("wsShoppingCart");
                    showCart();
                })
                .fail(function (error) {console.log("Error found!",error)});
        }
    });

    dspOrders.append(buttonOrder);
}

//MAIN
//[A] Get data from API
$.get(urlProducts)
    .done(function (data){
        //console.log("Get successfully!",data); //Testing purpose
        //Clear previous data if it found
        sessionStorage.removeItem("wsShoppingCart");

        if (Array.isArray(data) && data.length > 0 && arrProducts.length === 0){
            console.log(arrProducts.length);
            //[B] Add new a property "InStock" within every object for store status
            for (let i in data){
                if (data[i].Name !== null){
                    data[i].InStock = Math.floor((Math.random()*10)+1);
                    arrProducts.push(data[i]);
                }
            }

            showProducts();
        }else
            console.log("Data not found");
    })
    .fail(function (error) {console.log("Error found!",error)});

showCart();
showButtonOrder();
//console.log(sessionStorage.wsShoppingCart);