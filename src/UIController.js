
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
  