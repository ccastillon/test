"use client";
// "use no memo";

import { dateFormatter } from "@/lib/formatter";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Event } from "event-module";
import { useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
// import { LoadScript } from "../ScriptLoader";

export default function TableInstance({ data }: { data: Event[] }) {
  const columns: ColumnDef<Event>[] = useMemo(
    () => [
      {
        accessorKey: "leagueName",
        header: "LEAGUE",
      },
      {
        accessorKey: "startDateTime",
        header: "DATE & TIME",
        cell: ({ row }) => {
          const formatted = dateFormatter(row.getValue("startDateTime"));
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
        id: "actions",
        cell: ({ row }) => {
          const event = row.original;

          return (
            <button
              type="button"
              // className="create-details-btn
              className="create-details-btn
                  inline-block px-6 py-3 mb-1 mr-1 font-bold text-center uppercase text-white align-middle transition-all border-0 cursor-pointer ease-soft-in-out text-xs leading-pro bg-green-CUSTOM-600 tracking-tight-soft shadow-soft-md bg-150 bg-x-25 rounded-7 hover:scale-102 active:opacity-85"
              data-target="#create-bet-details"
              data-item={JSON.stringify(event)}
            >
              <FaPlus /> &nbsp; CREATE BET
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
  const upcomingeventsdatatable = { upcomingeventsdatatable: "" };

  //{...datatable} {...upcomingeventsdatatable} id="datatable-search"
  return (
    <>
      <table className="table table-flush w-full" {...upcomingeventsdatatable}>
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
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="font-semibold leading-normal text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
