using AutoMapper;
using ForgetTheBookie.Api.ExtensionMethods;

namespace ForgetTheBookie.Api.Models.User
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<Database.Model.User, UserModel>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.UserName))
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.DateOfBirth, o => o.MapFrom(s => s.DateOfBirth));

            CreateMap<UserModel, Database.Model.User>()
                .IgnoreAllMembers()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Username))
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.DateOfBirth, o => o.MapFrom(s => s.DateOfBirth));
        }
    }
}
