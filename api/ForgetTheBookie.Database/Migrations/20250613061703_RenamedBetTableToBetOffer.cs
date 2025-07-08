using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class RenamedBetTableToBetOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Bet_BetId",
                table: "Transaction");

            migrationBuilder.RenameTable(
                name: "Bet",
                newName: "BetOffer");

            migrationBuilder.RenameColumn(
                name: "BetId",
                table: "Transaction",
                newName: "BetOfferId");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_BetId",
                table: "Transaction",
                newName: "IX_Transaction_BetOfferId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_BetOffer_BetOfferId",
                table: "Transaction",
                column: "BetOfferId",
                principalTable: "BetOffer",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_BetOffer_BetOfferId",
                table: "Transaction");

            migrationBuilder.RenameTable(
                name: "BetOffer",
                newName: "Bet");

            migrationBuilder.RenameColumn(
                name: "BetOfferId",
                table: "Transaction",
                newName: "BetId");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_BetOfferId",
                table: "Transaction",
                newName: "IX_Transaction_BetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Bet_BetId",
                table: "Transaction",
                column: "BetId",
                principalTable: "Bet",
                principalColumn: "Id");
        }
    }
}
