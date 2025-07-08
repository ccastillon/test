using AutoMapper;
using ForgetTheBookie.Api.ExtensionMethods;
using ForgetTheBookie.Database.Model;

namespace ForgetTheBookie.Api.Models.Event
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            CreateMap<Database.Model.Event, EventModel>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(d => d.Id))
                .ForMember(d => d.StartDateTime, o => o.MapFrom(d => d.StartDateTime))
                .ForMember(d => d.EndDateTime, o => o.MapFrom(d => d.EndDateTime))
                .ForMember(d => d.LeagueName, o => o.MapFrom(d => d.Team1.League.Name))
                .ForMember(d => d.Team1Name, o => o.MapFrom(d => d.Team1.Name))
                .ForMember(d => d.Team2Name, o => o.MapFrom(d => d.Team2.Name));

            CreateMap<CreateEditEventModel, Database.Model.Event>()
                .IgnoreAllMembers()
                .ForMember(d => d.StartDateTime, o => o.MapFrom(d => d.StartDateTime))
                .ForMember(d => d.EndDateTime, o => o.MapFrom(d => d.EndDateTime))
                .ForMember(d => d.Team1Id, o => o.MapFrom(d => d.Team1Id))
                .ForMember(d => d.Team2Id, o => o.MapFrom(d => d.Team2Id));
        }
    }
}
