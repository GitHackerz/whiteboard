import { IsString, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ enum: ['light', 'dark'], required: false })
  @IsEnum(['light', 'dark'])
  @IsOptional()
  theme?: string;

  @ApiProperty({ required: false, default: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  assignmentNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  messageNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  announcementNotifications?: boolean;

  @ApiProperty({ enum: ['public', 'private'], required: false })
  @IsEnum(['public', 'private'])
  @IsOptional()
  profileVisibility?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  showEmail?: boolean;
}
