using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ForgetTheBookie.Api.ExtensionMethods
{
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum GenericEnum)
        {
            Type genericEnumType = GenericEnum.GetType();
            System.Reflection.MemberInfo[] memberInfo = genericEnumType.GetMember(GenericEnum.ToString());

            if(memberInfo != null && memberInfo.Length > 0)
            {
                dynamic _Attribs = memberInfo[0].GetCustomAttributes(typeof(System.ComponentModel.DescriptionAttribute), false);
                if (_Attribs != null && memberInfo.Length >0)
                {
                    return ((System.ComponentModel.DescriptionAttribute)_Attribs[0]).Description;
                }
            }

            return GenericEnum.ToString();
        }
    }
}
