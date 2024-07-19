import { UserDetails } from 'src/entities/user-details.entity';

export class MapperUtils {
  mapUserDetailsForResponse(userDetails: UserDetails) {
    const { email, firstName, lastName } = userDetails;

    return {
      email,
      name: `${firstName} ${lastName}`,
    };
  }
}
