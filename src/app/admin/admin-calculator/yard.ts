import {isOperator} from './model';

export function yard(infix: string[]): string[] {
  const ops: any = {'+': 1, '-': 1, '*': 2, '/': 2};
  const peek = (arr: any) => arr[arr.length - 1];
  const stack: any = [];

  return infix.reduce((output: any, token) => {
    if (!isOperator(token)) {
      output.push(token);
    } else {
      if (token in ops) {

        while (peek(stack) && ops[token] <= ops[peek(stack)]) {
          output.push(stack.pop());
        }

        stack.push(token);
      }
    }

    return output;
  }, []).concat(stack.reverse());
}
