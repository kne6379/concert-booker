import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { CreateShowDateDto } from './dto/create-showdate.dto';
import { ShowService } from './show.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';

@UseGuards(RolesGuard)
@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  //   @Get()
  //   async findAll() {
  //     return await this.teamService.findAll();
  //   }

  @Roles(Role.USER)
  @Get()
  async findOne(id: number) {
    return await this.showService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createShowDto: CreateShowDto,
    @Body('schedule') createShowDateDtos: CreateShowDateDto[],
  ) {
    try {
      await this.showService.createShow(createShowDto, createShowDateDtos);
    } catch (error) {}
  }

  //   @Roles(Role.ADMIN)
  //   @Put(':id')
  //   async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
  //     await this.teamService.update(id, updateTeamDto);
  //   }

  //   @Roles(Role.ADMIN)
  //   @Delete(':id')
  //   async delete(@Param('id') id: number) {
  //     await this.teamService.delete(id);
  //   }
}
