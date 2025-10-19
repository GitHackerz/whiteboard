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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeSubmissionDto,
  QueryAssignmentsDto,
} from './dto/assignment.dto';

@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assignment (instructors only)' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only instructors can create assignments',
  })
  create(@Request() req, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments for enrolled courses' })
  @ApiResponse({
    status: 200,
    description: 'List of assignments with pagination',
  })
  findAll(@Request() req, @Query() query: QueryAssignmentsDto) {
    return this.assignmentsService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment details' })
  @ApiResponse({
    status: 200,
    description: 'Assignment details with user submission',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.assignmentsService.findOne(req.user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assignment (instructors only)' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only instructors can update assignments',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment (instructors only)' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only instructors can delete assignments',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.assignmentsService.remove(req.user.userId, id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit or resubmit an assignment (students only)' })
  @ApiResponse({
    status: 201,
    description: 'Assignment submitted successfully',
  })
  @ApiResponse({ status: 403, description: 'Not enrolled as a student' })
  submit(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentsService.submit(req.user.userId, id, dto);
  }

  @Post('submissions/:id/grade')
  @ApiOperation({ summary: 'Grade a submission (instructors only)' })
  @ApiResponse({ status: 200, description: 'Submission graded successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only instructors can grade submissions',
  })
  gradeSubmission(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.assignmentsService.gradeSubmission(req.user.userId, id, dto);
  }

  @Get(':id/submissions')
  @ApiOperation({
    summary: 'Get all submissions for an assignment (instructors only)',
  })
  @ApiResponse({ status: 200, description: 'List of all submissions' })
  @ApiResponse({
    status: 403,
    description: 'Only instructors can view all submissions',
  })
  getSubmissions(@Request() req, @Param('id') id: string) {
    return this.assignmentsService.getSubmissions(req.user.userId, id);
  }
}
