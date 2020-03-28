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