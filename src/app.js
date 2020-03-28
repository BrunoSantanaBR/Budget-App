function consoleDebug(msg){

  DEBUG_MODE = true;

  if (DEBUG_MODE){
    return console.log(msg);
  }
}

//BUDGET CONTROLLER
var budgetController = (function() {
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  //Function constructor for Expense object
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentages = function (totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);  
    }else{
      return -1;
    }
  };

  Expense.prototype.getPercentage = function (){
    return this.percentage;
  }

  //Function constructor for Income object
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var caculateTotal = function(type){
    consoleDebug("BudgetController - Calculate total - Start");

    var sum = 0;

    data.allItems[type].forEach(function(currentItem){
        sum += currentItem.value;
    });

    data.totals[type] = sum;

    consoleDebug("BudgetController - Calculate total - End");
  };

  return {
    addItem: function(type, des, val) {
      consoleDebug("BudgetController - Add item - Start");

      var newItem, ID;

      //Create new ID
      data.allItems[type].length > 0
        ? (ID = data.allItems[type][data.allItems[type].length - 1].id + 1)
        : (ID = 0);

      //Create new item based on 'inc' or 'exp' type
      if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, des, val);
      }

      //Add the item to the data structure
      data.allItems[type].push(newItem);

      consoleDebug("BudgetController - Add item - End");

      //Return the new item
      return newItem;
    },

    deleteItem: function(type, ID){
      consoleDebug("BudgetController - Delete item - Start");

      var ids, index;

      ids = data.allItems[type].map(function(currentItem){ //Loop trough an array and returns a new array
        return currentItem.id;
      });

      index = ids.indexOf(ID);

      if (index !== -1){
        data.allItems[type].splice(index, 1); //Deletes an element inside an array 
      }else{
        consoleDebug("BudgetController - Delete item - Error on delete item. Item does not exist.");
      }
    },

    calculateBudget: function(type){
      consoleDebug("BudgetController - Calculate budget - Start");

      var typePercentage = "totalPercentage";

      // 1. Calculate total income and expenses
      caculateTotal(type);

      // 2. Calculate the budget Income - Expenses
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate the % of what we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
      }else{
        return -1;
      }

      consoleDebug("BudgetController - Calculate budget - End");
    },

    calculatePercentages: function(){
      consoleDebug("BudgetController - Calculate percentages - Start");
            
      data.allItems.exp.forEach(function(currentItem){
        currentItem.calcPercentages(data.totals.inc);
      });

      consoleDebug("BudgetController - Calculate percentages - End");
    },

    getPercentages: function(){
      consoleDebug("BudgetController - Get percentages - Start");

      var allPercentages = data.allItems.exp.map(function(currentItem){
        return  currentItem.getPercentage();
      });

      consoleDebug("BudgetController - Get percentages - End");

      return allPercentages;
    },

    getBudget: function(){
        return {
            budget: data.budget,
            percentage: data.percentage,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp
        }
    }

  };
})();

//USER INTERFACE CONTROLLER
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    buttonAdd: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    totalIncLabel: ".budget__income--value",
    totalExpLabel: ".budget__expenses--value",
    budgetLabel: ".budget__value",
    percentageLabel: ".budget__expenses--percentage",
    expPercentageLabel: ".item__percentage",
    container: ".container",
    dateLabel: ".budget__title--month"
  };

  var formatNumber = function(num, type){
    consoleDebug("UIController - Format number - Start");

    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length -3) + ',' + int.substr(int.length -3, 3);
    }

    dec = numSplit[1];

    consoleDebug("UIController - Format number - End");

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  var nodeListForEach = function(list, callback){
    for (var i = 0; i < list.length; i++){
        callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      consoleDebug("UIController - Add list item - Start");

      var html, newHTML, element;

      //Create Html string with placeholder text %variable%
      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%expPercentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with some actual data
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", formatNumber(obj.value, type));

      //Insert the Html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);

      consoleDebug("UIController - Add list item - End");
    },

    deleteListItem: function(itemID){
      consoleDebug("UIController - Delete list item - Start");

      var elementDOM = document.getElementById(itemID);

      elementDOM.parentNode.removeChild(elementDOM);

      consoleDebug("UIController - Delete list item - End");
    },

    clearFields: function() {
      consoleDebug("UIController - Clear fields - Start");

      var fields, fieldsarr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      fieldsarr = Array.prototype.slice.call(fields);

      fieldsarr.forEach(function(currentItem) {
        currentItem.value = "";
      });

      fieldsarr[0].focus();

      consoleDebug("UIController - Clear fields - End");
    },

    displayBudget: function(objBudget){
      consoleDebug("UIController - Display budget - Start");
      
      var type;
      objBudget.budget > 0 ? type = 'inc' : type = 'exp';
      
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(objBudget.budget, type);
      
      document.querySelector(DOMstrings.totalIncLabel).textContent = formatNumber(objBudget.totalInc, 'inc');
      document.querySelector(DOMstrings.totalExpLabel).textContent = formatNumber(objBudget.totalExp, 'exp');
      
      if (objBudget.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = objBudget.percentage + '%';
      } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = '-';
      }

      consoleDebug("UIController - Display budget - End");
    },

    displayPercentages: function(percentages){
      consoleDebug("UIController - Display item percentage - Start");
      
      var fields = document.querySelectorAll(DOMstrings.expPercentageLabel);

      nodeListForEach(fields, function(currentItem, index){
          if (percentages[index] > 0){
            currentItem.textContent = percentages[index] + '%';
          }else{
            currentItem.textContent = '-';
          }
          
      });

      consoleDebug("UIController - Display item percentage - End");
    },

    displayDate: function(){
      consoleDebug("UIController - Display date - Start");

      var now, month, months, year;

      months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

      now = new Date();

      month = now.getMonth();
      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;

      consoleDebug("UIController - Display date - End");
    },

    changeType: function(){

      var fields = document.querySelectorAll(
        DOMstrings.inputType + "," +
        DOMstrings.inputDescription + "," +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(currentItem){
        currentItem.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.buttonAdd).classList.toggle("red");


    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

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

