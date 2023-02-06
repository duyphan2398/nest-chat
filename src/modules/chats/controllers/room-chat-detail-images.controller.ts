import {
  Controller,
  UseGuards,
  Req,
  Inject,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { MemberAuthGuard } from '../../../guards/member-auth.guard';
import { RequestInterface } from '../../../core/request/request.interface';
import { Responder } from '../../../core/response/responder.response';
import { I18nService } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomChatDetailImagesService } from '../services/room-chat-detail-images.service';
import { MaxFileSizeValidator } from '../rules/max-file-size.rule';
import { FileTypeValidator } from '../rules/file-type.rule';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chat/',
      }),
    }),
  )
  async apiUpload(
    @Req() request: RequestInterface,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 30 }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    // Get List room chat detail
    try {
      const authMember = request.authMember;

      const roomChatDetailImage = await this.roomChatDetailImagesService.save(
        file,
        authMember,
      );

      roomChatDetailImage.path =
        process.env.CURRENT_HOST + '/' + roomChatDetailImage.path;

      return this.responder.httpOK(roomChatDetailImage);
    } catch (e) {
      return this.responder.httpBadRequest(e.message);
    }
  }

  @Get('api/room-chat-detail-images/:id')
  @UseGuards(MemberAuthGuard)
  async apiGetFileInfo(
    @Req() request: RequestInterface,
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseIntPipe) room_chat_detail_image_id: number,
  ) {
    try {
      const file = await this.roomChatDetailImagesService.findById(
        room_chat_detail_image_id,
      );

      if (request.authMember.id !== file?.member_id) {
        return this.responder.httpNotFound();
      }

      file.path = process.env.CURRENT_HOST + '/' + file.path;

      return this.responder.httpOK(file);
    } catch (e) {
      return this.responder.httpBadRequest(e.message);
    }
  }

  @Get('uploads/chat/:re_name')
  async apiShowFile(
    @Res({ passthrough: true }) res: Response,
    @Param('re_name') re_name: string,
  ) {
    const file = await this.roomChatDetailImagesService.findByReName(re_name);

    let fileStream = null;
    if (!file) {
      fileStream = createReadStream(
        join(process.cwd(), 'uploads/dummy/dummy.png'),
      );
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="dummy.png"`,
      });
    } else {
      fileStream = createReadStream(join(process.cwd(), file.path));
      res.set({
        'Content-Type': file.type,
        'Content-Disposition': `inline; filename="${file.re_name}"`,
      });
    }
    return new StreamableFile(fileStream);
  }
}
