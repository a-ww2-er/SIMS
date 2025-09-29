-- Insert sample departments
INSERT INTO public.departments (id, name, code, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CS', 'Department of Computer Science and Engineering'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mathematics', 'MATH', 'Department of Mathematics'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Physics', 'PHYS', 'Department of Physics'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Business Administration', 'BUS', 'School of Business Administration');

-- Insert sample courses
INSERT INTO public.courses (id, course_code, title, description, credits, department_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 3, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', 'CS201', 'Data Structures', 'Fundamental data structures and algorithms', 4, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440003', 'MATH101', 'Calculus I', 'Differential and integral calculus', 4, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440004', 'PHYS101', 'General Physics I', 'Mechanics and thermodynamics', 4, '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440005', 'BUS101', 'Introduction to Business', 'Fundamentals of business operations', 3, '550e8400-e29b-41d4-a716-446655440004');

-- Note: Users, students, and faculty will be created through the application
-- when users sign up and are assigned roles

-- Insert sample course sections (these would typically be created by admins)
INSERT INTO public.course_sections (id, course_id, section_number, semester, year, faculty_id, max_enrollment, schedule) VALUES
   ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '001', 'Fall', 2024, 'c50e8400-e29b-41d4-a716-446655440001', 30, '{"days": ["Mon", "Wed", "Fri"], "time": "09:00-09:50", "room": "CS101"}'),
   ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '001', 'Fall', 2024, 'c50e8400-e29b-41d4-a716-446655440001', 25, '{"days": ["Tue", "Thu"], "time": "10:00-11:30", "room": "CS201"}'),
   ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '001', 'Fall', 2024, NULL, 35, '{"days": ["Mon", "Wed", "Fri"], "time": "11:00-11:50", "room": "MATH101"}'),
   ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '001', 'Fall', 2024, NULL, 30, '{"days": ["Tue", "Thu"], "time": "14:00-15:30", "room": "PHYS101"}'),
   ('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '001', 'Fall', 2024, 'c50e8400-e29b-41d4-a716-446655440002', 40, '{"days": ["Mon", "Wed"], "time": "13:00-14:30", "room": "BUS101"}');

-- Insert sample assignments
INSERT INTO public.assignments (id, section_id, title, description, type, total_points, due_date) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Hello World Program', 'Create your first Python program', 'homework', 50, '2024-09-15 23:59:00'),
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Variables and Data Types Quiz', 'Quiz on Python basics', 'quiz', 25, '2024-09-20 14:00:00'),
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'Linked List Implementation', 'Implement a singly linked list', 'homework', 100, '2024-10-01 23:59:00'),
  ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 'Derivative Problems', 'Solve calculus derivative problems', 'homework', 75, '2024-09-25 23:59:00');

-- Insert sample users (these will be created through registration, but here are some sample profiles)
-- Note: In production, users register through the app and profiles are created automatically

-- Insert sample students
INSERT INTO public.students (id, user_id, student_id, program, year_of_study, gpa, status) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 'STU2024001', 'Computer Science', 3, 3.7, 'active'),
  ('a50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', 'STU2024002', 'Business Administration', 2, 3.2, 'active'),
  ('a50e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440003', 'STU2024003', 'Mathematics', 4, 3.9, 'active');

-- Insert sample faculty
INSERT INTO public.faculty (id, user_id, employee_id, department, position, hire_date, office_location) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440001', 'FAC2024001', 'Computer Science', 'Associate Professor', '2020-08-15', 'CS Building Room 201'),
  ('c50e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440002', 'FAC2024002', 'Business Administration', 'Professor', '2018-01-10', 'Business Building Room 105');

-- Insert sample admin user profile
-- Note: Admin user will be created through registration

-- Insert sample enrollments
INSERT INTO public.enrollments (id, student_id, section_id, status, enrollment_date) VALUES
  ('e50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'enrolled', '2024-08-28'),
  ('e50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', 'enrolled', '2024-08-28'),
  ('e50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'enrolled', '2024-08-28');

-- Insert sample grades
INSERT INTO public.grades (id, student_id, assignment_id, points_earned, status) VALUES
  ('f50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 45, 'submitted'),
  ('f50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440004', 72, 'submitted');

-- Insert sample announcements
INSERT INTO public.announcements (id, title, content, target_audience, priority) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'Welcome to Fall 2024', 'Welcome back students! Classes begin on August 28th.', 'all', 'high'),
  ('950e8400-e29b-41d4-a716-446655440002', 'Library Hours Extended', 'The library will now be open 24/7 during finals week.', 'students', 'normal'),
  ('950e8400-e29b-41d4-a716-446655440003', 'Faculty Meeting', 'Monthly faculty meeting scheduled for October 15th at 2 PM.', 'faculty', 'normal');
