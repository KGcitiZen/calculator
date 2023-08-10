const clickedBtns = [];
const OPERATORS = ['+', '-', '/', '*', '%'];
const OPERANDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
const FUNCTIONS = ['clearAll', 'clearLast', '=', 'toggleNegative'];

const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('click', getBtnValue, true);

  function getBtnValue(event) {
    let target;
    if (event.target === button) {
      target = event.target;
    } else if (event.target !== button) {
      target = event.target.parentNode;
    }

    manageStack(clickedBtns);
    display();
    console.log(clickedBtns);

    function manageStack(arr) {
      // key is last pressed button
      let key = target.getAttribute('data-key');
      clickedBtns.push(key);

      if (OPERATORS.includes(arr[0])) {
        // if first pressed key is operator, remove it
        arr.shift();
      } else if (
        // replace with key if previous key was an operator
        OPERATORS.includes(clickedBtns.at(-2)) &&
        OPERATORS.includes(key)
      ) {
        clickedBtns.splice(-2, 1);
      } else if (/[0-9.]/.test(clickedBtns.at(-2)) && /[0-9.]/.test(key)) {
        // concat last entry with current, if they're both digits or a point
        clickedBtns[clickedBtns.length - 2] = clickedBtns.at(-2) + key;
        clickedBtns.splice(-1);
      } else if (FUNCTIONS.includes(key)) {
        switch (key) {
          case 'clearLast':
            clickedBtns.splice(-2);
            break;
        }
      }
    }
  }
});

function display() {
  const displayElement = document.getElementById('displayResult');
  displayElement.textContent = clickedBtns.at(-1);

  const displayHistory = document.getElementById('displayHistory');
  displayHistory.textContent = clickedBtns.slice(0, -1).join(' ');
}

function operate(str) {
  const items = str.split(' '); // [operand, operator, operand]
  [a, operator, b] = items;
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '/':
      return a / b;
    case '*':
      return a * b;
    case '%':
      return a % b;
    default:
      return 'OOPS';
  }
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}
