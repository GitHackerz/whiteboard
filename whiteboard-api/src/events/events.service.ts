import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        userId,
        title: createEventDto.title,
        description: createEventDto.description,
        type: createEventDto.type,
        startDate: new Date(createEventDto.startDate),
        endDate: createEventDto.endDate
          ? new Date(createEventDto.endDate)
          : null,
        location: createEventDto.location,
        courseId: createEventDto.courseId,
        isAllDay: createEventDto.isAllDay || false,
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('You can only view your own events');
    }

    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    const updateData: any = { ...updateEventDto };
    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }

    return this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
