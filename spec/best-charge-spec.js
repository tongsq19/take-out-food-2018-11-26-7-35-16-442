var main = require('../src/best-charge.js');


describe("test PrintCheckout()", function() {
  it('Scene 1：指定菜品半价', function () {

    var OrderList = [
      {name: "黄焖鸡", count: 1, totalprice: 18},
      {name: "肉夹馍", count: 2, totalprice: 12},
      {name: "凉皮", count: 1, totalprice: 8},
    ];

    var Promotion = {type: "指定菜品半价", tag: "指定菜品半价(黄焖鸡，凉皮)", save: 13};
    var expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();

    let result = main.PrintCheckout(OrderList, Promotion);
    expect(result).toEqual(expected);
  });

  it('Scene 2：满30减6元', function () {

    var OrderList = [
      {name: "肉夹馍", count: 4, totalprice: 24},
      {name: "凉皮", count: 1, totalprice: 8},
    ];

    var Promotion = {type: "满30减6元", save: 6};
    var expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();

    let result = main.PrintCheckout(OrderList, Promotion);
    expect(result).toEqual(expected);
  });

  it('Scene 3：无优惠', function () {

    var OrderList = [
      {name: "肉夹馍", count: 4, totalprice: 24},
    ];

    var Promotion = null;
    var expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();

    let result = main.PrintCheckout(OrderList, Promotion);
    expect(result).toEqual(expected);
  })
});


describe("test GetOrderList()", function() {

  it("Example: [\"ITEM0001 x 1\", \"ITEM0013 x 2\", \"ITEM0022 x 1\"]", function() {
    let order = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let expected = [
      {id: "ITEM0001", name: "黄焖鸡", count: 1, totalprice: 18},
      {id: "ITEM0013", name: "肉夹馍", count: 2, totalprice: 12},
      {id: "ITEM0022", name: "凉皮", count: 1, totalprice: 8},
    ];
    let items = {
      'ITEM0001': {name: '黄焖鸡', price: 18.00},
      'ITEM0013': {name: '肉夹馍', price: 6.00},
      'ITEM0022': {name: '凉皮', price: 8.00},};

    let result = main.GetOrderList(items, order);
    expect(result).toEqual(expected);
  });

});


describe("test CalcPromotionSave2()", function() {

  it("return 0, 无优惠", function() {
      let orderList = [
        {id: "ITEM0001", name: "黄焖鸡", count: 1, totalprice: 18},
        {id: "ITEM0013", name: "肉夹馍", count: 1, totalprice: 12},
      ];
      let promotionItems = ['ITEM0022'];
      let result = main.CalcPromotionSave2(promotionItems, orderList);
      expect(result).toEqual(0);
  });

  it("return 6", function() {
    let orderList = [
      {id: "ITEM0001", name: "黄焖鸡", count: 1, totalprice: 18},
      {id: "ITEM0013", name: "肉夹馍", count: 1, totalprice: 12},
    ];
    let promotionItems = ['ITEM0013'];
    let result = main.CalcPromotionSave2(promotionItems, orderList);
    expect(result).toEqual(6);
  });

  it("return 15", function() {
    let orderList = [
      {id: "ITEM0001", name: "黄焖鸡", count: 1, totalprice: 18},
      {id: "ITEM0013", name: "肉夹馍", count: 2, totalprice: 12},
    ];
    let promotionItems = ["ITEM0001", 'ITEM0013'];
    let result = main.CalcPromotionSave2(promotionItems, orderList);
    expect(result).toEqual(15);
  });
});

describe("test GetBestPromotion()", function() {
  it("1 > 2", function() {
    let orderList = [
      {id: "ITEM0013", name: "肉夹馍", count: 4, totalprice: 24},
      {id: "ITEM0022", name: "凉皮", count: 1, totalprice: 8},
    ];
    let items = {
      'ITEM0001': {name: '黄焖鸡', price: 18.00},
      'ITEM0013': {name: '肉夹馍', price: 6.00},
      'ITEM0022': {name: '凉皮', price: 8.00},};

    let expected = {type:"满30减6元", save: 6};
    let result = main.GetBestPromotion(items, orderList);
    expect(result).toEqual(expected);
  });

  it("1 = 2", function() {
    let orderList = [
      {id: "ITEM0013", name: "肉夹馍", count: 4, totalprice: 24},
      {id: "ITEM0022", name: "凉皮", count: 1, totalprice: 12},
    ];
    let items = {
      'ITEM0001': {name: '黄焖鸡', price: 18.00},
      'ITEM0013': {name: '肉夹馍', price: 6.00},
      'ITEM0022': {name: '凉皮', price: 8.00},};

    let expected = {type:"满30减6元", save: 6};
    let result = main.GetBestPromotion(items, orderList);
    expect(result).toEqual(expected);
  });

  it("1 < 2", function() {
    let orderList = [
      {id: "ITEM0001", name: "黄焖鸡", count: 1, totalprice: 18},
      {id: "ITEM0013", name: "肉夹馍", count: 2, totalprice: 12},
      {id: "ITEM0022", name: "凉皮", count: 1, totalprice: 8},
    ];
    let items = {
      'ITEM0001': {name: '黄焖鸡', price: 18.00},
      'ITEM0013': {name: '肉夹馍', price: 6.00},
      'ITEM0022': {name: '凉皮', price: 8.00},};

    let expected = {type:"指定菜品半价", tag:"指定菜品半价(黄焖鸡，凉皮)", save: 13};
    let result = main.GetBestPromotion(items, orderList);
    expect(result).toEqual(expected);
  });

  it("无优惠", function() {
    let orderList = [{id: "ITEM0013", name: "肉夹馍", count: 2, totalprice: 12}];
    let expected = null;
    let items = {
        'ITEM0001': {name: '黄焖鸡', price: 18.00},
        'ITEM0013': {name: '肉夹馍', price: 6.00},
        'ITEM0022': {name: '凉皮', price: 8.00},};

    let result = main.GetBestPromotion(items, orderList);
    expect(result).toEqual(expected);
  });
});


describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = main.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = main.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = main.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});
