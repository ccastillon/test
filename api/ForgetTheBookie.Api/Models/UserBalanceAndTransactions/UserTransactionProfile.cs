using AutoMapper;
using ForgetTheBookie.Api.ExtensionMethods;
using ForgetTheBookie.Database.Enum;
using ForgetTheBookie.Database.Model;

namespace ForgetTheBookie.Api.Models.UserBalanceAndTransactions
{
    public class UserTransactionProfile : Profile
    {

        public UserTransactionProfile() 
        {
            CreateMap<Transaction, UserTransactionModel>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s .Id))
                .ForMember(d => d.UserId, o => o.MapFrom(s => s .UserId))
                .ForMember(d => d.TransactionDateTime, o => o.MapFrom(s => s .TransactionDateTime))
                .ForMember(d => d.Type, o => o.MapFrom(s => s .Type.GetDescription()))
                .ForMember(d => d.Amount, o => o.MapFrom(s => s .Amount))
                .ForMember(d => d.BetId, o => o.MapFrom(s => s .BetOfferId))
                .ForMember(d => d.RunningBalance, o => o.MapFrom(s => s.RunningBalance));

            CreateMap<CreateTransactionModel, Transaction>()
                .IgnoreAllMembers()
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
                .ForMember(d => d.Type, o => o.MapFrom(s => s.Type))
                .ForMember(d => d.Amount, o => o.MapFrom(s => s.Amount))
                .ForMember(d => d.BetOfferId, o => o.MapFrom(s => s.BetId));
        }
    }
}
