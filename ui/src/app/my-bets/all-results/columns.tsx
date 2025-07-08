"use client";

import { dateFormatter } from "@/lib/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { UserBet } from "bet-module";
import { FaEye } from "react-icons/fa";

export const columns: ColumnDef<UserBet>[] = [
  {
    accessorKey: "leagueName",
    header: "LEAGUE",
  },
  {
    accessorKey: "eventStartDateTime",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const formatted = dateFormatter(row.getValue("eventStartDateTime"));
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "game",
    header: "GAME",
    // accessorFn: (row) => `${row.team1Name} vs ${row.team2Name}`,
    cell: ({ row }) => {
      const game = `${row.original.team1Name} vs ${row.original.team2Name}`;
      return game;
    },
  },
  {
    accessorKey: "stake",
    header: "STAKE",
    cell: ({ row }) => {
      return `£ ${row.getValue("stake")}`;
    },
  },
  {
    accessorKey: "odds",
    header: "ODDS",
  },
  {
    accessorKey: "status",
    header: "BET STATUS",
    cell: ({ row }) => {
      if (row.original.status.toLowerCase() === "withdrawn") return "Withdrawn, no takers";
      return `${row.getValue("status")}`;
    },
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => {
      const userBet = row.original;
      return AmountComponent(userBet);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userBet = row.original;

      return (
        <button
          type="button"
          className="view-details-btn"
          // data-toggle="modal"
          data-target="#user-bet-details"
          data-item={JSON.stringify(userBet)}
          // onClick={() => console.log("View Details log: ", userBet.team1Name)}
        >
          <FaEye /> VIEW DETAILS
        </button>
        // <ViewDetailsBtn userBet={userBet} />
      );
    },
  },
];

function AmountComponent(bet: UserBet) {
  if (bet.status == "WITHDRAWN") {
    return <span>N / A</span>;
  } else if (bet.amount >= 0) {
    return <span className="text-green-600">+£ {bet.amount}</span>;
  } else {
    return <span className="text-red-600">-£ {bet.amount * -1}</span>;
  }
}
