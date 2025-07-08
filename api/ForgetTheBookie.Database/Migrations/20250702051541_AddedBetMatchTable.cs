using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddedBetMatchTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BetMatch",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    BetOfferId = table.Column<Guid>(type: "uuid", nullable: false),
                    AcceptedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchedAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    BetMatchResult = table.Column<string>(type: "character varying(20)", nullable: false),
                    BackerPayout = table.Column<decimal>(type: "numeric", nullable: true),
                    LayerPayout = table.Column<decimal>(type: "numeric", nullable: true),
                    RakeCollected = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BetMatch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BetMatch_BetOffer_BetOfferId",
                        column: x => x.BetOfferId,
                        principalTable: "BetOffer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BetMatch_User_AcceptedByUserId",
                        column: x => x.AcceptedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BetMatch_AcceptedByUserId",
                table: "BetMatch",
                column: "AcceptedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_BetMatch_BetOfferId",
                table: "BetMatch",
                column: "BetOfferId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BetMatch");
        }
    }
}
