import {Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {I18nService} from "nestjs-i18n";
import {ConnectedExpert} from "../entities/connected-expert.entity";

@Injectable()
export class ConnectedExpertsService {
  constructor(
    @InjectRepository(ConnectedExpert) private expertsRepo: Repository<ConnectedExpert>,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

}
