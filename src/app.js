//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {
  var setupEventListeners = function() {
    var DOM = uiCtrl.getDOMstrings();

    document.querySelector(DOM.buttonAdd).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener("change", uiCtrl.changeType);

  };

  var updateBudget = function(type) {
    consoleDebug("Controller - Update budget - Start");
    
    var budget;

    // 1. Calculate the budget
    budgetCtrl.calculateBudget(type);

    // 2. Return the budget
    budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    uiCtrl.displayBudget(budget);

    consoleDebug("Controller - Update budget - End");
  };

  var updatePercentages = function(){
    consoleDebug("Controller - Update item percentage - Start");

    var percentages;

    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    percentages = budgetCtrl.getPercentages();

    // 3. Update UI with new percentages
    uiCtrl.displayPercentages(percentages);

    consoleDebug("Controller - Update item percentage - End");
  }

  var ctrlAddItem = function() {
    consoleDebug("Controller - Add item - Start");
    
    var input, newItem;

    // 1. Get the field input data
    input = uiCtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      uiCtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      uiCtrl.clearFields();

      // 5. Calculate and display the budget
      updateBudget(input.type);

      // 6. Calculate and update percentages
      updatePercentages();

    }else{
      consoleDebug("Controller - Add item - No item added, empty input field");
    }

    consoleDebug("Controller - Add item - End");
  };

  var ctrlDeleteItem = function(event){
    consoleDebug("Controller - Delete item - Start");
    
    var ID, type, itemID, splitItemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID){
      splitItemID = itemID.split("-");
      type = splitItemID[0];
      ID = parseInt(splitItemID[1]); //Convert the string ID to int

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      uiCtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget(type);

      // 4. Calculate and update percentages
      updatePercentages();

    }

    consoleDebug("Controller - Delete item - End");
  };

  return {
    init: function() {
      consoleDebug("Starting the application.");
      
      uiCtrl.displayDate();

      uiCtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalInc: 0,
        totalExp: 0
      });

      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();

