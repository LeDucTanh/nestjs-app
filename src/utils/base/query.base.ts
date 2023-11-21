import { UserStatus } from 'src/v1/user/entities/user.entity';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Not } from 'typeorm';
import { getEndDate, getStartDate } from '../utils';

class ConditionQuery {
  public create(data: any = {}, keySearch: string) {
    const conditions = {};

    if (data.status) conditions['status'] = data.status;

    if (data.keySearch) {
      keySearch = data.keySearch;
    }

    if (data.keyword) {
      conditions[keySearch] = Like('%' + data.keyword + '%');
    }

    if (data.userId) {
      conditions['user'] = { id: data.userId };
    }

    const dateFilterField = data.dateFilterField
      ? data.dateFilterField
      : 'createdAt';

    let fromDate: Date;
    let toDate: Date;
    if (data.fromDate && data.toDate) {
      fromDate = getStartDate(data.fromDate);
      toDate = getEndDate(data.toDate);
      conditions[dateFilterField] = Between(fromDate, toDate);
    } else if (data.fromDate) {
      fromDate = getStartDate(data.fromDate);
      conditions[dateFilterField] = MoreThanOrEqual(fromDate);
    } else if (data.toDate) {
      toDate = getEndDate(data.toDate);
      conditions[dateFilterField] = LessThanOrEqual(toDate);
    }

    if (data.startTime) {
      conditions['startTime'] = MoreThanOrEqual(new Date(data.startTime));
    }
    if (data.endTime) {
      conditions['endTime'] = LessThanOrEqual(new Date(data.endTime));
    }

    return conditions;
  }

  public search(data: any = {}, conditions: any = {}) {
    const { keyword } = data;
    if (keyword && data.keySearch) {
      const keySearch = data.keySearch.split(',');
      conditions =
        keySearch.length &&
        keySearch.map((item) => {
          return { ...conditions, [item]: Like('%' + keyword + '%') };
        });
    }

    return conditions;
  }
}

export const Condition = new ConditionQuery();
