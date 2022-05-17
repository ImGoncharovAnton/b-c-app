import {Component, OnInit} from '@angular/core';
import {DataService} from 'src/app/shared/service/data.service';

import {rpn} from './rpn';
import {yard} from './yard';
import {format} from './format';
import {isOperator} from './model';

@Component({
  selector: 'app-admin-calculator',
  templateUrl: './admin-calculator.component.html',
  styleUrls: ['./admin-calculator.component.scss']
})
export class AdminCalculatorComponent implements OnInit {
  showSteps: boolean = false;
  finallyResult: number
  tokens: string[] = [];
  showResult = false;
  numberContent = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  operatorContent: string[] = ['-', '+', '*', '/'];


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  onExportValue(value: string) {
    this.finallyResult = Number(value)
    this.dataService.calcResult$.next(this.finallyResult)
    console.log('finallyResult', this.finallyResult)
    this.showSteps = true
  }

  // --------------------------------------------------

  insertChar(character: string): void {
    const lastToken = this.lastToken;
    const doubleMin = lastToken === '-' && isOperator(this.beforeLastToken);

    if (lastToken === undefined || (isOperator(lastToken) && !doubleMin)) {
      if (character === '.') {
        character = '0' + character;
      }

      this.tokens.push(character);
    } else if (this.showResult) {
      this.tokens = [character];
    } else {
      this.tokens[this.tokens.length - 1] = lastToken + character;
    }

    this.showResult = false;
  }

  get lastToken(): string {
    return this.tokens[this.tokens.length - 1];
  }

  get beforeLastToken(): string {
    return this.tokens[this.tokens.length - 2];
  }

  get input(): string {
    if (this.showResult) {
      try {
        //return format(math.eval(this.tokens.join(' ')).toString());
        return format(rpn(yard(this.tokens)).toString());
      } catch (e) {
        return 'You did something wrong!'
      }
    }

    return format(this.tokens
      .slice()
      .reverse()
      .find(t => !isOperator(t)) || '0');
  }

  get formattedTokens(): string {
    return this.tokens.map(format).join(' ').replace(/\*/g, 'x') || '0';
  }

  reset(): void {
    this.tokens = [];
    this.showResult = false;
  }

  evaluate(): void {
    // repeat last action
    if (this.showResult && this.tokens.length >= 2) {
      this.tokens = this.tokens.concat(this.tokens.slice(-2));
    }

    this.showResult = true;
  }

  execOperator(operator: string): void {
    // ANS support
    if (this.showResult) {
      this.tokens = [rpn(yard(this.tokens)).toString()];
    }

    if (!this.lastToken) {
      this.tokens.push('0');
    }

    this.tokens.push(operator);
    this.showResult = false;
  }

  // KEYBOARD SUPPORT
  // @HostListener('keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   const key = event.key.toLowerCase();
  //   event.preventDefault();
  //
  //   if (key === 'c' || key === 'backspace') {
  //     this.reset();
  //   } else if (key === ',' || key === '.') {
  //     this.insertChar('.');
  //   } else if (!isNaN(parseInt(key))) {
  //     this.insertChar(key);
  //   } else if (key === 'enter') {
  //     this.evaluate();
  //   } else if (isOperator(key)) {
  //     this.execOperator(key);
  //   }
  // }

}
