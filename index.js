let change = 0;
let moneyInserted = 0;
let msg = "";
let msgEl = document.getElementById("message");
const products = ["Twix", "Chocolate", "Brownie"];
const price = 2;
let totalPaid = 0;


function getTotal() {
  const coins = [
    { id: "5", value: 5 },
    { id: "2", value: 2 },
    { id: "1", value: 1 },
    { id: "0.1", value: 0.1 }
  ];

  let totalPaid = 0;

  for (const coin of coins) {
    const coinInput = document.getElementById(coin.id);
    const coinNumber = Number(coinInput.value);

    if (coinNumber > 0) {
      totalPaid += coinNumber * coin.value;
    }
  }

  return totalPaid.toFixed(2);
}

function tally() {
  moneyInserted = getTotal();
  document.getElementById("Total").innerHTML = moneyInserted;
}

function clearTally() {
  moneyInserted = 0;
  document.getElementById("Total").innerHTML = moneyInserted;
}

function clearForm() {
  document.getElementById("5").value = "";
  document.getElementById("2").value = "";
  document.getElementById("1").value = "";
  document.getElementById("0.1").value = "";
}

function cancel() {
  getTotal();

  if (totalPaid > 0) {
    msg =
      "Transaction cancelled. €" + totalPaid.toFixed(2) + " has been returned";
    clearForm();
    clearTally();

    msgEl.innerHTML = msg;
  } else if (totalPaid == 0) {
    msg = "First of all, you need to insert your money";

    msgEl.innerHTML = msg;
  }
}

function calculateChange() {
  var tempChange = 0;
  if (getTotal() != 0) {
    return (tempChange = (getTotal() - price).toFixed(2));
  }

  return tempChange.toFixed(2);
}

function dispenseProduct(product) {
  msgEl.innerHTML = "";
  change = 0;

  var selectedProduct = products[product];

  change = calculateChange();

  if (change < 0) {
    msg =
      "You have not paid enough. €" +
      totalPaid.toFixed(2) +
      " has been returned.";

    totalPaid = 0;
    change = 0;
    clearForm();
    clearTally();

    msgEl.innerHTML = msg;
  } else if (change > 0) {
    msg = selectedProduct + " has been bought. €" + change + " returned.";

    totalPaid = 0;
    change = 0;
    clearForm();
    clearTally();

    msgEl.innerHTML = msg;
  } else if (totalPaid == 0) {
    msg = "Please insert the right amount of money";

    msgEl.innerHTML = msg;
  } else if (change == 0) {
    msg = selectedProduct + " has been bought";

    totalPaid = 0;
    change = 0;
    clearForm();
    clearTally();

    msgEl.innerHTML = msg;
  }
}


function description() {

  if (document.getElementById('description').click)
    document.getElementById('description').innerHTML ="A vending machine sells candies for €2 each. You can insert money in coins in various denominations (for example 2 x 3 + 1 x 5 + 0.10 x2 = 11.20). When a candy is requested and the machine has the required amount of money, you can purchase it. When the required amount is too much - it gives change. If it is too little - you can not buy your selected candy. Also, if you cancel your order it gives all the money inserted back."; }