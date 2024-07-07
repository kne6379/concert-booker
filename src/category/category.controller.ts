import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { CreateCategoryDto } from 'src/show/dto/create-category.dto';
import { Role } from 'src/user/types/userRole.type';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Roles(Role.ADMIN)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.categoryService.createCategory(createCategoryDto);
      return data;
    } catch (error) {}
  }
}
