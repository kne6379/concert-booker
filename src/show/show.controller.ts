import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { Show } from './entities/show.entity';
import { Category } from './entities/category.entity';
import { CATEGORY } from './types/showRole.type';

@UseGuards(RolesGuard)
@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  //   @Get()
  //   async findAll() {
  //     return await this.teamService.findAll();
  //   }

  @Get()
  async findShow(
    @Query('category') category?: CATEGORY,
    @Query('title') title?: string,
  ): Promise<Show[]> {
    return await this.showService.findShow(category, title);
  }

  @Get(':id')
  async findByShowId(@Param('id') id: number) {
    return await this.showService.findByShowId(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async createShow(
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
