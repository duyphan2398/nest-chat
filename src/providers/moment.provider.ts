import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable()
export class MomentProvider {
    public readonly moment = moment;

    constructor() {
        momentTz.tz.setDefault('Asia/Hong_Kong');
    }
}
