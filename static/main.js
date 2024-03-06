let screen = null;

function priority(operation) {
  if (operation == "+" || operation == "-") {
    return 1;
  } else {
    return 2;
  }
}

function isNumeric(str) {
  return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
  return /^\d{1}$/.test(str);
}

function isOperation(str) {
  return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
  let tokens = [];
  let lastNumber = "";
  for (char of str) {
    if (isDigit(char) || char == ".") {
      lastNumber += char;
    } else {
      if (lastNumber.length > 0) {
        tokens.push(lastNumber);
        lastNumber = "";
      }
    }
    if (isOperation(char) || char == "(" || char == ")") {
      tokens.push(char);
    }
  }
  if (lastNumber.length > 0) {
    tokens.push(lastNumber);
  }
  return tokens;
}

// преобразовать строеку в ОПЗ
function compile(str) {
  let out = [];
  let stack = [];
  for (token of tokenize(str)) {
    if (isNumeric(token)) {
      out.push(token);
    } else if (isOperation(token)) {
      while (
        stack.length > 0 &&
        isOperation(stack[stack.length - 1]) &&
        priority(stack[stack.length - 1]) >= priority(token)
      ) {
        out.push(stack.pop());
      }
      stack.push(token);
    } else if (token == "(") {
      stack.push(token);
    } else if (token == ")") {
      while (stack.length > 0 && stack[stack.length - 1] != "(") {
        out.push(stack.pop());
      }
      stack.pop();
    }
  }
  while (stack.length > 0) {
    out.push(stack.pop());
  }
  return out.join(" ");
}

// вычислить знач
function evaluate(str) {
  let compiled_string = compile(str);
  let tokens = compiled_string.split(" ");
  let result = 0;
  let stack = [];
  while (tokens.length > 0) {
    let item = tokens.shift();
    let a, b;
    switch (item) {
      case "+":
        b = parseFloat(stack.pop());
        a = parseFloat(stack.pop());
        stack.push((a + b).toFixed(2));
        break;

      case "-":
        b = parseFloat(stack.pop());
        a = parseFloat(stack.pop());
        stack.push((a - b).toFixed(2));
        break;
      case "*":
        b = parseFloat(stack.pop());
        a = parseFloat(stack.pop());
        stack.push((a * b).toFixed(2));
        break;
      case "/":
        b = parseFloat(stack.pop());
        a = parseFloat(stack.pop());
        stack.push((a / b).toFixed(2));
        break;
      default:
        stack.push(item);
        break;
    }
  }
  return stack.pop();
}

function clickHandler(char) {
  switch (char) {
    case "C":
      screen.innerHTML = "";
      break;
    case "=":
      screen.innerHTML = evaluate(screen.innerHTML);
      break;
    default:
      screen.innerHTML += char;
      break;
  }
}

window.onload = function () {
  screen = document.getElementById("screen");
  let key_buttons = document.getElementsByClassName("key");
  for (let i = 0; i < key_buttons.length; i++) {
    let key_button = key_buttons.item(i);
    key_button.onclick = function () {
      clickHandler(key_button.innerHTML);
    };
  }
};

