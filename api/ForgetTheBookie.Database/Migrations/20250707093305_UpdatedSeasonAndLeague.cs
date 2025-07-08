using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedSeasonAndLeague : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_League_Season_SeasonId",
                table: "League");

            migrationBuilder.DropTable(
                name: "SeasonLeague");

            migrationBuilder.DropIndex(
                name: "IX_League_SeasonId",
                table: "League");

            migrationBuilder.DropColumn(
                name: "SeasonId",
                table: "League");


            // 1) Drop the identity marker while the column is still int
            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                 ALTER COLUMN ""Id"" DROP IDENTITY IF EXISTS;"
                    );

            // 2) Recast the column to uuid, generating a new UUID for each existing row
            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                 ALTER COLUMN ""Id"" TYPE uuid
                 USING gen_random_uuid();"
                    );

            // 3) Attach the DEFAULT so that future inserts get a UUID too
            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                 ALTER COLUMN ""Id"" SET DEFAULT gen_random_uuid();"
                    );


            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsCurrent",
                table: "Season",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "LeagueId",
                table: "Season",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "SeasonYear",
                table: "Season",
                type: "integer",
                maxLength: 10,
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Season_LeagueId",
                table: "Season",
                column: "LeagueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Season_League_LeagueId",
                table: "Season",
                column: "LeagueId",
                principalTable: "League",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Season_League_LeagueId",
                table: "Season");

            migrationBuilder.DropIndex(
                name: "IX_Season_LeagueId",
                table: "Season");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Season");

            migrationBuilder.DropColumn(
                name: "IsCurrent",
                table: "Season");

            migrationBuilder.DropColumn(
                name: "LeagueId",
                table: "Season");

            migrationBuilder.DropColumn(
                name: "SeasonYear",
                table: "Season");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Season");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Season",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "SeasonId",
                table: "League",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SeasonLeague",
                columns: table => new
                {
                    SeasonId = table.Column<int>(type: "integer", nullable: false),
                    LeagueId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeasonLeague", x => new { x.SeasonId, x.LeagueId });
                    table.ForeignKey(
                        name: "FK_SeasonLeague_League_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "League",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SeasonLeague_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_League_SeasonId",
                table: "League",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_SeasonLeague_LeagueId",
                table: "SeasonLeague",
                column: "LeagueId");

            migrationBuilder.AddForeignKey(
                name: "FK_League_Season_SeasonId",
                table: "League",
                column: "SeasonId",
                principalTable: "Season",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
