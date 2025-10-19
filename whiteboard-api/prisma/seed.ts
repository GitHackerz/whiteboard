import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create instructors
  const instructorPassword = await bcrypt.hash('Instructor123!', 10);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      password: instructorPassword,
      firstName: 'John',
      lastName: 'Instructor',
      role: 'INSTRUCTOR',
    },
  });
  console.log('✅ Created instructor:', instructor.email);

  const instructor2Password = await bcrypt.hash('Instructor123!', 10);
  const instructor2 = await prisma.user.upsert({
    where: { email: 'instructor2@example.com' },
    update: {},
    create: {
      email: 'instructor2@example.com',
      password: instructor2Password,
      firstName: 'Sarah',
      lastName: 'Professor',
      role: 'INSTRUCTOR',
      bio: 'Experienced educator specializing in data structures and algorithms.',
    },
  });

  // Create students
  const student1Password = await bcrypt.hash('Student123!', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: student1Password,
      firstName: 'Alice',
      lastName: 'Student',
      role: 'STUDENT',
    },
  });
  console.log('✅ Created student:', student1.email);

  const student2Password = await bcrypt.hash('Student123!', 10);
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      password: student2Password,
      firstName: 'Bob',
      lastName: 'Student',
      role: 'STUDENT',
    },
  });
  console.log('✅ Created student:', student2.email);

  const student3Password = await bcrypt.hash('Student123!', 10);
  const student3 = await prisma.user.upsert({
    where: { email: 'student3@example.com' },
    update: {},
    create: {
      email: 'student3@example.com',
      password: student3Password,
      firstName: 'Charlie',
      lastName: 'Davis',
      role: 'STUDENT',
      bio: 'Aspiring software engineer with a passion for web development.',
    },
  });

  const student4Password = await bcrypt.hash('Student123!', 10);
  const student4 = await prisma.user.upsert({
    where: { email: 'student4@example.com' },
    update: {},
    create: {
      email: 'student4@example.com',
      password: student4Password,
      firstName: 'Diana',
      lastName: 'Wilson',
      role: 'STUDENT',
      bio: 'Computer science major interested in AI and machine learning.',
    },
  });
  console.log('✅ Created additional users');

  // Create user settings for all users
  await prisma.userSettings.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      theme: 'dark',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: true,
      profileVisibility: 'private',
      showEmail: false,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: instructor.id },
    update: {},
    create: {
      userId: instructor.id,
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: false,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: true,
      profileVisibility: 'public',
      showEmail: true,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: instructor2.id },
    update: {},
    create: {
      userId: instructor2.id,
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: true,
      profileVisibility: 'public',
      showEmail: true,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: false,
      profileVisibility: 'public',
      showEmail: false,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      theme: 'dark',
      language: 'en',
      emailNotifications: false,
      pushNotifications: true,
      assignmentNotifications: true,
      messageNotifications: false,
      announcementNotifications: false,
      profileVisibility: 'private',
      showEmail: false,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: student3.id },
    update: {},
    create: {
      userId: student3.id,
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: true,
      profileVisibility: 'public',
      showEmail: true,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: student4.id },
    update: {},
    create: {
      userId: student4.id,
      theme: 'dark',
      language: 'en',
      emailNotifications: true,
      pushNotifications: false,
      assignmentNotifications: true,
      messageNotifications: true,
      announcementNotifications: false,
      profileVisibility: 'public',
      showEmail: false,
    },
  });
  console.log('✅ Created user settings');

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science and programming',
      instructorId: instructor.id,
      maxEnrollment: 30,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
    },
  });
  console.log('✅ Created course:', course1.title);

  const course2 = await prisma.course.upsert({
    where: { code: 'WEB201' },
    update: {},
    create: {
      code: 'WEB201',
      title: 'Web Development Fundamentals',
      description:
        'Build modern web applications with HTML, CSS, and JavaScript',
      instructorId: instructor.id,
      maxEnrollment: 25,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
    },
  });
  console.log('✅ Created course:', course2.title);

  const course3 = await prisma.course.upsert({
    where: { code: 'DS301' },
    update: {},
    create: {
      code: 'DS301',
      title: 'Data Structures and Algorithms',
      description:
        'Advanced course covering fundamental data structures and algorithmic techniques',
      instructorId: instructor2.id,
      schedule: 'Mon/Wed 2:00 PM - 3:30 PM',
      location: 'Room 301',
      maxEnrollment: 35,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
    },
  });

  const course4 = await prisma.course.upsert({
    where: { code: 'AI401' },
    update: {},
    create: {
      code: 'AI401',
      title: 'Artificial Intelligence Fundamentals',
      description:
        'Introduction to AI concepts, machine learning, and neural networks',
      instructorId: instructor2.id,
      schedule: 'Tue/Thu 10:00 AM - 11:30 AM',
      location: 'Lab 201',
      maxEnrollment: 20,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
    },
  });
  console.log('✅ Created additional courses');

  // Enroll students in courses
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
      progress: 15,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course2.id,
      progress: 25,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id,
      progress: 10,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course2.id,
      progress: 20,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student3.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student3.id,
      courseId: course1.id,
      progress: 30,
      grade: 92.5,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student3.id,
        courseId: course3.id,
      },
    },
    update: {},
    create: {
      userId: student3.id,
      courseId: course3.id,
      progress: 45,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student4.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: student4.id,
      courseId: course2.id,
      progress: 60,
      grade: 88.0,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student4.id,
        courseId: course3.id,
      },
    },
    update: {},
    create: {
      userId: student4.id,
      courseId: course3.id,
      progress: 25,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student4.id,
        courseId: course4.id,
      },
    },
    update: {},
    create: {
      userId: student4.id,
      courseId: course4.id,
      progress: 15,
    },
  });
  console.log('✅ Created enrollments');

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Introduction to Programming - Variables and Data Types',
      description:
        'Complete exercises on variables, data types, and basic operations',
      courseId: course1.id,
      dueDate: new Date('2024-03-15'),
      maxPoints: 100,
    },
  });
  console.log('✅ Created assignment:', assignment1.title);

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Build a Simple HTML Page',
      description: 'Create a personal portfolio page using HTML and CSS',
      courseId: course2.id,
      dueDate: new Date('2024-03-20'),
      maxPoints: 100,
    },
  });
  console.log('✅ Created assignment:', assignment2.title);

  const assignment3 = await prisma.assignment.create({
    data: {
      title: 'Algorithm Analysis - Big O Notation',
      description:
        'Analyze the time and space complexity of various algorithms',
      instructions: 'Submit your analysis with examples and explanations.',
      courseId: course3.id,
      dueDate: new Date('2024-03-25'),
      maxPoints: 150,
      attachments: { files: ['algorithm_examples.pdf'] },
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      title: 'JavaScript ES6+ Features Implementation',
      description:
        'Implement modern JavaScript features in a practical application',
      instructions:
        'Create a small application demonstrating ES6+ features like async/await, destructuring, and modules.',
      courseId: course2.id,
      dueDate: new Date('2024-04-05'),
      maxPoints: 120,
    },
  });

  const assignment5 = await prisma.assignment.create({
    data: {
      title: 'Machine Learning Classification Project',
      description: 'Build and train a classification model using scikit-learn',
      instructions:
        'Choose a dataset, preprocess it, train a model, and evaluate performance.',
      courseId: course4.id,
      dueDate: new Date('2024-04-15'),
      maxPoints: 200,
    },
  });
  console.log('✅ Created additional assignments');

  // Create submissions
  const submission1 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      userId: student1.id,
      content:
        'I have completed the exercises on variables and data types. Here is my solution...',
      attachments: { files: ['variables_exercise.js', 'data_types_demo.py'] },
      grade: 95,
      feedback:
        'Excellent work! Your code is well-structured and you demonstrated good understanding of the concepts.',
      submittedAt: new Date('2024-03-10'),
      gradedAt: new Date('2024-03-12'),
    },
  });

  const submission2 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      userId: student3.id,
      content:
        'My implementation covers all the required data types and operations.',
      attachments: { files: ['assignment1_solution.java'] },
      grade: 88,
      feedback:
        'Good work overall. Consider adding more comments to explain your logic.',
      submittedAt: new Date('2024-03-12'),
      gradedAt: new Date('2024-03-14'),
    },
  });

  const submission3 = await prisma.submission.create({
    data: {
      assignmentId: assignment2.id,
      userId: student4.id,
      content:
        'I created a responsive portfolio website with modern CSS techniques.',
      attachments: { files: ['portfolio.zip', 'portfolio_screenshots.png'] },
      submittedAt: new Date('2024-03-18'),
    },
  });

  const submission4 = await prisma.submission.create({
    data: {
      assignmentId: assignment3.id,
      userId: student3.id,
      content:
        'Analysis of sorting algorithms with detailed Big O complexity calculations.',
      attachments: {
        files: ['algorithm_analysis.pdf', 'complexity_calculations.xlsx'],
      },
      submittedAt: new Date('2024-03-22'),
    },
  });
  console.log('✅ Created submissions');

  // Create messages
  await prisma.message.create({
    data: {
      senderId: instructor.id,
      receiverId: student1.id,
      content:
        'Great job on your recent assignment! I noticed you had some interesting approaches to the problem.',
      isRead: true,
      sentAt: new Date('2024-03-13'),
    },
  });

  await prisma.message.create({
    data: {
      senderId: student1.id,
      receiverId: instructor.id,
      content:
        'Thank you for the feedback! I was wondering if you could clarify the requirements for the next assignment.',
      isRead: true,
      sentAt: new Date('2024-03-13T14:30:00'),
    },
  });

  await prisma.message.create({
    data: {
      senderId: student2.id,
      receiverId: student1.id,
      content:
        "Hey Alice, do you have notes from today's lecture? I missed the first 15 minutes.",
      isRead: false,
      sentAt: new Date('2024-02-15T16:45:00'),
    },
  });

  await prisma.message.create({
    data: {
      senderId: instructor2.id,
      receiverId: student4.id,
      content:
        "Diana, I'd like to discuss your progress in the AI course. Are you available for office hours tomorrow?",
      isRead: false,
      sentAt: new Date('2024-03-20T09:15:00'),
    },
  });
  console.log('✅ Created messages');

  // Create events
  await prisma.event.create({
    data: {
      title: 'CS101 Lecture - Introduction',
      description: 'First lecture covering course overview and expectations',
      type: 'CLASS',
      startDate: new Date('2024-02-05T10:00:00'),
      endDate: new Date('2024-02-05T11:30:00'),
      userId: instructor.id,
      courseId: course1.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Web Development Workshop',
      description: 'Hands-on workshop on responsive web design',
      type: 'OTHER',
      startDate: new Date('2024-02-10T14:00:00'),
      endDate: new Date('2024-02-10T16:00:00'),
      userId: instructor.id,
      courseId: course2.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Data Structures Midterm Exam',
      description:
        'Comprehensive exam covering trees, graphs, and sorting algorithms',
      type: 'EXAM',
      startDate: new Date('2024-04-01T10:00:00'),
      endDate: new Date('2024-04-01T12:00:00'),
      location: 'Exam Hall A',
      userId: instructor2.id,
      courseId: course3.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'AI Project Presentation',
      description: 'Student presentations of machine learning projects',
      type: 'OTHER',
      startDate: new Date('2024-04-20T13:00:00'),
      endDate: new Date('2024-04-20T17:00:00'),
      location: 'Auditorium',
      userId: instructor2.id,
      courseId: course4.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Web Development Code Review Session',
      description: 'Group code review and feedback session',
      type: 'MEETING',
      startDate: new Date('2024-03-08T15:00:00'),
      endDate: new Date('2024-03-08T16:30:00'),
      userId: instructor.id,
      courseId: course2.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Assignment 1 Due',
      description: 'Deadline for Introduction to Programming assignment',
      type: 'ASSIGNMENT',
      startDate: new Date('2024-03-15T23:59:00'),
      userId: instructor.id,
      courseId: course1.id,
      isAllDay: true,
    },
  });
  console.log('✅ Created events');

  // Create study sessions
  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      duration: 120, // 2 hours
      date: new Date('2024-02-20'),
      notes:
        'Reviewed variables, data types, and control structures. Need to practice more with loops.',
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
      duration: 90, // 1.5 hours
      date: new Date('2024-02-22'),
      notes:
        'Worked on HTML/CSS responsive design. Created a mobile-first layout.',
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student3.id,
      courseId: course3.id,
      duration: 180, // 3 hours
      date: new Date('2024-03-01'),
      notes:
        "Deep dive into graph algorithms. Implemented Dijkstra's algorithm from scratch.",
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student4.id,
      courseId: course4.id,
      duration: 150, // 2.5 hours
      date: new Date('2024-03-05'),
      notes:
        'Started learning about neural networks. Set up TensorFlow environment and ran first example.',
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student2.id,
      courseId: course1.id,
      duration: 60, // 1 hour
      date: new Date('2024-02-25'),
      notes:
        'Quick review session before the quiz. Focused on key programming concepts.',
    },
  });
  console.log('✅ Created study sessions');

  // Create course modules for CS101
  const cs101_module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming, variables, and data types',
      order: 1,
      isPublished: true,
    },
  });

  const cs101_module2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Control Flow and Loops',
      description: 'Master conditional statements and looping structures',
      order: 2,
      isPublished: true,
    },
  });

  const cs101_module3 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Functions and Modularity',
      description: 'Write reusable code with functions and understand scope',
      order: 3,
      isPublished: false,
    },
  });

  // Add resources to CS101 Module 1
  await prisma.moduleResource.create({
    data: {
      moduleId: cs101_module1.id,
      title: 'What is Programming?',
      description: 'Introduction video explaining programming concepts',
      type: 'VIDEO',
      url: 'https://www.youtube.com/embed/M4lFIbO4-yM',
      duration: 8,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      moduleId: cs101_module1.id,
      title: 'Programming Fundamentals Guide',
      description:
        'Comprehensive guide covering variables, data types, and operators',
      type: 'DOCUMENT',
      url: '/docs/programming-fundamentals.pdf',
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      moduleId: cs101_module1.id,
      title: 'Variables and Data Types Reading',
      description:
        'Deep dive into how different data types work in programming',
      type: 'READING',
      content:
        'Variables are named storage locations that hold values. Different data types include integers, floating-point numbers, strings, and booleans...',
      order: 3,
    },
  });

  // Add resources to CS101 Module 2
  await prisma.moduleResource.create({
    data: {
      moduleId: cs101_module2.id,
      title: 'If Statements and Conditionals',
      description: 'Video tutorial on conditional logic',
      type: 'VIDEO',
      url: 'https://www.youtube.com/embed/conditional-video',
      duration: 9,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      moduleId: cs101_module2.id,
      title: 'Loops Explained',
      description: 'Understanding for loops, while loops, and iteration',
      type: 'VIDEO',
      url: 'https://www.youtube.com/embed/loops-video',
      duration: 10,
      order: 2,
    },
  });

  // Create sample progress records
  const resources = await prisma.moduleResource.findMany({
    where: { moduleId: cs101_module1.id },
  });

  if (resources.length > 0) {
    await prisma.resourceProgress.upsert({
      where: {
        userId_resourceId: {
          userId: student1.id,
          resourceId: resources[0].id,
        },
      },
      update: {},
      create: {
        userId: student1.id,
        resourceId: resources[0].id,
        isCompleted: true,
        completedAt: new Date('2024-02-10'),
        timeSpent: 20,
      },
    });
  }

  await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: {
        userId: student1.id,
        moduleId: cs101_module1.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      moduleId: cs101_module1.id,
      isCompleted: true,
      completedAt: new Date('2024-02-12'),
    },
  });

  console.log('✅ Created course modules and resources');

  // Create refresh tokens (simulated)
  await prisma.refreshToken.create({
    data: {
      token: 'simulated_refresh_token_admin_' + Date.now(),
      userId: admin.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: 'simulated_refresh_token_instructor_' + Date.now(),
      userId: instructor.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Created refresh tokens');

  // Create announcements for courses
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Introduction to Computer Science!',
      content: `Dear Students,

Welcome to CS101! I'm excited to have you in this course. Here are a few important points to get started:

1. Review the course syllabus and schedule
2. Complete the introductory module by the end of week 1
3. Join our online discussion forum
4. Set up your development environment

Looking forward to a great semester!

Best regards,
John Instructor`,
      isPinned: false,
      courseId: course1.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Assignment 1 Due Date Reminder',
      content: `This is a reminder that Assignment 1: "Variables and Data Types" is due this Friday at 11:59 PM.

Please ensure you:
- Test your code thoroughly
- Include comments explaining your logic
- Submit via the course portal

If you have any questions, please reach out during office hours.`,
      isPinned: true,
      courseId: course1.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'URGENT: Midterm Exam Schedule Changed',
      content: `IMPORTANT UPDATE:

Due to facility maintenance, the midterm exam has been rescheduled:

OLD: Friday, March 15th at 2:00 PM
NEW: Monday, March 18th at 2:00 PM

Location: Room 205 (changed from Room 101)

The exam will still cover Modules 1-4. Study guide has been posted to the course materials.

Please confirm you've seen this announcement by replying to this post.`,
      isPinned: true,
      courseId: course1.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Welcome to Web Development!',
      content: `Hello everyone!

Welcome to WEB201. This course will take you from HTML basics to building full-stack applications.

Week 1 Focus:
- HTML fundamentals
- CSS styling basics
- Setting up your code editor

First assignment will be posted by Wednesday. Let's build something amazing!`,
      isPinned: false,
      courseId: course2.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Project Teams Announced',
      content: `The team assignments for the final project are now available in the "Teams" section.

Each team will build a complete web application. Project requirements and rubric have been uploaded to the course materials.

Team formation deadline: End of Week 2
Project proposal deadline: Week 4

Start planning early!`,
      isPinned: true,
      courseId: course2.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Data Structures Course Introduction',
      content: `Welcome to DS301!

This advanced course will challenge you but also prepare you for technical interviews and real-world problem solving.

Prerequisites review: Please ensure you're comfortable with basic programming concepts and Big-O notation.

First quiz: Week 2 (open book, 30 minutes)`,
      isPinned: false,
      courseId: course3.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'AI Course Office Hours',
      content: `Office hours for AI401 are now scheduled:

Tuesdays: 3:00 PM - 5:00 PM
Thursdays: 1:00 PM - 3:00 PM
Location: Office 412

Also available by appointment. Looking forward to discussing AI concepts with you all!`,
      isPinned: false,
      courseId: course4.id,
    },
  });

  console.log('✅ Created announcements');

  // Create more comprehensive modules for Web Development course
  const web201_module1 = await prisma.courseModule.create({
    data: {
      title: 'HTML Fundamentals',
      description: 'Learn the building blocks of web pages with HTML5',
      courseId: course2.id,
      order: 1,
    },
  });

  const web201_module2 = await prisma.courseModule.create({
    data: {
      title: 'CSS Styling and Layouts',
      description: 'Master CSS for beautiful and responsive designs',
      courseId: course2.id,
      order: 2,
    },
  });

  const web201_module3 = await prisma.courseModule.create({
    data: {
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming',
      courseId: course2.id,
      order: 3,
    },
  });

  const web201_module4 = await prisma.courseModule.create({
    data: {
      title: 'DOM Manipulation',
      description: 'Make your web pages interactive with JavaScript',
      courseId: course2.id,
      order: 4,
    },
  });

  // Create resources for Web Development modules
  await prisma.moduleResource.create({
    data: {
      title: 'Introduction to HTML',
      description: 'Video lecture covering HTML basics and document structure',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      duration: 45,
      moduleId: web201_module1.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'HTML Tags Reference Guide',
      description: 'Comprehensive guide to all HTML5 tags',
      type: 'DOCUMENT',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      moduleId: web201_module1.id,
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'HTML Basics Quiz',
      description: 'Test your knowledge of HTML fundamentals',
      type: 'QUIZ',
      url: '/quiz/html-basics',
      moduleId: web201_module1.id,
      order: 3,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'CSS Introduction',
      description: 'Learn CSS selectors, properties, and values',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      duration: 60,
      moduleId: web201_module2.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Flexbox Layout Guide',
      description: 'Master modern CSS layouts with Flexbox',
      type: 'DOCUMENT',
      url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      moduleId: web201_module2.id,
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'CSS Grid Tutorial',
      description: 'Build complex layouts with CSS Grid',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=EFafSYg-PkI',
      duration: 35,
      moduleId: web201_module2.id,
      order: 3,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Variables, data types, and basic operations',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      duration: 75,
      moduleId: web201_module3.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Functions and Scope',
      description: 'Understanding JavaScript functions',
      type: 'DOCUMENT',
      url: 'https://javascript.info/function-basics',
      moduleId: web201_module3.id,
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'DOM Manipulation Tutorial',
      description: 'Learn to interact with web page elements',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
      duration: 40,
      moduleId: web201_module4.id,
      order: 1,
    },
  });

  // Create modules for Data Structures course
  const ds301_module1 = await prisma.courseModule.create({
    data: {
      title: 'Arrays and Linked Lists',
      description: 'Understanding fundamental linear data structures',
      courseId: course3.id,
      order: 1,
    },
  });

  const ds301_module2 = await prisma.courseModule.create({
    data: {
      title: 'Stacks and Queues',
      description: 'LIFO and FIFO data structures',
      courseId: course3.id,
      order: 2,
    },
  });

  const ds301_module3 = await prisma.courseModule.create({
    data: {
      title: 'Trees and Binary Search Trees',
      description: 'Hierarchical data structures',
      courseId: course3.id,
      order: 3,
    },
  });

  // Add resources for DS course
  await prisma.moduleResource.create({
    data: {
      title: 'Arrays Deep Dive',
      description: 'Understanding array operations and time complexity',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=QJNwK2uJyGs',
      duration: 50,
      moduleId: ds301_module1.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Linked Lists Explained',
      description: 'Single, double, and circular linked lists',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I',
      duration: 45,
      moduleId: ds301_module1.id,
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Stack Implementation',
      description: 'Building stacks from scratch',
      type: 'DOCUMENT',
      url: 'https://www.geeksforgeeks.org/stack-data-structure/',
      moduleId: ds301_module2.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Binary Trees Tutorial',
      description: 'Understanding tree traversals and operations',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=fAAZixBzIAI',
      duration: 60,
      moduleId: ds301_module3.id,
      order: 1,
    },
  });

  // Create modules for AI course
  const ai401_module1 = await prisma.courseModule.create({
    data: {
      title: 'Introduction to Artificial Intelligence',
      description: 'History, applications, and key concepts in AI',
      courseId: course4.id,
      order: 1,
    },
  });

  const ai401_module2 = await prisma.courseModule.create({
    data: {
      title: 'Machine Learning Basics',
      description: 'Supervised and unsupervised learning',
      courseId: course4.id,
      order: 2,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'What is AI?',
      description: 'Overview of artificial intelligence concepts',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
      duration: 30,
      moduleId: ai401_module1.id,
      order: 1,
    },
  });

  await prisma.moduleResource.create({
    data: {
      title: 'Machine Learning Introduction',
      description: 'Getting started with ML concepts',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
      duration: 55,
      moduleId: ai401_module2.id,
      order: 1,
    },
  });

  console.log('✅ Created additional modules and resources');

  // Create some resource progress for students
  const web201Resources = await prisma.moduleResource.findMany({
    where: {
      moduleId: {
        in: [web201_module1.id, web201_module2.id],
      },
    },
  });

  // Student 1 completes first 3 resources
  if (web201Resources.length >= 3) {
    for (let i = 0; i < 3; i++) {
      await prisma.resourceProgress.create({
        data: {
          userId: student1.id,
          resourceId: web201Resources[i].id,
          isCompleted: true,
          completedAt: new Date(Date.now() - (3 - i) * 24 * 60 * 60 * 1000),
          timeSpent: 20 + i * 5,
        },
      });
    }
  }

  // Student 3 completes first resource only
  if (web201Resources.length >= 1) {
    await prisma.resourceProgress.create({
      data: {
        userId: student3.id,
        resourceId: web201Resources[0].id,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: 25,
      },
    });
  }

  console.log('✅ Created resource progress records');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@example.com / Admin123!');
  console.log('Instructor 1: instructor@example.com / Instructor123!');
  console.log('Instructor 2: instructor2@example.com / Instructor123!');
  console.log('Student 1: student1@example.com / Student123!');
  console.log('Student 2: student2@example.com / Student123!');
  console.log('Student 3: student3@example.com / Student123!');
  console.log('Student 4: student4@example.com / Student123!');
  console.log('\n📚 Sample Data Created:');
  console.log('- 4 Courses with different subjects');
  console.log('- 9 Enrollments with varying progress');
  console.log('- 5 Assignments across different courses');
  console.log('- 4 Submissions with grades and feedback');
  console.log('- 4 Messages between users');
  console.log('- 6 Events (classes, exams, meetings)');
  console.log('- 5 Study sessions logged by students');
  console.log('- User settings for all users');
  console.log('- Refresh tokens for authentication');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
