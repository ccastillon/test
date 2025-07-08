using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ForgetTheBookie.Database.Migrations
{
    /// <inheritdoc />
    public partial class SeasonStartEndDatesNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            // DROP the old default constraint so new inserts will get no default
            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                  ALTER COLUMN ""StartDate"" DROP DEFAULT;"
                    );

            // DROP the old default constraint so new inserts will get no default
            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                  ALTER COLUMN ""EndDate"" DROP DEFAULT;"
                    );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "Season",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                ALTER COLUMN ""StartDate""
                SET DEFAULT '0001-01-01 00:00:00+00'::timestamptz;"
            );

            migrationBuilder.Sql(
              @"ALTER TABLE ""Season""
                ALTER COLUMN ""EndDate""
                SET DEFAULT '0001-01-01 00:00:00+00'::timestamptz;"
            );
        }
    }
}
