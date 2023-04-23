export interface UserDomain {
  id: number;
  name: string;
  firstsurname: string;
  secondsurname: string | undefined;
  email: string;
  nickname: string;
  points: number;
}
