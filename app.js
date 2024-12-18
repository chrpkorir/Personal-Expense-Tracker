
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const transactionForm = document.getElementById('transactionForm')
const transactionTable = document.getElementById('transactionTable')
const totalIncome = document.getElementById('totalIncome')
const totalExpenses = document.getElementById('totalExpenses')
const balance = document.getElementById('balance')
const convertCurrency = document.getElementById('convertCurrency')

//Update the Interface
function updateInterface(){
    transactionTable.innerHTML = '';
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction, index) => {
        //add income and expense as per transaction type
        if(transaction.type === 'income'){
            income += parseFloat(transaction.amount)
        }
        else {
            expense += parseFloat(transaction.amount)
        }

        transactionTable.innerHTML += `
         <tr>
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction(${index})">Delete</button></td>
        </tr> `
    })
    // update totals in the interface
    totalIncome.textContent = income.toFixed(2);
    totalExpenses.textContent = expense.toFixed(2)
    balance.textContent = (income - expense).toFixed(2)
}

// Fuction to Add Transactions
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // collect user input
    const description = document.getElementById('description').value.trim(); 
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (!description || isNaN(amount) || amount <= 0){
        alert('Enter valid transaction details');
        return;
    }
 
    // Add transactions to array and save them in localStorage
    transactions.push({description, amount, type});
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Update the interface and reset the Form
    updateInterface();
    transactionForm.reset()
})

// Delete Transaction
function deleteTransaction(index){
    transactions.splice(index, 1) //removes transaction by index
    localStorage.setItem('transactions', JSON.stringify(transactions)); // save changes made
    updateInterface(); //updates Interface
}

//Convert Balanace to USD
convertCurrency.addEventListener('click', async() => {
    try{
    const response = await
    fetch(URL)// change to base currency
    const data = await response.json()
    const usdRate = data.rates.USD;
    const currentBalance = parseFloat(balance.textContent);
    alert(`Balance in USD: ${(currentBalance * usdRate).toFixed(2)}`); 
    }
    catch (error){
        alert('Failed to fetch currency rates')
    }
});

updateInterface()