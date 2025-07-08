// interface IUser {
//   id: string;
//   name: string;
//   username: string;
//   email: string;
//   password: string;
//   dateOfBirth: Date;
//   token: string;
// }

declare module "user-module" {
  export declare class User {
    public id: string;
    public name: string;
    public username: string;
    public email: string;
    public password: string;
    public dateOfBirth: Date;
    public token: string;
    public expiration: Date;
  }
  export declare class UserBalance {
    public id: string;
    public userId: string;
    public balance: string;
    public allocatedToBets: string;
  }
  export declare class UserTransaction {
    public id: string;
    public userId: string;
    public transactionDateTime: Date;
    public type: string;
    public amount: string;
    public betId: string;
    public runningBalance: string;
  }

  export declare class UserSession {
    public id: string;
    public username: string;
    public accessToken: string;
    public accessTokenExpiry: Date;
    public refreshToken: string;
    public error: string?;
  }

  export declare class Error {
    public code: string;
    public description: string;
  }
  export declare class IdentityResult {
    public succeeded: boolean;
    public errors: Error[];
  }
}
