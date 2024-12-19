
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let rate = {};

const form = document.getElementById('transactionForm')
const transactionTable = document.getElementById('transactionTable')
const totalIncome = document.getElementById('tIncome')
const totalExpense = document.getElementById('tExpenses')
const balance = document.getElementById('balance')
const convertCurrency = document.getElementById('convertCurrency')
const indexTransaction  = document.getElementById('transactIndex')
const currencySelect = document.getElementById('selectCurrency')


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
            <td><button id="editbutton" onclick="editTransact(${index})">Edit</button></td>
            <td><button id="deletebutton" onclick="deleteTransaction(${index})">Delete</button></td>
        </tr> `
    })
    // update totals in the interface
    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2)
    balance.textContent = (income - expense).toFixed(2)
}

// Fuction to Add Transactions
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    console.log("Form submitted")
    // collect user input
    const description = document.getElementById('description').value.trim(); 
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const index = parseInt(indexTransaction.value);

    if (!description || isNaN(amount) || amount <= 0){
        alert('Input valid transaction details');
        return;
    } 
    if (index === -1){
        // Add transactions to array and save them in localStorage
        transactions.push({description, amount, type});
    }
    else {
        // it updates existing transactions
        transactions[index] = {description, amount, type}
        indexTransaction.value = -1
    }
    const jsonString = JSON.stringify(transactions)
    localStorage.setItem('transactions', jsonString);
    
    // Update the interface and reset the Form
    updateInterface();
    form.reset()
})

// Edit Transaction
function editTransact(index){
    const trans = transactions[index]
    document.getElementById('description').value =trans.description
    document.getElementById('amount').value = trans.amount
    document.getElementById('type').value = trans.type
    indexTransaction.value = index
    
}

// Delete Transaction
function deleteTransaction(index){
    transactions.splice(index, 1) //deletes a transaction by using anindex
    const jsonString = JSON.stringify(transactions)
    localStorage.setItem('transactions', jsonString); // save the changes made after deleting
    updateInterface(); 
}

//Convert Balance from KES to any currency that is chosen
async function getExchangeRate() {
    try{
        const res = await
        fetch('https://v6.exchangerate-api.com/v6/c727415aa27c6cb419a7b0e5/latest/KES');// change to base currency
        if (!res.ok){
            throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json()
        rate = data.conversion_rates;

        //currency dropdown
        currencySelect.innerHTML
        for (const currency in rate){
            const option = document.createElement('option')
            option.value = currency
            option.textContent = currency
            currencySelect.appendChild(option)
    }
    }   
    catch(error){
        alert('Could not fetch currency rates, try again later')
    }
}

// convert balance to selected currency
convertCurrency.addEventListener('click', () => {
    const selectedCurrency = currencySelect.value
    if (!selectedCurrency){
        alert('Kindly select a currency')
        return
    }

    const currentBalance = parseFloat(balance.textContent);
    const conversionRate = rate[selectedCurrency]

    if (conversionRate){
        alert(`Balance in ${selectedCurrency}: ${(currentBalance * conversionRate).toFixed(2)}`); 
    }
})

// Initialize the app
getExchangeRate()

updateInterface()