import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsDateString,
    IsOptional,
    IsBoolean,
    IsUUID,
} from 'class-validator';

export enum EventType {
  ASSIGNMENT = 'ASSIGNMENT',
  CLASS = 'CLASS',
  EXAM = 'EXAM',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  type: EventType;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;
}
