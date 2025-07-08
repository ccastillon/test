"use client";

import { dateFormatter } from "@/lib/formatter";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ProposedBet } from "bet-module";
import { useMemo } from "react";
import { FaThumbsUp } from "react-icons/fa";

export default function TableInstance({ data }: { data: ProposedBet[] }) {
  const columns: ColumnDef<ProposedBet>[] = useMemo(
    () => [
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
        accessorKey: "proposedByUser",
        header: "PROPOSED BY",
        cell: ({ row }) => {
          const proposedBy = `${row.getValue("proposedByUser")}`;
          return "*".repeat(4) + proposedBy.slice(-3);
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const proposedbet = row.original;

          return (
            <button
              type="button"
              className="accept-btn my-auto font-bold mr-2 leading-normal text-xs uppercase sm:pl-2 text-green-600"
              data-target="#proposed-bet-details"
              data-item={JSON.stringify(proposedbet)}
            >
              <FaThumbsUp />
              &nbsp; Accept
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const datatable = { datatable: "" };
  const proposedbetsdatatable = { proposedbetsdatatable: "" };

  // {...datatable} {...proposedbetsdatatable} id="datatable-basic"
  return (
    <>
      <table className="table table-flush w-full" {...proposedbetsdatatable}>
        <thead className="thead-light">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="text-xs" key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="font-semibold leading-normal text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
