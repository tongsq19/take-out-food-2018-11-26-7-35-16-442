
let loadAllItems = require('./items.js');
let loadPromotions = require('./promotions.js');


let getItemById = function (itemID) {
  let itemArray= loadAllItems();
  let index = itemArray.findIndex(obj => obj.id === itemID);
  return itemArray[index];
};

let isOrderSatisfyPromotionType2 = function (selectedItems) {
  let promotionList = loadPromotions();
  let index = promotionList.findIndex(obj => obj.type === "指定菜品半价");
  let promotionItems = promotionList[index].items;

  return promotionItems.reduce(function(prevResult, item) {
    let isContain = selectedItems.toString().includes(item);
    return prevResult | isContain;
  }, false);
};

let calcPromotionType2 = function(selectedItems) {
  let promotionList = loadPromotions();
  let index = promotionList.findIndex(obj => obj.type === "指定菜品半价");
  let promotionItems = promotionList[index].items;
  let promotionItemName = promotionItems.map(id => getItemById(id).name);

  let order = selectedItems.map(item => item.split(" x "));

  let save = promotionItems.reduce(function(prevSum, itemId) {
    let index = order.findIndex(item => itemId === item[0]);
    if(index !== -1) {
      let quantity = order[index][1];
      return prevSum + 0.5*getItemById(itemId).price * quantity;
    } else {
      return prevSum;
    }
  }, 0);

  return {nameString: promotionItemName.join("，"), save: save};
};


let isOrderSatisfyPromotionType1 = function(totalPrice) {
  return totalPrice >= 30;
};

let getBestPromotion =function(selectedItems, totalPrice) {

  let promotionType = null;
  let promotionSave = 0;
  let resultPromotionType2 = {};

  if(isOrderSatisfyPromotionType2(selectedItems)) {
    resultPromotionType2 = calcPromotionType2(selectedItems);

    if(isOrderSatisfyPromotionType1(totalPrice)) {
      if(resultPromotionType2.save <= 6) {
        promotionType = "满30减6元";
        promotionSave = 6;
      } else {
        promotionType = "指定菜品半价";
        promotionSave = resultPromotionType2.save;
      }
    } else {
      promotionType = "指定菜品半价";
      promotionSave = resultPromotionType2.save;
    }
  } else if(isOrderSatisfyPromotionType1(totalPrice)) {
    promotionType = "满30减6元";
    promotionSave = 6;
  }

  let checkout="";
  if(promotionType === "满30减6元") {
    checkout += "-----------------------------------\n";
    checkout += "使用优惠:\n";
    checkout += "满30减6元，省6元\n";
  } else if (promotionType === "指定菜品半价") {
    checkout += "-----------------------------------\n";
    checkout += "使用优惠:\n";
    checkout += "指定菜品半价("+resultPromotionType2.nameString+")，省"+ promotionSave+"元\n";
  }
  return {checkout: checkout, save: promotionSave};
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

  let bestPromotion = getBestPromotion(selectedItems, totalPrice);
  checkout += bestPromotion.checkout;
  checkout += "-----------------------------------\n";
  checkout += "总计：" + (totalPrice - bestPromotion.save) +"元\n";
  checkout += "===================================";

  return checkout;
}






module.exports.bestCharge = bestCharge;

