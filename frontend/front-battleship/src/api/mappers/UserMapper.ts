import { UserDomain } from '../domain/UserDomain';

export function mapUserDataToUserDomain(dto: any): UserDomain {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    firstsurname: dto.firstsurname,
    secondsurname: dto.secondsurname,
    nickname: dto.nickname
  };
}
