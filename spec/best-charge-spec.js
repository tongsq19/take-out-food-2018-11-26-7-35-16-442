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

});

