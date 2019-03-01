let main = require('../src/best-charge.js');


describe("take out food", function() {
  it('Scenario1 : Should return empty string when given empty selectedItem', function () {
    let selectedItem = [];
    let actual = main.bestCharge(selectedItem);
    expect("").toEqual(actual);
  });

  it('Scenario2 : 单份菜品', function() {
    let selectedItem = ["ITEM0013 x 1"];
    let actual = main.bestCharge(selectedItem);
    let expected="============= 订餐明细 =============\n" +
      "肉夹馍 x 1 = 6元\n" +
      "-----------------------------------\n" +
      "总计：6元\n" +
      "===================================";

    expect(expected).toEqual(actual);
  });

  it('Scenario3 : 双份菜品', function() {
    let selectedItem = ["ITEM0013 x 2"];
    let actual = main.bestCharge(selectedItem);
    let expected="============= 订餐明细 =============\n" +
      "肉夹馍 x 2 = 12元\n" +
      "-----------------------------------\n" +
      "总计：12元\n" +
      "===================================";

    expect(expected).toEqual(actual);
  });

  it('Scenario4 : 多种菜品', function() {
    let selectedItem = ["ITEM0013 x 1", "ITEM0030 x 1"] ;
    let actual = main.bestCharge(selectedItem);
    let expected="============= 订餐明细 =============\n" +
      "肉夹馍 x 1 = 6元\n" +
      "冰锋 x 1 = 2元\n" +
      "-----------------------------------\n" +
      "总计：8元\n" +
      "===================================";

    expect(expected).toEqual(actual);
  });

  it('Scenario5 : "指定菜品半价"优惠', function() {
    let selectedItem = ["ITEM0001 x 1", "ITEM0022 x 1"] ;
    let actual = main.bestCharge(selectedItem);
    let expected="============= 订餐明细 =============\n" +
      "黄焖鸡 x 1 = 18元\n" +
      "凉皮 x 1 = 8元\n" +
      "-----------------------------------\n" +
      "使用优惠:\n" +
      "指定菜品半价(黄焖鸡，凉皮)，省13元\n" +
      "-----------------------------------\n" +
      "总计：13元\n" +
      "===================================";

    expect(expected).toEqual(actual);
  });

  it('Scenario6 : 同时满足"满30减6元"', function() {
    let selectedItem = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let actual = main.bestCharge(selectedItem);
    let expected="============= 订餐明细 =============\n" +
      "肉夹馍 x 4 = 24元\n" +
      "凉皮 x 1 = 8元\n" +
      "-----------------------------------\n" +
      "使用优惠:\n" +
      "满30减6元，省6元\n" +
      "-----------------------------------\n" +
      "总计：26元\n" +
      "===================================";

    expect(expected).toEqual(actual);
  });
});

