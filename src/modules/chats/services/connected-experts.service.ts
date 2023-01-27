import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ConnectedExpert } from '../entities/connected-expert.entity';

@Injectable()
export class ConnectedExpertsService {
  constructor(
    @InjectRepository(ConnectedExpert)
    private connectedExpertRepo: Repository<ConnectedExpert>,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  async findManyByConditions(condition: object): Promise<ConnectedExpert[]> {
    return await this.connectedExpertRepo.find({
      where: condition,
    });
  }

  async save(data: object): Promise<ConnectedExpert> {
    const connectedExpert = this.connectedExpertRepo.create(data);
    return await this.connectedExpertRepo.save(connectedExpert);
  }

  async deleteByConnectedId(connectedId: string) {
    return await this.connectedExpertRepo.delete({ connected_id: connectedId });
  }
}
