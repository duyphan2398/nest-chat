import {
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ExpertsService } from '../modules/chats/services/experts.service';
import { RequestInterface } from '../core/request/request.interface';

export class ExpertAuthGuard implements CanActivate {
  constructor(
    @Inject(ExpertsService) private readonly expertsService: ExpertsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const token = request.headers.authorization || '';

    // Check token and assign global auth expert
    request.authExpert = await this.expertsService.verifyToken(token);

    return true;
  }
}
