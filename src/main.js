let clickedBtns = [];
let history = '';
const OPERATORS = ['+', '-', '/', '*', '%', '='];
const OPERANDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
const FUNCTIONS = ['clearAll', 'clearLast', 'toggleNegative'];

function clearAll() {
  history = '';
  clickedBtns = [];
}

function clearLast() {
  if (clickedBtns.length > 0) {
    let lastKeys = clickedBtns[clickedBtns.length - 1];
    let updatedString = lastKeys.slice(0, -1);
    if (updatedString === '') {
      clickedBtns.pop();
    } else {
      clickedBtns[clickedBtns.length - 1] = updatedString;
    }
  }
  console.log(clickedBtns);
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('click', getBtnValue, true);

  function getBtnValue(event) {
    let target;
    // check if our button has inner element (imgs of operators)
    // if we click img, it will target its parent, which is a button
    if (event.target === button) {
      target = event.target;
    } else if (event.target !== button) {
      target = event.target.parentNode;
    }

    manageStack(clickedBtns);
    display();
    console.log(clickedBtns);
    console.table(history);

    function manageStack(arr) {
      // key is last pressed button
      let key = target.getAttribute('data-key');

      if (key === 'clearAll') {
        clearAll();
        return;
      } else if (key === 'clearLast') {
        clearLast();
      } else if (
        key === 'toggleNegative' &&
        !isNaN(clickedBtns[clickedBtns.length - 1])
      ) {
        let last = clickedBtns[clickedBtns.length - 1];
        clickedBtns.push((last * -1).toString());
        clickedBtns.splice(-2, 1);
      }

      if (!FUNCTIONS.includes(key)) {
        clickedBtns.push(key);
      }

      if (
        clickedBtns.length > 3 &&
        clickedBtns.filter((item) => !FUNCTIONS.includes(item)) &&
        !/[0-9.]/.test(key)
      ) {
        let result = operate(clickedBtns.slice(0, 3).join(' '));
        clickedBtns.push(result.toString());
        console.log('result: ' + result);
        clickedBtns.push(key);
        history += ` = ${clickedBtns.splice(0, 3).join(' ')}`;
      }

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
      }

      if (
        clickedBtns.length > 0 &&
        clickedBtns[clickedBtns.length - 1].includes('.')
      ) {
        document.getElementById('floatingPoint').disabled = true;
      } else {
        document.getElementById('floatingPoint').disabled = false;
      }
    }
    autoScrollToEnd();
  }
});

function display() {
  const displayElement = document.getElementById('displayResult');
  if (clickedBtns.length < 3) {
    displayElement.textContent = clickedBtns.at(0);
  } else {
    displayElement.textContent = clickedBtns.at(-1);
  }

  const currentOperator = document.getElementById('currentOperator');
  if (OPERATORS.includes(clickedBtns.at(-1))) {
    let operatorSrcName;
    switch (clickedBtns.at(-1)) {
      case '+':
        operatorSrcName = 'plus';
        break;
      case '-':
        operatorSrcName = 'minus';
        break;
      case '*':
        operatorSrcName = 'multiply';
        break;
      case '/':
        operatorSrcName = 'divide';
        break;
      case '%':
        operatorSrcName = 'modulo';
        break;
      case '=':
        operatorSrcName = 'equal';
        clickedBtns.splice(-1);
        break;
    }
    if (clickedBtns.length > 0) {
      currentOperator.setAttribute('src', `./img/${operatorSrcName}.svg`);
    } else {
      currentOperator.setAttribute('src', `./img/equal.svg`);
    }
  }

  const displayHistory = document.getElementById('displayHistory');
  displayHistory.textContent = history;
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
    case '=':
      return;
    default:
      return 'OOPS';
  }
}

function autoScrollToEnd() {
  const historyContainer = document.getElementById('displayHistory');
  historyContainer.scrollLeft = historyContainer.scrollWidth;
  const resultContainer = document.getElementById('displayResult');
  resultContainer.scrollLeft = resultContainer.scrollWidth;
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

function modulo(a, b) {
  return a % b;
}
