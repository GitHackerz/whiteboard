import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../auth/user.decorator';
import {
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
    QueryAnnouncementsDto,
} from './dto/announcement.dto';

// Use the correct decorator name
@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(@User('id') userId: string, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(userId, dto);
  }

  @Get()
  findAll(@User('id') userId: string, @Query() query: QueryAnnouncementsDto) {
    return this.announcementsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@User('id') userId: string, @Param('id') id: string) {
    return this.announcementsService.findOne(userId, id);
  }

  @Put(':id')
  update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@User('id') userId: string, @Param('id') id: string) {
    return this.announcementsService.remove(userId, id);
  }
}
