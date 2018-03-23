// JavaScript för att implementera krav F.
let dspMessage = $("#dspMessage");
let btnAddProduct = $("#btnAddProduct");

let productId = $("#productId");
let productName = $("#productName");
let productPrice = $("#productPrice");
let productStatus = $("#productStatus");

btnAddProduct.click(function () {
    let myId = productId.val();
    alert(myId);
    FormValidator.addValidator(productId,function (myId) {
        return true;
    });


});