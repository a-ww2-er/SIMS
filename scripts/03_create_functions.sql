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

-- Trigger to call the function after user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
  IF TG_OP = 'INSERT' THEN
    UPDATE public.course_sections 
    SET current_enrollment = current_enrollment + 1
    WHERE id = NEW.section_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.course_sections 
    SET current_enrollment = current_enrollment - 1
    WHERE id = OLD.section_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update enrollment count
CREATE TRIGGER update_enrollment_count
  AFTER INSERT OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_section_enrollment();
