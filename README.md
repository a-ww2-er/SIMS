# SIMS
Student Information Management System

A comprehensive web application for managing student information, courses, grades, and faculty data built with Next.js, Supabase, and TypeScript.

## Features

- **Role-based Authentication**: Separate registration flows for students and faculty
- **Student Dashboard**: View courses, grades, attendance, and announcements
- **Faculty Dashboard**: Manage courses, gradebook, and student records
- **Admin Dashboard**: System-wide management and reporting
- **Real-time Data**: Powered by Supabase for real-time updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sims
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase Dashboard
   - Navigate to the SQL Editor
   - Run the migration files in order:
     1. `supabase/migrations/001_initial_schema.sql`
     2. `supabase/migrations/002_enable_rls_and_policies.sql`
     3. `supabase/migrations/003_create_functions_and_triggers.sql`
     4. `supabase/migrations/004_seed_initial_data.sql`
     5. `supabase/migrations/005_create_profile_triggers.sql`

5. Start the development server:
```bash
npm run dev
```

## Registration Flows

### Student Registration
- Navigate to `/auth/register`
- Automatically assigns 'student' role
- Creates student profile with unique student ID

### Faculty Registration  
- Navigate to `/auth/register-faculty`
- Automatically assigns 'faculty' role
- Creates faculty profile with unique employee ID

## Database Schema

The application uses a comprehensive database schema with the following main tables:

- `users` - User profiles and authentication data
- `students` - Student-specific information
- `faculty` - Faculty-specific information  
- `departments` - Academic departments
- `courses` - Course catalog
- `course_sections` - Specific course offerings
- `enrollments` - Student course enrollments
- `assignments` - Course assignments
- `grades` - Student grades
- `attendance` - Attendance records
- `announcements` - System announcements

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with Row Level Security
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
