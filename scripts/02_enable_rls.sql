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
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Students policies
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Faculty policies
CREATE POLICY "Faculty can view their own data" ON public.faculty
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage faculty" ON public.faculty
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enrollments policies
CREATE POLICY "Students can view their enrollments" ON public.enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Grades policies
CREATE POLICY "Students can view their grades" ON public.grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Faculty can manage grades for their courses" ON public.grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.course_sections cs ON a.section_id = cs.id
      JOIN public.faculty f ON cs.faculty_id = f.id
      WHERE a.id = assignment_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course sections policies
CREATE POLICY "Everyone can view course sections" ON public.course_sections
  FOR SELECT USING (true);

CREATE POLICY "Faculty can manage their sections" ON public.course_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.faculty f 
      WHERE f.id = faculty_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assignments policies
CREATE POLICY "Students can view assignments for enrolled courses" ON public.assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON e.student_id = s.id
      WHERE e.section_id = section_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Faculty can manage assignments for their courses" ON public.assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.faculty f ON cs.faculty_id = f.id
      WHERE cs.id = section_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance policies
CREATE POLICY "Students can view their attendance" ON public.attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Faculty can manage attendance for their courses" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.faculty f ON cs.faculty_id = f.id
      WHERE cs.id = section_id AND f.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Announcements policies
CREATE POLICY "Everyone can view relevant announcements" ON public.announcements
  FOR SELECT USING (
    target_audience = 'all' OR
    (target_audience = 'students' AND EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'student'
    )) OR
    (target_audience = 'faculty' AND EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'faculty'
    )) OR
    (target_audience = 'specific_course' AND target_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON e.student_id = s.id
      WHERE e.section_id = target_id::uuid AND s.user_id = auth.uid()
    ))
  );

CREATE POLICY "Faculty and admins can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create notifications for themselves" ON public.notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and faculty can create notifications for others" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );
