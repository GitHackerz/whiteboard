import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'CS101' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Introduction to Computer Science' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn the fundamentals of programming' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'uuid-of-instructor' })
  @IsString()
  instructorId: string;

  @ApiProperty({ example: 'Mon, Wed, Fri 10:00-11:30', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ example: 'Room 301', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 50, default: 50 })
  @IsInt()
  @IsOptional()
  maxEnrollment?: number;

  @ApiProperty({ example: '2025-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-15' })
  @IsDateString()
  endDate: string;
}

export class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  maxEnrollment?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class QueryCoursesDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instructorId?: string;
}
