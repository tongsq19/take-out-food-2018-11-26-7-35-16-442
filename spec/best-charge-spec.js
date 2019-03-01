let main = require('../src/best-charge.js');


describe("take out food", function() {
  it('Scenario1 : Should return empty string when given empty selectedItem', function () {
    let selectedItem = [];
    let actual = main.bestCharge(selectedItem);
    expect("").toEqual(actual);
  });


});

