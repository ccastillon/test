using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddFixtureIdEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FixtureId",
                table: "Event",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FixtureId",
                table: "Event");
        }
    }
}
