import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId },
      });
    }

    return {
      success: true,
      data: settings,
    };
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto) {
    // Ensure settings exist
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId },
      });
    }

    // Update settings
    const updatedSettings = await this.prisma.userSettings.update({
      where: { userId },
      data: updateSettingsDto,
    });

    return {
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully',
    };
  }
}
