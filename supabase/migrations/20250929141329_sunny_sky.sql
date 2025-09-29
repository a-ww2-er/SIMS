/*
  # Create Profile Creation Triggers

  1. Enhanced Functions
    - Enhanced handle_new_user() function to automatically create student/faculty profiles
    - Automatic profile creation based on user role

  2. Triggers
    - Trigger to create appropriate profiles after user creation
*/

-- Enhanced function to handle new user registration and create appropriate profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
  student_uuid UUID;
  faculty_uuid UUID;
BEGIN
  -- Extract role from metadata, default to 'student'
  user_role_val := COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role;
  
  -- Insert into users table
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role_val
  );

  -- Create appropriate profile based on role
  IF user_role_val = 'student' THEN
    -- Create student profile
    SELECT public.create_student_profile(NEW.id) INTO student_uuid;
  ELSIF user_role_val = 'faculty' THEN
    -- Create faculty profile
    SELECT public.create_faculty_profile(NEW.id) INTO faculty_uuid;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();