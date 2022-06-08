/*export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public role: string,
  ) {
  }



  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return -1;
    }
    return this._token;
  }
}*/

export class User1 {
  constructor(
   public userId: string,
   public role: string,
   public refreshToken: string,
   public token: string,
   public tokenExpirationDate: Date
  )
  {}

}
