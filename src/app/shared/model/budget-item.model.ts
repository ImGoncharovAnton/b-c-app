export class BudgetItem {
  constructor(public amount: number,
              public description: string,
              public key?: string,
              public adminChanged?: boolean) {
  }
}
