
let loadAllItems = require('./items.js');
let loadPromotions = require('./promotions.js');


function bestCharge(selectedItems) {
  let AllItems = GetAllItems();
  let OrderList = GetOrderList(AllItems, selectedItems);
  let Promotion = GetBestPromotion(AllItems, OrderList);
  return PrintCheckout(OrderList, Promotion);
}


/*
 * 函数功能：
 * 给定订单列表和折扣方案，PrintCheckout() 用于输出格式化的账单。
 *
 * 输入参数：
 * - OrderList：（ID，菜品名，数量，价格）的订单列表。
 * - Promotion: 折扣方案
 */

function PrintCheckout(OrderList, Promotion) {

  let checkout = "============= 订餐明细 =============\n";

  let OrderCharge = 0;
  for(let o in OrderList) {
    let item = OrderList[o];
    checkout += item.name + " x "+ item.count + " = " + item.totalprice + "元\n";
    OrderCharge += item.totalprice;
  }

  if (Promotion === null) {
    checkout += "-----------------------------------\n";
    checkout += "总计：" + OrderCharge  + "元\n";
    checkout += "===================================";
    return checkout;
  }

  if(Promotion.type === "满30减6元") {
    checkout += "-----------------------------------\n";
    checkout += "使用优惠:\n";
    checkout += Promotion.type + "，省" + Promotion.save + "元\n";
  } else if (Promotion.type === "指定菜品半价") {
    checkout += "-----------------------------------\n";
    checkout += "使用优惠:\n";
    checkout += Promotion.tag + "，省" + Promotion.save + "元\n";
  }

  checkout += "-----------------------------------\n";
  checkout += "总计：" + (OrderCharge - Promotion.save) + "元\n";
  checkout += "===================================";

  return checkout;
}


/*
 * 函数功能：
 * GetAllItems() 用于计算包含 菜品编号 id => {菜品名 name , 价格 price} 对应关系的字典
 * 依赖外部函数 loadAllItems()。
 *
 */

function GetAllItems() {
  let AllItems = loadAllItems();

  let items = new Array();
  for(let key in AllItems) {
    let item = AllItems[key];
    items[item.id] = {name: item.name, price: item.price};
  }
  return items;
}

/*
 * 函数功能：
 * GetOrderList() 用于转换订单为包含（菜品名，数量，价格）的订单列表。
 *
 * 输入参数：
 * - AllItems：菜品编号 id => {菜品名 name , 价格 price} 的字典
 * - selectedItems：订单明细
 *
 * 用例:
 *
 * 输入：
 * order：["ITEM0001 x 1", "ITEM0013 x 2"]
 *
 * AllItems：{
 *      'ITEM0001': {name: '黄焖鸡', price: 18.00},
 *      'ITEM0013': {name: '肉夹馍', price: 6.00},
 *      'ITEM0022': {name: '凉皮', price: 8.00},
 *    };
 *
 * 输出：
 * [
 *  {
 *    id: "ITEM0001",
 *    name: 黄焖鸡,
 *    count: 1,
 *    price: 18.0,
 *  },
 *  {
 *    id: "ITEM0013",
 *    name: 肉夹馍,
 *    count: 2,
 *    price: 6.0,
 *  }
 * ]
 */


function GetOrderList(AllItems, selectedItems) {

  let OrderList = new Array();

  selectedItems.forEach(function(entry) {
    result = entry.split(' x ');
    let id = result[0];
    let count = Number(result[1]);
    let name = AllItems[id].name;
    let totalprice = AllItems[id].price * count;
    OrderList.push({id: id, name: name, count: count, totalprice: totalprice});
  });

  return OrderList;
}


/*
 * 函数说明：
 * CalcPromotionSave2() 用于计算 "指定菜品半价" 方案的折扣
 *
 * 输入参数：
 * - PromoteItems：指定优惠菜品列表
 * - OrderList：（ID，菜品名，数量，价格）的订单列表。
 *
 * 输出参数：
 * save2：折扣金额
 */

function CalcPromotionSave2(PromoteItems, OrderList) {
  let save2 = 0;
  for(let i = 0; i < PromoteItems.length; i++) {
    for (let j = 0; j < OrderList.length; j++) {
      if (PromoteItems[i] === OrderList[j].id) {
        save2 += 0.5 * OrderList[j].totalprice;
        break;
      }
    }
  }
  return save2;
}

/*
 * 函数说明：
 * IsPromotion1() 用于判断订单是否满足 "满30减6元" 优惠方案
 *
 */

function IsPromotion1(OrderList) {
  let sum = 0;
  for (let i = 0; i < OrderList.length; i++) {
    sum += OrderList[i].totalprice;
  }
  if(sum >= 30) return true;
  else return false;
}

/*
 * 函数说明：
 *
 * GetBestPromotion() 用于计算两种优惠方式的折扣，以返回最佳优惠方案和折扣金额。
 * 当不满足优惠条件时，返回 null。依赖于外部函数 loadPromotions()。
 *
 * 输入参数：
 * - AllItems: 菜品编号 id => {菜品名 name , 价格 price} 的字典
 * - OrderList：（ID，菜品名，数量，价格）的订单列表。
 *
 * 输出参数：
 * - BestPromotion: 优惠方案类别
 * - save1: 折扣金额
 */

function GetBestPromotion(AllItems, OrderList) {

  let Promotions = loadPromotions();
  let BestPromotion = null;
  let save1 = 0;
  let save2 = 0;
  var tag;
  for (let key in Promotions) {
    let prom = Promotions[key];
    if (prom.type === "满30减6元") {
      if (IsPromotion1(OrderList) && save2 <= 6) {
        BestPromotion = "满30减6元";
        save1 = 6;
      }
    } else if (prom.type === "指定菜品半价") {
      save2 = CalcPromotionSave2(prom.items, OrderList);
      if (save2 > save1) {
        BestPromotion = "指定菜品半价";
        save1 = save2;
        tag = "指定菜品半价(";
        for(var i = 0; i < prom.items.length; i++) {
          let id = prom.items[i];
          tag += AllItems[id].name + "，";
        }
        tag = tag.slice(0, tag.length - 1) + ")";
      }
    }
  }

  if(BestPromotion === null) {
    return null;
  } else if(BestPromotion === "满30减6元") {
    return {type: BestPromotion, save: save1};
  } else {
    return {type: BestPromotion, tag: tag, save: save1};
  }
}

module.exports.bestCharge = bestCharge;
module.exports.PrintCheckout = PrintCheckout;
module.exports.GetOrderList = GetOrderList;
module.exports.GetBestPromotion = GetBestPromotion;
module.exports.CalcPromotionSave2 = CalcPromotionSave2;
