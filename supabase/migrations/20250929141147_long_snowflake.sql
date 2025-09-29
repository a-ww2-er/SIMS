/*
  # Seed Initial Data

  1. Sample Data
    - Departments
    - Courses
    - Course sections
    - Sample announcements

  Note: Users, students, and faculty will be created through the application registration process
*/

-- Insert sample departments
INSERT INTO public.departments (id, name, code, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CS', 'Department of Computer Science and Engineering'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mathematics', 'MATH', 'Department of Mathematics'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Physics', 'PHYS', 'Department of Physics'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Business Administration', 'BUS', 'School of Business Administration'),
  ('550e8400-e29b-41d4-a716-446655440005', 'English Literature', 'ENG', 'Department of English Literature')
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (id, course_code, title, description, credits, department_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 3, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', 'CS201', 'Data Structures', 'Fundamental data structures and algorithms', 4, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440003', 'CS301', 'Database Systems', 'Introduction to database design and management', 3, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440004', 'MATH101', 'Calculus I', 'Differential and integral calculus', 4, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440005', 'MATH201', 'Statistics', 'Introduction to statistical methods', 3, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440006', 'PHYS101', 'General Physics I', 'Mechanics and thermodynamics', 4, '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440007', 'BUS101', 'Introduction to Business', 'Fundamentals of business operations', 3, '550e8400-e29b-41d4-a716-446655440004'),
  ('650e8400-e29b-41d4-a716-446655440008', 'ENG101', 'English Composition', 'Academic writing and communication skills', 3, '550e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Insert sample course sections for current semester
INSERT INTO public.course_sections (id, course_id, section_number, semester, year, max_enrollment, schedule) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '001', 'Fall', 2024, 30, '{"days": ["Mon", "Wed", "Fri"], "time": "09:00-09:50", "room": "CS101"}'),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '001', 'Fall', 2024, 25, '{"days": ["Tue", "Thu"], "time": "10:00-11:30", "room": "CS201"}'),
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '001', 'Fall', 2024, 25, '{"days": ["Mon", "Wed"], "time": "14:00-15:30", "room": "CS301"}'),
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '001', 'Fall', 2024, 35, '{"days": ["Mon", "Wed", "Fri"], "time": "11:00-11:50", "room": "MATH101"}'),
  ('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '001', 'Fall', 2024, 30, '{"days": ["Tue", "Thu"], "time": "13:00-14:30", "room": "MATH201"}'),
  ('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '001', 'Fall', 2024, 30, '{"days": ["Tue", "Thu"], "time": "14:00-15:30", "room": "PHYS101"}'),
  ('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', '001', 'Fall', 2024, 40, '{"days": ["Mon", "Wed"], "time": "13:00-14:30", "room": "BUS101"}'),
  ('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '001', 'Fall', 2024, 25, '{"days": ["Mon", "Wed", "Fri"], "time": "10:00-10:50", "room": "ENG101"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample system announcements
INSERT INTO public.announcements (title, content, target_audience, priority) VALUES
  ('Welcome to Fall 2024 Semester', 'Welcome back to the new academic year! Classes begin on August 28th, 2024. Please check your course schedules and make sure you have all required materials.', 'all', 'high'),
  ('Library Hours Extended', 'The university library will extend its hours during the first two weeks of the semester. New hours: Monday-Friday 7:00 AM - 11:00 PM, Saturday-Sunday 9:00 AM - 9:00 PM.', 'students', 'normal'),
  ('Faculty Orientation Meeting', 'All faculty members are required to attend the orientation meeting on August 25th at 2:00 PM in the main auditorium. Topics will include new policies and semester planning.', 'faculty', 'high'),
  ('Student Registration Reminder', 'Late registration ends on September 6th. Students who have not completed registration should contact the registrar office immediately.', 'students', 'urgent'),
  ('Campus WiFi Maintenance', 'Campus WiFi will undergo maintenance on August 30th from 2:00 AM to 6:00 AM. Internet services may be intermittent during this time.', 'all', 'normal')
ON CONFLICT DO NOTHING;