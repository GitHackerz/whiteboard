import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ModulesService } from './modules.service';
import {
    CreateModuleDto,
    UpdateModuleDto,
    CreateResourceDto,
    UpdateResourceDto,
    UpdateResourceProgressDto,
    UpdateModuleProgressDto,
} from './dto/module.dto';

@ApiTags('modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  // ===== MODULE ENDPOINTS =====

  @Post()
  @ApiOperation({ summary: 'Create a new module (instructors only)' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  create(@Request() req, @Body() dto: CreateModuleDto) {
    return this.modulesService.createModule(req.user.userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a module (instructors only)' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.modulesService.updateModule(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module (instructors only)' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  delete(@Request() req, @Param('id') id: string) {
    return this.modulesService.deleteModule(req.user.userId, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get module by ID with resources and progress' })
  @ApiResponse({ status: 200, description: 'Module retrieved successfully' })
  getOne(@Request() req, @Param('id') id: string) {
    return this.modulesService.getModuleById(req.user.userId, id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all modules for a course' })
  @ApiResponse({ status: 200, description: 'Modules retrieved successfully' })
  getCourseModules(@Request() req, @Param('courseId') courseId: string) {
    return this.modulesService.getCourseModules(req.user.userId, courseId);
  }

  // ===== RESOURCE ENDPOINTS =====

  @Post('resources')
  @ApiOperation({ summary: 'Create a new resource (instructors only)' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  createResource(@Request() req, @Body() dto: CreateResourceDto) {
    return this.modulesService.createResource(req.user.userId, dto);
  }

  @Put('resources/:id')
  @ApiOperation({ summary: 'Update a resource (instructors only)' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  updateResource(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.modulesService.updateResource(req.user.userId, id, dto);
  }

  @Delete('resources/:id')
  @ApiOperation({ summary: 'Delete a resource (instructors only)' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  deleteResource(@Request() req, @Param('id') id: string) {
    return this.modulesService.deleteResource(req.user.userId, id);
  }

  // ===== PROGRESS TRACKING ENDPOINTS =====

  @Post('resources/:id/progress')
  @ApiOperation({ summary: 'Update resource progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  updateResourceProgress(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateResourceProgressDto,
  ) {
    return this.modulesService.updateResourceProgress(req.user.userId, id, dto);
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Update module progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  updateModuleProgress(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateModuleProgressDto,
  ) {
    return this.modulesService.updateModuleProgress(req.user.userId, id, dto);
  }

  // ===== STATISTICS ENDPOINTS =====

  @Get('course/:courseId/statistics')
  @ApiOperation({
    summary: 'Get course statistics (instructors only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getCourseStatistics(@Request() req, @Param('courseId') courseId: string) {
    return this.modulesService.getCourseStatistics(req.user.userId, courseId);
  }
}
