using AutoMapper;
using ForgetTheBookie.Api.ExtensionMethods;

namespace ForgetTheBookie.Api.Models.Bet
{
    public class BetProfile : Profile
    {
        public BetProfile() 
        {
            CreateMap<Database.Model.BetOffer, BetModel>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.LeagueName, o => o.MapFrom(s => s.Event.Team1.League.Name))
                .ForMember(d => d.EventStartDateTime, o => o.MapFrom(s => s.Event.StartDateTime))
                .ForMember(d => d.Team1Name, o => o.MapFrom(s => s.Event.Team1.Name))
                .ForMember(d => d.Team2Name, o => o.MapFrom(s => s.Event.Team2.Name))
                .ForMember(d => d.Stake, o => o.MapFrom(s => s.Stake))
                .ForMember(d => d.Odds, o => o.MapFrom(s => s.Odds))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.GetDescription()))
                .ForMember(d => d.Team1Id, o => o.MapFrom(s => s.Event.Team1Id))
                .ForMember(d => d.Team2Id, o => o.MapFrom(s => s.Event.Team2Id))
                .ForMember(d => d.EventId, o => o.MapFrom(s => s.EventId))
                .ForMember(d => d.ProposedByUser, o => o.MapFrom(s => s.ProposedByUser.Name))
                .ForMember(d => d.AcceptedByUser, o => o.MapFrom(s => s.AcceptedByUser.Name));

            CreateMap<CreateEditBetModel, Database.Model.BetOffer>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.ProposedByUserId, o => o.MapFrom(s => s.ProposedByUserId))
                .ForMember(d => d.EventId, o => o.MapFrom(s => s.EventId))
                .ForMember(d => d.Stake, o => o.MapFrom(s => s.Stake))
                .ForMember(d => d.Odds, o => o.MapFrom(s => s.Odds))
                .ForMember(d => d.BetSide, o=> o.MapFrom(s => s.BetSide))
                .ForMember(d => d.WinSelection, o=> o.MapFrom(s => s.WinSelection))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status))
                .ForMember(d => d.AcceptedByUserId, o => o.MapFrom(s => s.AcceptedByUserId));

            CreateMap<Database.Model.BetOffer, ProposedBetModel>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.LeagueName, o => o.MapFrom(s => s.Event.Team1.League.Name))
                .ForMember(d => d.EventStartDateTime, o => o.MapFrom(s => s.Event.StartDateTime))
                .ForMember(d => d.Team1Name, o => o.MapFrom(s => s.Event.Team1.Name))
                .ForMember(d => d.Team2Name, o => o.MapFrom(s => s.Event.Team2.Name))
                .ForMember(d => d.Stake, o => o.MapFrom(s => s.Stake))
                .ForMember(d => d.Odds, o => o.MapFrom(s => s.Odds))
                .ForMember(d => d.WinSelection, o => o.MapFrom(s => s.WinSelection))
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.GetDescription()))
                .ForMember(d => d.ProposedBy, o => o.MapFrom(s => s.ProposedByUser.UserName))
                .ForMember(d => d.ProposedByUserId, o => o.MapFrom(s => s.ProposedByUserId))
                .ForMember(d => d.AcceptedByUserId, o => o.MapFrom(s => s.AcceptedByUserId))
                .ForMember(d => d.EventId, o => o.MapFrom(s => s.EventId));

            CreateMap<ProposedBetModel, Database.Model.BetOffer>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.Stake, o => o.MapFrom(s => s.Stake))
                .ForMember(d => d.Odds, o => o.MapFrom(s => s.Odds))
                .ForPath(d => d.Status, o => o.MapFrom(s => s.Status))
                .ForPath(d => d.ProposedByUserId, o => o.MapFrom(s => s.ProposedByUserId))
                .ForMember(d => d.AcceptedByUserId, o => o.MapFrom(s => s.AcceptedByUserId))
                .ForMember(d => d.EventId, o => o.MapFrom(s => s.EventId)); ;
        }
    }
}
