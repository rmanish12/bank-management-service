interface UserDetailsResponse {
  email: string;
  name: string;
}

export class AccountTypeDetailsResponse {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
  createdBy: UserDetailsResponse;
  lastModifiedBy: UserDetailsResponse;
}
