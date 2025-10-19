import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateAnnouncementDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}

export class QueryAnnouncementsDto {
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;
}
