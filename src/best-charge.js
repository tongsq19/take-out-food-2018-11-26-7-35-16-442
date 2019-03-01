
let loadAllItems = require('./items.js');
let loadPromotions = require('./promotions.js');


let getItemById = function (itemID) {
  let itemArray= loadAllItems();
  let index = itemArray.findIndex(obj => obj.id === itemID);
  return itemArray[index];
};

function bestCharge(selectedItems) {
  if(selectedItems.toString() === "") return "";

  let totalPrice = 0;

  let checkout = "============= 订餐明细 =============\n";

  selectedItems.forEach(function(selectedItem) {

    let itemIDQuantityPair = selectedItem.split(" x ");
    let itemQuantity = itemIDQuantityPair[1];
    let item = getItemById(itemIDQuantityPair[0]);
    let itemSumPrice = itemQuantity * item.price;

    totalPrice += itemSumPrice;
    checkout += item.name + " x "+ itemQuantity + " = " + itemSumPrice +"元\n";
  });


  checkout += "-----------------------------------\n";
  checkout += "总计：" + totalPrice +"元\n";
  checkout += "===================================";

  return checkout;
}




module.exports.bestCharge = bestCharge;

