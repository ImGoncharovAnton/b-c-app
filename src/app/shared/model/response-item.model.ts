export class ResponseItem {
  constructor(
    public id: number,
    public createdBy: string,
    public value: number,
    public description: string,
    public monthId: number,
    public type: number) {
  }
}
