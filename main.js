let total_amount = 0;
let total_element = document.getElementById("total_amount");

// Function to update the total value
function updateTotal() {
    total_element.innerHTML = total_amount;
    saveData();  // Save data whenever the total amount is updated
}

// Function to display today's date
function getCurrentDate() {
    const today = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return today.toLocaleDateString('en-US', options);
}

// Adding responsiveness in add function
let add = document.querySelector(".btn1");
add.addEventListener("click", (e) => {
    const amountInput = parseInt(prompt("Amount received 🤑🤑"));
    const areaInput = prompt("Where do you get the money 🤷🤷");
    const date = getCurrentDate();
    if (!isNaN(amountInput) && amountInput > 0) {
        total_amount += amountInput;
        add_to_table(date, areaInput, amountInput);  // Add the transaction to the table
        updateTotal();
        saveData(areaInput, amountInput);  // Save data after the transaction
    } else {
        console.log("Enter a valid number");
    }
});

// Adding responsiveness in withdraw function
let draw = document.querySelector(".btn2");
draw.addEventListener("click", (e) => {
    const amountInput = parseInt(prompt("Amount Spend 😠😠"));
    const areaInput = prompt("Where do you spend the money 🤷🤷");
    const date = getCurrentDate();
    if (!isNaN(amountInput) && amountInput > 0) {
        total_amount -= amountInput;
        add_to_table(date, areaInput, -amountInput);  // Add the transaction to the table
        updateTotal();
        saveData(areaInput, -amountInput);  // Save data after the transaction
    } else {
        console.log("Enter a valid number");
    }
});

// Function to add row to the table
function add_to_table(date, area, amount) {
    if (area && amount) {  // Only add rows when area and amount are valid
        const table = document.getElementById("expense_table").getElementsByTagName("tbody")[0];
        const newRow = table.insertRow(0);
        
        const datecell = newRow.insertCell(0);
        const areacell = newRow.insertCell(1);
        const amountcell = newRow.insertCell(2);

        datecell.textContent = date;
        areacell.textContent = area;
        amountcell.textContent = amount;

        if(amount < 0){
            amountcell.style.color = "red";
        }else{
            amountcell.style.color = "green";
        }
    }
}

// Saving data to localStorage
function saveData(area, amount) {
    // Save the total amount
    localStorage.setItem("amount", JSON.stringify(total_amount));

    // Save the expenses (add and withdraw transactions)
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    // Only push to localStorage if area and amount are valid
    if (area && amount) {
        const transaction = { date: getCurrentDate(), area: area, amount: amount };
        expenses.push(transaction);
    }
    
    localStorage.setItem("expenses", JSON.stringify(expenses));

}

// Function to load saved data from localStorage and append it to the table
function loadSavedData() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(expense => {
        // Only load data if area and amount are present
        if (expense.area && expense.amount) {
            add_to_table(expense.date, expense.area, expense.amount);  // Add each transaction to the table
        }
    });
    
    const savedAmount = JSON.parse(localStorage.getItem("amount"));
    if (savedAmount !== null) {
        total_amount = savedAmount;  // Update the total_amount variable
        total_element.innerHTML = total_amount;
    }
}

loadSavedData();  // Load saved data on page load

function remove(){
    // Clear the stored data from localStorage
    // localStorage.removeItem("amount");  // Remove the total amount
    localStorage.removeItem("expenses");  // Remove all expenses

    // Optionally, reset the total_amount variable and UI
    // total_amount = 0;
    // total_element.innerHTML = total_amount;

    // Clear the table of expenses
    const table = document.getElementById("expense_table").getElementsByTagName("tbody")[0];
    table.innerHTML = "";  // Clear all rows in the table

    console.log("History removed and data cleared!");
}


function reset(){
    const pass = prompt("enter the passward");
    if(pass != "conform"){
        console.log("Incorrect Passward");
    }else{
        localStorage.removeItem("amount");  // Remove the total amount
        localStorage.removeItem("expenses");  // Remove all expenses

        total_amount = 0;
        total_element.innerHTML = total_amount;

        const table = document.getElementById("expense_table").getElementsByTagName("tbody")[0];
        table.innerHTML = "";  // Clear all rows in the table
        
        console.log("value reset");    
    }
}