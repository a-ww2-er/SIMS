-- Simplified Row Level Security policies
-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Simple policies for users (avoiding recursion)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Simple policies for students
CREATE POLICY "Students can view own data" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students can insert own data" ON public.students
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Students can update own data" ON public.students
  FOR UPDATE USING (user_id = auth.uid());

-- Simple policies for faculty
CREATE POLICY "Faculty can view own data" ON public.faculty
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Faculty can insert own data" ON public.faculty
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Faculty can update own data" ON public.faculty
  FOR UPDATE USING (user_id = auth.uid());

-- Service role can manage all student and faculty data
CREATE POLICY "Service role manages students" ON public.students
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role manages faculty" ON public.faculty
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Simple policies for other tables - allow all access for now
-- You can make these more restrictive later
CREATE POLICY "Allow all course sections" ON public.course_sections FOR ALL USING (true);
CREATE POLICY "Allow all courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow all departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Allow all enrollments" ON public.enrollments FOR ALL USING (true);
CREATE POLICY "Allow all assignments" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Allow all grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Allow all attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow all announcements" ON public.announcements FOR ALL USING (true);