// JavaScript för att implementera krav F.
let dspMessage = $("#dspMessage");
let btnAddProduct = $("#btnAddProduct");

let productId = $("#productId");
let productName = $("#productName");
let productPrice = $("#productPrice");
let productStatus = $("#productStatus");

btnAddProduct.click(function () {
    let myvar = FormValidator.addValidator('isStringNotEmpty',function () {
        return true;
    });

    console.log(myvar);
});