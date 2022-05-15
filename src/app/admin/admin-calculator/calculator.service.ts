import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  multiplication = '×';
  division = '÷'
  addition = '+'
  subtraction = '-'

  private operators: any = []
  private numbers: any = []

  constructor() {
  }

  evaluateResult(operand: any, equation: any, previousResult: number) {
    let result: number

    if (operand) {
      this.numbers = [...this.numbers, operand];

      equation = [...equation, operand, '='];
    }

    console.log('Evaluate', this.numbers, this.operators);

    // If user entered operator then clicked equals,the operator is not needed in the equation, so ignore it.
    if (this.numbers.length === this.operators.length) {
      this.operators.pop();
      equation.pop();
    }

    let newNumbers: any = [];
    let newOperators: any = [];
    let operand1;

    // Pass 1: Multiplication and division
    for (let i = 0; i < this.operators.length; i++) {
      operand1 = operand1 ? operand1 : this.numbers[i];

      if (this.operators[i] === this.division) {
        operand1 = +operand1 / +this.numbers[i + 1];
      }

      if (this.operators[i] === this.multiplication) {
        operand1 = +operand1 * +this.numbers[i + 1];
      }

      if (this.operators[i] === '+' || this.operators[i] === '-') {
        newNumbers = [...newNumbers, operand1];
        operand1 = null;
        newOperators = [...newOperators, this.operators[i]];
      }

      if (i === this.operators.length - 1) {
        let value = operand1 ? operand1 : this.numbers[i + 1];
        newNumbers = [...newNumbers, value];
      }
    }

    // If there are only multiplications and/or divisions then  operand1 has the result:
    result = operand1 ? operand1 : operand;

    console.log('newNumbers/newOperators', newNumbers, newOperators);

    // Pass 2: Add and subtract
    if (newNumbers.length) {
      result = +newNumbers[0];
      for (let i = 0; i < newOperators.length; i++) {
        switch (newOperators[i]) {
          case this.addition:
            result += +newNumbers[i + 1];
            break;
          case this.subtraction:
            result -= +newNumbers[i + 1];
            break;
        }
      }
    }

    // // Use the result in the next operation
    // operand = result.toString();
    // this.currentOperand = this.result.toString();
    this.numbers = [];
    this.operators = [];

    return {
      result,
      operand: result.toString(),
      equation
    };

  }

  collateEquation(operand: any, operator: any, equation: any) {
    console.log('collateEquation called with:', operand, operator, equation);
    let userInfo = {
      equation,
      operand,
      result: operand
    };

    if (operand) {
      this.addOperandToArray(operand, equation);

      equation = equation[equation.length - 1] === '=' ? [operand] : [...equation, operand];

      // reset operand
      userInfo = {
        ...userInfo,
        equation,
        operand: ''
      }
    }

    // if multiple operators are pressed
    if (this.numbers.length === this.operators.length) {
      this.operators[this.operators.length - 1] = operator;

      equation[equation.length - 1] = operator;

    } else {
      this.operators = [...this.operators, operator];

      equation = [...equation, operator];
    }

    return {
      ...userInfo,
      equation
    };
  }

  addOperandToArray(operand: any, equation: any) {
    this.numbers = [...this.numbers, operand];
  }

  stripLeadingZero(operand: any) {
    return operand.replace(/^0+/, '');
  }

  hasDecimal(operand: any, curr: any) {
    return (curr === '.' && operand.includes('.'));
  }

  collateOperandString(operand: string, curr: string) {
    operand = this.stripLeadingZero(operand);

    return this.hasDecimal(operand, curr) ? operand : operand + curr;
  }

  togglePositiveNegative(operand: any) {
    return (+operand * -1).toString();
  }

  getPercentage(operand: any) {
    return (+operand / 100).toString();
  }

  reset() {
    // this.currentNumber = '0';
    this.numbers = [];
    this.operators = [];
  }

}

/*
Services are just classes.
Instances are provided to injectors
Injectors deliver them when needed.


We can share data between components using service,
e.g mostPopularBook.
*/
