import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // @Post()
  // create(@Body() createMemberDto: CreateMemberDto) {
  //   return this.membersService.create(createMemberDto);
  // }

  @Post()
  findAll() {
    return this.membersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.membersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
  //   return this.membersService.update(+id, updateMemberDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.membersService.remove(+id);
  // }
}
