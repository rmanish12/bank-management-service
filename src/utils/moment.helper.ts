import * as moment from 'moment';
import { DB_DATE_FORMAT } from './constants';

export class MomentHelper {
  getCurrentDate() {
    return moment().format(DB_DATE_FORMAT);
  }

  getDateWithDaysAdded(days: number) {
    const addedDate = moment().add(days, 'days');
    return addedDate.format(DB_DATE_FORMAT);
  }
}
