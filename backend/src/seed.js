import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Job } from './models/Job.js';
import { Resource } from './models/Resource.js';
import { CommunityGroup } from './models/CommunityGroup.js';
import { Announcement } from './models/Announcement.js';
import { MentorProfile } from './models/MentorProfile.js';
import {
  SEED_ADMIN,
  SEED_STUDENT,
  SEED_MENTOR,
  SEED_MODERATOR,
  SEED_JOBS,
  SEED_RESOURCES,
  SEED_COMMUNITY_GROUPS
} from './utils/seedData.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Job.deleteMany(),
      Resource.deleteMany(),
      CommunityGroup.deleteMany(),
      Announcement.deleteMany(),
      MentorProfile.deleteMany()
    ]);

    console.log('👤 Seeding default users (Admin, Moderator, Student, Mentor)...');
    const [admin, moderator, student, mentor] = await Promise.all([
      User.create(SEED_ADMIN),
      User.create(SEED_MODERATOR),
      User.create(SEED_STUDENT),
      User.create(SEED_MENTOR)
    ]);

    console.log(`✅ Admin Account created: ${admin.email} (Password: AdminPassword123!)`);
    console.log(`✅ Moderator Account created: ${moderator.email} (Password: ModeratorPassword123!)`);
    console.log(`✅ Student Account created: ${student.email} (Password: StudentPassword123!)`);
    console.log(`✅ Mentor Account created: ${mentor.email} (Password: MentorPassword123!)`);

    console.log('💼 Seeding jobs and inductions...');
    const jobsToInsert = SEED_JOBS.map((j) => ({ ...j, createdBy: admin._id }));
    await Job.insertMany(jobsToInsert);

    console.log('📚 Seeding study resources...');
    const resourcesToInsert = SEED_RESOURCES.map((r) => ({ ...r, uploadedBy: admin._id }));
    await Resource.insertMany(resourcesToInsert);

    console.log('👥 Seeding community groups...');
    await CommunityGroup.insertMany(SEED_COMMUNITY_GROUPS);

    console.log('📢 Seeding announcements...');
    await Announcement.create([
      {
        title: 'EY Pakistan Fall 2026 Inductions Open for CA Inter & ACCA',
        summary: 'EY Pakistan has officially launched applications for its Fall articleship and audit internship batch.',
        content: 'Eligible candidates with CAF papers cleared or ACCA affiliates can apply through the official careers portal before the deadline.',
        category: 'Induction',
        eventDate: 'JUNE 2026',
        isPinned: true,
        status: 'Open'
      },
      {
        title: 'Exclusive Live Webinar: Partner Round Interview Secrets with Saboor Ahmad',
        summary: 'Join our interactive live masterclass on clearing Big 4 partner interviews and case study rounds.',
        content: 'Free registration for all CA & ACCA students. Live Q&A and CV vetting included.',
        category: 'Webinar',
        eventDate: 'JULY 2026',
        isPinned: false,
        status: 'Upcoming'
      }
    ]);

    console.log('⭐ Seeding Mentor Profile...');
    await MentorProfile.create({
      user: mentor._id,
      name: mentor.name,
      headline: 'Senior Audit Manager & Career Mentor',
      bio: 'Ex-PwC Senior Manager with extensive experience in Big 4 recruitment and articleship counseling in Pakistan and the Middle East.',
      expertise: ['Big 4 Audit Inductions', 'CV Review', 'Partner Interview Prep', 'IFRS Standards'],
      qualifications: ['CA (ICAP)', 'ACCA (UK)'],
      experience: '8+ Years Experience',
      company: 'PwC Alum',
      rating: 4.9,
      totalReviews: 28,
      verified: true
    });

    console.log(`
============================================================
✨ Database Seed Completed Successfully!
✨ Ready for full testing and integration.
============================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
