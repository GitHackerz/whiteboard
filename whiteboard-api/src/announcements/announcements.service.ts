import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  QueryAnnouncementsDto,
} from './dto/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAnnouncementDto) {
    // Verify user is the course instructor
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course || course.instructorId !== userId) {
      throw new ForbiddenException(
        'Only course instructors can create announcements',
      );
    }

    const announcement = await this.prisma.announcement.create({
      data: {
        courseId: dto.courseId,
        title: dto.title,
        content: dto.content,
        isPinned: dto.isPinned || false,
      },
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

    return {
      success: true,
      data: announcement,
      message: 'Announcement created successfully',
    };
  }

  async findAll(userId: string, query: QueryAnnouncementsDto) {
    const { courseId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (courseId) {
      // Verify user is enrolled or is the instructor
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          courseId,
          userId,
        },
      });

      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!enrollment && course?.instructorId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      where.courseId = courseId;
    } else {
      // Get all courses user is enrolled in or teaching
      const [enrollments, coursesAsInstructor] = await Promise.all([
        this.prisma.enrollment.findMany({
          where: { userId },
          select: { courseId: true },
        }),
        this.prisma.course.findMany({
          where: { instructorId: userId },
          select: { id: true },
        }),
      ]);

      const courseIds = [
        ...enrollments.map((e) => e.courseId),
        ...coursesAsInstructor.map((c) => c.id),
      ];

      where.courseId = { in: courseIds };
    }

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: {
          course: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      success: true,
      data: {
        announcements,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
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

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    // Verify access
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        courseId: announcement.courseId,
        userId,
      },
    });

    const course = await this.prisma.course.findUnique({
      where: { id: announcement.courseId },
    });

    if (!enrollment && course?.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: announcement,
    };
  }

  async update(userId: string, id: string, dto: UpdateAnnouncementDto) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (announcement.course.instructorId !== userId) {
      throw new ForbiddenException(
        'Only course instructors can update announcements',
      );
    }

    const updatedAnnouncement = await this.prisma.announcement.update({
      where: { id },
      data: dto,
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

    return {
      success: true,
      data: updatedAnnouncement,
      message: 'Announcement updated successfully',
    };
  }

  async remove(userId: string, id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (announcement.course.instructorId !== userId) {
      throw new ForbiddenException(
        'Only course instructors can delete announcements',
      );
    }

    await this.prisma.announcement.delete({ where: { id } });

    return {
      success: true,
      message: 'Announcement deleted successfully',
    };
  }
}
