using ForgetTheBookie.Database.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ForgetTheBookie.Database
{
    public class DatabaseContext : IdentityUserContext<User, Guid>
    {
        public DatabaseContext()
        {
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<League> League { get; set; }
        public virtual DbSet<Team> Team { get; set; }
        public virtual DbSet<Event> Event { get; set; }
        public virtual DbSet<Result> Result { get; set; }
        public virtual DbSet<BetOffer> BetOffer { get; set; }
        public virtual DbSet<UserBalance> UserBalance { get; set; }
        public virtual DbSet<Transaction> Transaction { get; set; }
        public virtual DbSet<Season> Season { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            #region ModelBuilder Property Configurations

            modelBuilder.Entity<User>().ToTable("User");

            #region User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(x => x.Id);
                //entity.Property(x => x.Username).HasMaxLength(50);
                entity.Property(x => x.Name).HasMaxLength(255);
                entity.Property(x => x.Email).HasMaxLength(255);
                entity.Property(x => x.DateOfBirth).HasColumnType("date");
                entity.Property(x => x.PasswordHash);
                entity.Property(x => x.CreatedDate);
            });

            modelBuilder.Entity<UserBalance>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Balance);

                //O-t-o with User, set UserId as the FK
                entity.HasOne(d => d.User)
                    .WithOne(p => p.UserBalance)
                    .HasForeignKey<UserBalance>(d => d.UserId);
            });
            #endregion

            #region Season / League / Team
            modelBuilder.Entity<Season>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.SeasonYear).HasMaxLength(10);
                entity.Property(x => x.StartDate);
                entity.Property(x => x.EndDate);
                entity.Property(x => x.IsCurrent).HasDefaultValue(false);

                //O-t-m with League, set LeagueId as the FK
                entity.HasOne(d => d.League)
                    .WithMany(p => p.Seasons)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.Cascade); // Cascade delete to remove seasons when league is deleted
            });

            modelBuilder.Entity<League>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.Name).HasMaxLength(255);
                entity.Property(x => x.CountryName).HasMaxLength(255);
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.Name).HasMaxLength(255);

                //O-t-m with League, set LeagueId as the FK.
                //Leagues can have multiple teams, teams only belong to one league.
                entity.HasOne(d => d.League)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.LeagueId);
            });
            #endregion

            #region Event
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.StartDateTime);
                entity.Property(x => x.EndDateTime);

                //O-t-m with Team1, set Team1Id as the FK
                //Teams can have multiple events
                entity.HasOne(d => d.Team1)
                    .WithMany(p => p.EventsAsTeam1)
                    .HasForeignKey(d => d.Team1Id);

                //O-t-m with Team2, set Team2Id as the FK
                //Teams can have multiple events
                entity.HasOne(d => d.Team2)
                    .WithMany(p => p.EventsAsTeam2)
                    .HasForeignKey(d => d.Team2Id);
            });
            #endregion

            #region Result
            modelBuilder.Entity<Result>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.Team1Goals);
                entity.Property(x => x.Team2Goals);
                entity.Property(x => x.EventResult).HasColumnType("character varying(20)");

                //O-t-o with Event, set EventId as the FK
                //Event can only have one Result, a result can only belong to an event
                entity.HasOne(d => d.Event)
                    .WithOne(p => p.Result)
                    .HasForeignKey<Result>(d => d.EventId);

                //O-t-m with Team, set WinningTeamId as the FK
                //Result can only have a winning Team, teams can have multiple results
                entity.HasOne(d => d.Team)
                    .WithMany(p => p.Results)
                    .HasForeignKey(d => d.WinningTeamId);
            });
            #endregion

            #region Bet
            modelBuilder.Entity<BetOffer>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.Stake);
                entity.Property(x => x.Odds);
                entity.Property(x => x.BetSide).HasColumnType("character varying(20)");
                entity.Property(x => x.WinSelection).HasColumnType("character varying(20)");
                entity.Property(x => x.Status).HasColumnType("character varying(20)");

                //O-t-m with Event, set EventId as the FK
                //Event can have multiple bets, a bet can only belong to one event
                entity.HasOne(d => d.Event)
                    .WithMany(p => p.BetOffers)
                    .HasForeignKey(d => d.EventId);

                //O-t-m with ProposedBy User, set ProposedByUserId as the FK
                //Users can propose multiple bets, a bet can only be proposed/created by one user
                entity.HasOne(d => d.ProposedByUser)
                    .WithMany(p => p.BetOffers)
                    .HasForeignKey(d => d.ProposedByUserId);

                //O-t-m with Accepted User, set AcceptedByUserId as the FK
                entity.HasOne(d => d.AcceptedByUser)
                    .WithMany(p => p.AcceptedBets)
                    .HasForeignKey(d => d.AcceptedByUserId);
            });

            modelBuilder.Entity<BetMatch>(entity => {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.MatchedAmount);
                entity.Property(x => x.BetMatchResult).HasColumnType("character varying(20)");
                entity.Property(x => x.BackerPayout);
                entity.Property(x => x.LayerPayout);
                entity.Property(x => x.RakeCollected);

                entity.HasOne(d => d.BetOffer)
                    .WithOne(p => p.BetMatch)
                    .HasForeignKey<BetMatch>(d => d.BetOfferId);

                entity.HasOne(d => d.AcceptedByUser)
                    .WithMany(p => p.BetMatches)
                    .HasForeignKey(d => d.AcceptedByUserId);
            });
            #endregion

            #region Transaction
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid()");
                entity.Property(x => x.TransactionDateTime);
                entity.Property(x => x.Type).HasColumnType("character varying(20)");
                entity.Property(x => x.Amount);

                //O-t-m with BetOffer, set BetOfferId as the FK
                //A bet can have multiple transactions - 2 stakes, 1 winning, 1 rake
                entity.HasOne(d => d.BetOffer)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.BetOfferId);
            });
            #endregion

            #endregion

            
        }
    }
}
