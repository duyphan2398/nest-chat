import {
  Controller,
  UseGuards,
  Req,
  Inject,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';
import { I18nService } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomChatDetailImagesService } from '../services/room-chat-detail-images.service';

@Controller()
export class RoomChatDetailImagesController {
  constructor(
    @Inject(RoomChatDetailImagesService)
    private readonly roomChatDetailImagesService: RoomChatDetailImagesService,
    @Inject(Responder) private readonly responder: Responder,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  @Post('api/room-chat-detail-images/upload')
  @UseGuards(MemberAuthGuard)
  @UseInterceptors(FileInterceptor('file', {}))
  async apiUpload(
    @Req() request: RequestInterface,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
