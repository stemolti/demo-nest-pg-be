import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryPermissions } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryPermissions)
    private readonly categoryRepo: Repository<CategoryPermissions>,
  ) {}

  async findAll(): Promise<CategoryPermissions[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: string): Promise<CategoryPermissions> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoria non trovata');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryPermissions> {
    const category = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryPermissions> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
