let screen = null

let operators = {
    "+": function add(a, b) {
        return a + b;
    },
    "-": function sub(a, b) {
        return a - b;
    },
    "*": function mul(a, b) {
        return a * b;
    },
    "/": function div(a, b) {
        let result = a / b;
        if (result < 0) {
            return Math.ceil(result);
        } else return Math.floor(result);
    }
};
var evalRPN = function (tokens) {
    let result = 0;
    let stack1 = [];
    while (tokens.length > 0) {
        let item = tokens.shift();
        if (operators[item]) {
            let b = parseInt(stack1.pop());
            let a = parseInt(stack1.pop());
            result = operators[item](a, b);
            stack1.push(result);
        } else {
            stack1.push(item);
        }
    }
    return stack1.pop();
};

function priority(operation) {
    if (operation == '+' || operation == '-') {
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
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(str) {
    // your code here
}

function clickHandler(char) {
    switch (char) {
        case 'C':
            screen.value = '';
            break;
        case '=':
            screen.value = evalRPN(compile(screen.value).split(' '))
            break;
        default:
            screen.value += char;
            break;
    }
}

window.onload = function () {
    screen = document.getElementById("screen")
    let key_buttons = document.getElementsByClassName("key")
    for (let i = 0; i < key_buttons.length; i++) {
        let key_button = key_buttons.item(i)
        key_button.onclick = function () {
            clickHandler(key_button.innerHTML)
        }
    }
}
