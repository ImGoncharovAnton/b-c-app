export class ResponseItem {
  constructor(
    public id: number,
    public createDate: Date,
    public updateDate: Date,
    public monthId: number,
    public createdBy: string,
    public type: number,
    public value: number,
    public description: string) {
  }
}
