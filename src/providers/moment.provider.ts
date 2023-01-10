import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable()
export class MomentProvider {
    // Timezone
    public readonly timezone = process.env.TZ || 'Asia/Hong_Kong'

    // Moment
    public readonly moment = moment;


    constructor() {
        momentTz.tz.setDefault(this.timezone);
    }

    parseUtcToTimezone(date: string, format = '') {
        return this.moment.tz(date, this.timezone).format();
    }
}
