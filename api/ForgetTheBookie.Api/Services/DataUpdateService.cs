using EFCore.BulkExtensions;
using ForgetTheBookie.Database;
using ForgetTheBookie.Database.Enum;
using ForgetTheBookie.Database.Model;
using Microsoft.EntityFrameworkCore;

namespace ForgetTheBookie.Api.Services
{
    public class DataUpdateService
    {
        public readonly ILogger<DataUpdateService> _logger;
        private readonly DatabaseContext _context;
        private const decimal RakePercentage = 0.05m; // Example rake percentage, adjust as needed

        public DataUpdateService(ILogger<DataUpdateService> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task UpdateUserBets()
        {
            _logger.LogInformation("Updating user bets status...");
            var betOffers = await _context.BetOffer
                                    .Where(x => x.Event.EndDateTime < DateTime.UtcNow &&
                                    (x.Status == BetStatus.PROPOSED || x.Status == BetStatus.ACCEPTED))
                                    .Include(x => x.BetMatch)
                                    .Include(x => x.Event).ThenInclude(x => x.Result)
                                    .Include(x => x.ProposedByUser).ThenInclude(x => x.UserBalance)
                                    .Include(x => x.AcceptedByUser).ThenInclude(x => x.UserBalance)
                                    .Include(x => x.Transactions)
                                    .ToListAsync();
            var userBalances = await _context.UserBalance.ToListAsync();
            var newTransactions = new List<Transaction>();
            var updatedUserBalances = new List<UserBalance>();
            var updatedBetOffers = new List<BetOffer>();

            // 1. Get all user bets that are either proposed or accepted and have an event that has ended
            // 2. Update bets where event was cancelled

            try
            {
                var userBetOffers = betOffers.GroupBy(
                    bet => bet.ProposedByUserId,
                    bet => bet);

                foreach(var userBetOffer in userBetOffers)
                {
                    var userId = userBetOffer.Key;
                    var proposedUserBalance = userBalances.FirstOrDefault(x => x.UserId == userId);
                    if (proposedUserBalance == null)
                    {
                        _logger.LogWarning($"User balance not found for userId: {userId}");
                        continue;
                    }
                    foreach (var betOffer in userBetOffer)
                    {
                        var backerPotentialProfit = ComputePotentialProfit(betOffer.Odds, betOffer.Stake);
                        // BetOffers that were not accepted
                        if (betOffer.Status == BetStatus.PROPOSED)
                        {
                            // return backer's stake
                            betOffer.Status = BetStatus.CANCELLED; // Update status to cancelled
                            proposedUserBalance.Balance += betOffer.Stake;
                            
                            newTransactions.Add(new Transaction
                            {
                                UserId = userId,
                                Type = TransactionType.DEPOSIT,
                                Amount = betOffer.Stake,
                                TransactionDateTime = DateTime.UtcNow,
                                BetOfferId = betOffer.Id,
                                RunningBalance = proposedUserBalance.Balance
                            });

                            updatedBetOffers.Add(betOffer);
                        }
                        // Events that were cancelled
                        else if (betOffer.Status == BetStatus.ACCEPTED && betOffer.Event.Result.EventResult == EventResult.CANCELLED)
                        {
                            // return backer's stake
                            betOffer.Status = BetStatus.CANCELLED; // Update status to cancelled
                            proposedUserBalance.Balance += betOffer.Stake;

                            newTransactions.Add(CreateNewTransaction(userId, TransactionType.DEPOSIT, betOffer.Stake, betOffer.Id, proposedUserBalance.Balance));

                            // return layer's liability
                            betOffer.BetMatch.BetMatchResult = BetMatchResult.CANCELLED;
                            betOffer.BetMatch.AcceptedByUser.UserBalance.Balance += backerPotentialProfit; // return layer's liability

                            newTransactions.Add(CreateNewTransaction(betOffer.BetMatch.AcceptedByUserId, TransactionType.DEPOSIT, backerPotentialProfit, betOffer.Id, betOffer.BetMatch.AcceptedByUser.UserBalance.Balance));

                            updatedBetOffers.Add(betOffer);

                        }
                        else
                        {
                            // If the bet is accepted and the event has ended, we need to settle the bet

                            var eventResult = betOffer.Event.Result.EventResult;
                            var predictionCorrect = eventResult.ToString() == betOffer.WinSelection.ToString();
                            var backerWins = betOffer.BetSide == BetSide.BACK && predictionCorrect;
                            var matchResult = backerWins ?
                                BetMatchResult.BACKERWIN :
                                BetMatchResult.LAYERWIN;

                            var potentialProfit = ComputePotentialProfit(betOffer.Odds, betOffer.Stake);

                            if (matchResult == BetMatchResult.BACKERWIN)
                            {
                                var rake = potentialProfit * RakePercentage;
                                var totalPayout = betOffer.Stake + potentialProfit /* - rake*/;

                                // BetOffer.ProposedByUser - create new transaction and update user balance
                                proposedUserBalance.Balance += totalPayout; // Update backer's balance
                                
                                newTransactions.Add(CreateNewTransaction(userId, TransactionType.WINNINGS, totalPayout, betOffer.Id, proposedUserBalance.Balance));
                                newTransactions.Add(CreateNewTransaction(userId, TransactionType.RAKE, rake, betOffer.Id, proposedUserBalance.Balance - rake));

                                betOffer.BetMatch.BackerPayout = totalPayout - rake; // Update backer's payout in BetMatch
                                betOffer.BetMatch.RakeCollected = rake; // Update rake collected in BetMatch
                            }
                            else if (matchResult == BetMatchResult.LAYERWIN)
                            {
                                var liability = potentialProfit;
                                var rake = betOffer.Stake * RakePercentage;
                                var totalPayout = liability + betOffer.Stake /*- rake*/;

                                // BetMatch.AcceptedByUser - create new transaction and update user balance
                                betOffer.BetMatch.AcceptedByUser.UserBalance.Balance += totalPayout; // Update layer's balance
                                newTransactions.Add(CreateNewTransaction(betOffer.BetMatch.AcceptedByUserId, TransactionType.WINNINGS, totalPayout, betOffer.Id, betOffer.BetMatch.AcceptedByUser.UserBalance.Balance));
                                newTransactions.Add(CreateNewTransaction(betOffer.BetMatch.AcceptedByUserId, TransactionType.RAKE, rake, betOffer.Id, betOffer.BetMatch.AcceptedByUser.UserBalance.Balance - rake));

                                betOffer.BetMatch.LayerPayout = totalPayout - rake; // Update layer's payout in BetMatch
                                betOffer.BetMatch.RakeCollected = rake; // Update rake collected in BetMatch
                            }
                            else
                            {
                                _logger.LogWarning($"Unexpected match result for betOfferId: {betOffer.Id}");
                                continue; // Skip to next betOffer if result is unexpected
                            }


                            betOffer.Status = BetStatus.SETTLED; // Update status to settled
                            betOffer.BetMatch.BetMatchResult = matchResult;

                            updatedBetOffers.Add(betOffer);
                        }

                        updatedUserBalances.Add(proposedUserBalance);
                    }
                }


                #region update proposed bets (bets that were not accepted)
                //var proposedUserBets = betOffers.Where(x => x.Status == BetStatus.PROPOSED).GroupBy(
                //    bet => bet.ProposedByUserId,
                //    bet => bet);

                //foreach(var proposedBets in proposedUserBets)
                //{
                //    var userId = proposedBets.Key;
                //    var totalStake = proposedBets.Sum(b => b.Stake);
                //    var userBalance = userBalances.FirstOrDefault(x => x.UserId == userId);
                //    if (userBalance != null)
                //    {
                //        userBalance.Balance += totalStake;
                //        updatedUserBalances.Add(userBalance);
                //    }
                //    else
                //    {
                //        _logger.LogWarning($"User balance not found for userId: {userId}");
                //    }

                //    foreach (var betOffer in proposedBets)
                //    {
                //        betOffer.Status = BetStatus.WITHDRAWN; // Update status to withdrawn
                //        newTransactions.Add(new Transaction
                //        {
                //            UserId = userId,
                //            Type = TransactionType.DEPOSIT,
                //            Amount = betOffer.Stake,
                //            TransactionDateTime = DateTime.UtcNow,
                //            BetOfferId = betOffer.Id,
                //            RunningBalance = userBalance?.Balance
                //        });

                //        updatedBetOffers.Add(betOffer);
                //    }
                //}
                #endregion

                #region update accepted bets (bets that were accepted and the event has ended)
                // 1. Group accepted bets by ProposedByUser
                // 2. Get event result for each betOffer
                // 3. Compare betOffer result and betOffer.WinSelection

                //var acceptedUserBets = betOffers.Where(x => x.Status == BetStatus.ACCEPTED).GroupBy(
                //    bet => bet.ProposedByUserId,
                //    bet => bet);

                //foreach (var acceptedBets in acceptedUserBets)
                //{
                //    var userId = acceptedBets.Key;
                //    var userBalance = userBalances.FirstOrDefault(x => x.UserId == userId);
                //    if (userBalance == null)
                //    {
                //        _logger.LogWarning($"User balance not found for userId: {userId}");
                //        continue;
                //    }

                //    foreach (var betOffer in acceptedBets)
                //    {
                //        var eventResult = betOffer.Event.Result.EventResult;
                //        var predictionCorrect = eventResult.ToString() == betOffer.WinSelection.ToString();
                //        var backerWins = betOffer.BetSide == BetSide.BACK && predictionCorrect;
                //        var matchResult = backerWins ?
                //            BetMatchResult.BACKERWIN :
                //            BetMatchResult.LAYERWIN;

                //        var potentialProfit = ComputePotentialProfit(betOffer.Odds, betOffer.Stake);

                //        if (matchResult == BetMatchResult.BACKERWIN)
                //        {
                //            var rake = potentialProfit * RakePercentage;
                //            var totalPayout = betOffer.Stake + potentialProfit - rake;

                //            // BetOffer.ProposedByUser - create new transaction and update user balance
                //        }
                //        else if (matchResult == BetMatchResult.LAYERWIN)
                //        {
                //            var liability = potentialProfit;
                //            var rake = betOffer.Stake * RakePercentage;
                //            var totalPayout = liability + betOffer.Stake - rake;

                //            // BetMatch.AcceptedByUser - create new transaction and update user balance
                //        }
                //        else
                //        {
                //            _logger.LogWarning($"Unexpected match result for betOfferId: {betOffer.Id}");
                //            continue; // Skip to next betOffer if result is unexpected
                //        }


                //        betOffer.Status = BetStatus.SETTLED; // Update status to settled
                //        betOffer.BetMatch.BetMatchResult = matchResult;
                //    }

                //    //// Update user balance after processing all bets
                //    //proposedUserBalance.Balance += totalProfit;
                //    //updatedUserBalances.Add(proposedUserBalance);
                //}

                #endregion


                #region Bulk updates/inserts
                if (updatedBetOffers.Any())
                {
                    await _context.BulkUpdateAsync(updatedBetOffers);
                }

                if (newTransactions.Any())
                {
                    await _context.BulkInsertAsync(newTransactions);
                }

                if (updatedUserBalances.Any())
                {
                    await _context.BulkUpdateAsync(updatedUserBalances);
                }

                if (updatedBetOffers.Any() || newTransactions.Any() || updatedUserBalances.Any())
                {
                    await _context.SaveChangesAsync();
                }
                #endregion

                //await transaction.CommitAsync();
                _logger.LogInformation("User bets status updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to update user bets status: {ex.Message}");
                throw;
            }
        }

        private Transaction CreateNewTransaction(Guid userId, TransactionType transactionType, decimal amount, Guid betOfferId, decimal runningBalance)
        {
            var transaction = new Transaction
            {
                //Id = Guid.NewGuid(),
                UserId = userId,
                TransactionDateTime = DateTime.UtcNow,
                Type = transactionType,
                Amount = amount,
                BetOfferId = betOfferId,
                RunningBalance = runningBalance
            };

            return transaction;
        }

        private decimal ComputePotentialProfit(string odds, decimal stake)
        {
            var isnumerator = decimal.TryParse(odds.Split(':')[0], out decimal numerator);
            var isdenominator = decimal.TryParse(odds.Split(':')[1], out decimal denominator);
            var decimalOdds = isnumerator && isdenominator ? numerator / denominator : 0;

            var potentialProfit = stake * decimalOdds;

            return potentialProfit;
        }
    }
}