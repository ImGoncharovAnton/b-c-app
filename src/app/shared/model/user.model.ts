
export class User {
  constructor(
   public userId: string,
   public role: string,
   public refreshToken: string,
   public token: string,
   public tokenExpirationDate: Date
  )
  {}

}
