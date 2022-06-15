export class ResponseMonthsForUser {
  constructor(
    public id: number,
    public monthNum: number,
    public year: number,
    public userId: string,
    public income: number,
    public expense: number,
    public monthName: string,
    public adminChanged: boolean) {
  }
}
