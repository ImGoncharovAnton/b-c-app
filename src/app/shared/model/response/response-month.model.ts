export class ResponseMonth {
  constructor(
    public id: number,
    public createDate: Date,
    public updateDate: Date,
    public items: any[],
    public monthNum: number,
    public year: number,
    public userId: string,
    public createdBy: string,
    public income: number,
    public expense: number,
    public monthName: string) {
  }
}
