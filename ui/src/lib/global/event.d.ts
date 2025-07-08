declare module "event-module" {
  export declare class Event {
    public id: string;
    public startDateTime: Date;
    public endDateTime: Date;
    public leagueName: string;
    public team1Name: string;
    public team2Name: string;
  }

  export declare class Event2 {
    public Id: string;
    public StartDateTime: Date;
    public EndDateTime: Date;
    public Team1Id: string;
    public Team2Id: string;
    public Team1: Team;
    public Team2: Team;
  }

  export declare class Team {
    public Name: string;
    public League: League;
  }

  export declare class League {
    public Id: string;
    public Name: string;
  }
}
