
let loadAllItems = require('./items.js');
let loadPromotions = require('./promotions.js');


let getItemById = function (itemID) {
  let itemArray= loadAllItems();
  let index = itemArray.findIndex(obj => obj.id === itemID);
  return itemArray[index];
};

function bestCharge(selectedItems) {
  if(selectedItems.toString() === "") return "";

  let checkout = "============= 订餐明细 =============\n";
  let itemIDQuantityPair = selectedItems[0].split(" x ");
  let item = getItemById(itemIDQuantityPair[0]);

  checkout += item.name + " x 1 = " + item.price +"元\n";
  checkout += "-----------------------------------\n";
  checkout += "总计：" + item.price +"元\n";
  checkout += "===================================";

  return checkout;
}




module.exports.bestCharge = bestCharge;

