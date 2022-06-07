export class User {
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
}

// Нужен для интерсептора, его я переписывать буду,
// ибо нужно добавить функцию refresh token проверки, и bearer аутентификации



export class User1 {
  constructor(
   public userId: string,
   public role: string,
   public refreshToken: string,
   private token: string,
   private tokenExpirationDate: Date
  )
  {}

}
