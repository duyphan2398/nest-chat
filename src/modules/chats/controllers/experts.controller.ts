import { Controller, Get, UseGuards, Req, Inject } from '@nestjs/common';
import { RequestInterface } from '../../../core/request/request.interface';
import { ExpertAuthGuard } from '../../../guards/expert-auth.guard';
import { ExpertsService } from '../services/experts.service';
import { Responder } from '../../../core/response/responder.response';

@Controller()
export class ExpertsController {
  constructor(
    @Inject(ExpertsService) private readonly expertsService: ExpertsService,
    @Inject(Responder) private readonly responder: Responder,
  ) {}

  @Get('/supplier-api/suppliers/profile')
  @UseGuards(ExpertAuthGuard)
  async supplierApiProfile(@Req() request: RequestInterface) {
    const authExpert = request.authExpert;
    return this.responder.httpOK(authExpert);
  }
}
