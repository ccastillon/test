using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class DeletedEventSyncTrackTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventSyncTrack");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventSyncTrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventSyncTrack", x => x.Id);
                });
        }
    }
}
