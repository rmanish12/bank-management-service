import * as moment from 'moment';
import { UserAccount } from 'src/entities/user-account.entity';
import { UserDetails } from 'src/entities/user-details.entity';
import { DATE_FORMAT } from './constants';
import { isEmpty } from 'lodash';
import { UserAccountDetails } from 'src/dtos/response/user-account-details-response.dto';

export class MapperUtils {
  mapUserDetailsForResponse(userDetails: UserDetails) {
    const { email, firstName, lastName } = userDetails;

    return {
      email,
      name: `${firstName} ${lastName}`,
    };
  }

  mapUserDetailsForPermissions(userDetails: UserDetails): string[] {
    const permissions = userDetails.user.roles
      .map((role) => {
        return role.permissions.map((permission) => permission.name);
      })
      .flat();

    return [...new Set(permissions)];
  }

  mapUserAccountDetails(accountDetails: UserAccount[]): UserAccountDetails[] {
    const result = [];

    accountDetails.forEach((account) => {
      const { createdAt, closedAt, accountType, ...rest } = account;

      result.push({
        ...rest,
        createdAt: moment(createdAt).format(DATE_FORMAT),
        closedAt: !isEmpty(closedAt) ? moment(closedAt).format(DATE_FORMAT) : '',
        accountType: accountType.name,
      });
    });

    return result;
  }
}
