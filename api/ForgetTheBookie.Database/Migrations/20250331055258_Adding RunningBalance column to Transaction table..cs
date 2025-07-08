using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddingRunningBalancecolumntoTransactiontable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "RunningBalance",
                table: "Transaction",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RunningBalance",
                table: "Transaction");
        }
    }
}
