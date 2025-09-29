/*
  # Create Functions and Triggers

  1. Functions
    - handle_new_user() - Automatically create user profile after signup
    - create_student_profile() - Create student-specific profile
    - create_faculty_profile() - Create faculty-specific profile
    - update_updated_at_column() - Update timestamp trigger function
    - calculate_student_gpa() - Calculate and update student GPA
    - update_section_enrollment() - Update course section enrollment count

  2. Triggers
    - Auto-create user profiles on signup
    - Update timestamps on record changes
    - Update enrollment counts
*/

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create student profile
CREATE OR REPLACE FUNCTION public.create_student_profile(user_uuid UUID, student_program TEXT DEFAULT 'General Studies')
RETURNS UUID AS $$
DECLARE
  new_student_id TEXT;
  student_uuid UUID;
BEGIN
  -- Generate unique student ID
  new_student_id := 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.students WHERE student_id = new_student_id) LOOP
    new_student_id := 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END LOOP;
  
  INSERT INTO public.students (user_id, student_id, program)
  VALUES (user_uuid, new_student_id, student_program)
  RETURNING id INTO student_uuid;
  
  RETURN student_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create faculty profile
CREATE OR REPLACE FUNCTION public.create_faculty_profile(user_uuid UUID, faculty_department TEXT DEFAULT 'General')
RETURNS UUID AS $$
DECLARE
  new_employee_id TEXT;
  faculty_uuid UUID;
BEGIN
  -- Generate unique employee ID
  new_employee_id := 'FAC' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.faculty WHERE employee_id = new_employee_id) LOOP
    new_employee_id := 'FAC' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END LOOP;
  
  INSERT INTO public.faculty (user_id, employee_id, department)
  VALUES (user_uuid, new_employee_id, faculty_department)
  RETURNING id INTO faculty_uuid;
  
  RETURN faculty_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION public.calculate_student_gpa(student_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  total_points DECIMAL := 0;
  total_credits INTEGER := 0;
  gpa_result DECIMAL(3,2);
BEGIN
  SELECT 
    COALESCE(SUM(
      CASE 
        WHEN e.grade_points IS NOT NULL THEN e.grade_points * c.credits
        ELSE 0
      END
    ), 0),
    COALESCE(SUM(
      CASE 
        WHEN e.grade_points IS NOT NULL THEN c.credits
        ELSE 0
      END
    ), 0)
  INTO total_points, total_credits
  FROM public.enrollments e
  JOIN public.course_sections cs ON e.section_id = cs.id
  JOIN public.courses c ON cs.course_id = c.id
  WHERE e.student_id = student_uuid 
    AND e.status = 'completed'
    AND e.grade_points IS NOT NULL;

  IF total_credits > 0 THEN
    gpa_result := total_points / total_credits;
  ELSE
    gpa_result := 0.00;
  END IF;

  -- Update the student's GPA
  UPDATE public.students 
  SET gpa = gpa_result 
  WHERE id = student_uuid;

  RETURN gpa_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update course section enrollment count
CREATE OR REPLACE FUNCTION public.update_section_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'enrolled' THEN
    UPDATE public.course_sections 
    SET current_enrollment = current_enrollment + 1
    WHERE id = NEW.section_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'enrolled' THEN
    UPDATE public.course_sections 
    SET current_enrollment = current_enrollment - 1
    WHERE id = OLD.section_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status = 'enrolled' AND NEW.status != 'enrolled' THEN
      UPDATE public.course_sections 
      SET current_enrollment = current_enrollment - 1
      WHERE id = NEW.section_id;
    ELSIF OLD.status != 'enrolled' AND NEW.status = 'enrolled' THEN
      UPDATE public.course_sections 
      SET current_enrollment = current_enrollment + 1
      WHERE id = NEW.section_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_sections_updated_at BEFORE UPDATE ON public.course_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update enrollment count
DROP TRIGGER IF EXISTS update_enrollment_count ON public.enrollments;
CREATE TRIGGER update_enrollment_count
  AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_section_enrollment();