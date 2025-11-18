export interface Login {
  jwt: string;
  refreshJwt: string;
  expiration: string;
  userDetails: {
    id: string;
    username: string;
    email: string;
    roles: { id: string; idUser: string; role: Roles }[];
    authorities: { authority: string }[];
  };
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
