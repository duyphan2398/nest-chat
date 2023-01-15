import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { RequestInterface } from '../../../core/request/request.interface';
import { ExpertAuthGuard } from '../../../guards/expert-auth.guard';
import { ExpertsService } from '../services/experts.service';
import { Responder } from '../../../core/response/responder.response';

@Controller('experts')
export class ExpertsController {
  constructor(
    @Inject(ExpertsService) private readonly expertsService: ExpertsService,
    @Inject(Responder) private readonly responder: Responder,
  ) {}

  @Post()
  @UseGuards(ExpertAuthGuard)
  async findAll(@Req() request: RequestInterface) {
    const authExpert = request.authExpert;
    return await this.expertsService.findAll();
  }

  // @Get(':id')
  // @UseGuards(ExpertAuthGuard)
  // async findOne(@Param('id') id: string) {
  //   return await this.expertsService.findOne(+id);
  // }

  @Get('profile')
  @UseGuards(ExpertAuthGuard)
  async getProfile(@Req() request: RequestInterface) {
    const authExpert = request.authExpert;
    return this.responder.httpOK(authExpert);
  }
}
