declare module "bet-module" {
  export declare class UserBet {
    public id: string;
    public leagueName: string;
    public eventStartDateTime: Date;
    public eventEndDateTime: Date;
    public team1Name: string;
    public team2Name: string;
    public stake: number;
    public odds: string;
    public status: string;
    public winnings: number;
    public rake: number;
    public amount: number;
    public eventResult: string;
    public acceptedByUser: string;
    public userBalance: number;
  }

  export declare class CreateBet {
    public id: string;
    public eventId: string;
    public stake: number;
    public odds: string;
    public status?: string;
    public proposedByUserId: string;
    public winSelection: string;
  }

  export declare class ProposedBet {
    public id: string;
    public leagueName: string;
    public eventStartDateTime: Date;
    public eventEndDateTime: Date;
    public team1Name: string;
    public team2Name: string;
    public stake: number;
    public odds: string;
    public status: string;
    public proposedby: string;
    public isBalSufficient: string;
    public BackerTeamPick: string;
  }

  export declare class AcceptBetResult {
    public succeeded: boolean;
    public errors: Error[];
    public status: string;
  }
}
