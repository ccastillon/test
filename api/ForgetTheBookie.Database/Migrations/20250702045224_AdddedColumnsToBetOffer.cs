using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class AdddedColumnsToBetOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BetSide",
                table: "BetOffer",
                type: "character varying(20)",
                nullable: false,
                defaultValue: "BACK");

            migrationBuilder.AddColumn<string>(
                name: "WinSelection",
                table: "BetOffer",
                type: "character varying(20)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BetSide",
                table: "BetOffer");

            migrationBuilder.DropColumn(
                name: "WinSelection",
                table: "BetOffer");
        }
    }
}
