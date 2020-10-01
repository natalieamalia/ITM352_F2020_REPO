// -- Price depends on quantity
quantity = 27
quantity = <choose a quanity> ;
if ( quantity > 0 ) && (quantity<10) {
    price = 100;
}
else if ( quantity = 10 && quantity< 25){
    price = 5o
}
else if ( quantity >= 25 ) {
            price = 35;
}
else 
    price = "no purchase";

console.log( quantity + ' products will cost $ ' + price + ' each.' ) ;
