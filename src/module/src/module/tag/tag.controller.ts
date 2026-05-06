import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth-guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesUser } from 'src/shared/enums/roles.enum';

@ApiBearerAuth("JWT-Auth") // Tokenni ko'ra olishni ta'minlaydi
@ApiBadRequestResponse({ description: "Internal server error" }) // umumiy xatolik uchun
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard, RolesGuard) // to'liq ma'nosi: Avval AuthGuard ishlaydi, agar token to'g'ri bo'lsa, keyin RolesGuard ishlaydi
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN) // role tekshiradi
  @Post()
  create(@Body() createTagDto: CreateTagDto, @Req() req) {
    return this.tagService.create(createTagDto, req.user.id); // req.user orqali foydalanuvchi ma'lumotlarini olish mumkin
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard) 
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @UseGuards(AuthGuard, RolesGuard) 
  @Roles(RolesUser.ADMIN, RolesUser.SUPER_ADMIN) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
