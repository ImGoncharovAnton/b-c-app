export class RequestUpdateItem {
  constructor(public createdBy: string,
              public value: number,
              public description: string,
              public type: number,
              public monthId: number) {
  }
}
