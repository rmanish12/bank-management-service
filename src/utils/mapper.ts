import { UserDetails } from 'src/entities/user-details.entity';

export class MapperUtils {
  mapUserDetailsForResponse(userDetails: UserDetails) {
    const { email, firstName, lastName } = userDetails;

    return {
      email,
      name: `${firstName} ${lastName}`,
    };
  }

  mapUserDetailsForPermissions(userDetails: UserDetails) {
    const permissions = userDetails.user.roles
      .map((role) => {
        return role.permissions.map((permission) => permission.name);
      })
      .flat();

    return [...new Set(permissions)];
  }
}
