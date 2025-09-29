-- Document Upload System Tables

-- Document types/categories
CREATE TYPE document_type AS ENUM (
  'assignment',
  'project',
  'exam',
  'lab_report',
  'presentation',
  'other'
);

-- Document status
CREATE TYPE document_status AS ENUM (
  'pending_review',
  'approved',
  'rejected',
  'revision_required'
);

-- Document uploads table
CREATE TABLE public.document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_section_id UUID REFERENCES public.course_sections(id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,

  -- Document metadata
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- File information
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,

  -- Cloudinary storage
  cloudinary_public_id TEXT NOT NULL,
  cloudinary_url TEXT NOT NULL,
  cloudinary_secure_url TEXT NOT NULL,

  -- Status and review
  status document_status NOT NULL DEFAULT 'pending_review',
  faculty_review_notes TEXT,
  reviewed_by UUID REFERENCES public.faculty(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- Submission info
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(student_id, assignment_id) -- One submission per student per assignment
);

-- Document versions (for revisions)
CREATE TABLE public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_upload_id UUID REFERENCES public.document_uploads(id) ON DELETE CASCADE,

  -- Version info
  version_number INTEGER NOT NULL,
  change_description TEXT,

  -- File information
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,

  -- Cloudinary storage
  cloudinary_public_id TEXT NOT NULL,
  cloudinary_url TEXT NOT NULL,
  cloudinary_secure_url TEXT NOT NULL,

  -- Metadata
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(document_upload_id, version_number)
);

-- Create indexes for better performance
CREATE INDEX idx_document_uploads_student_id ON public.document_uploads(student_id);
CREATE INDEX idx_document_uploads_course_section_id ON public.document_uploads(course_section_id);
CREATE INDEX idx_document_uploads_assignment_id ON public.document_uploads(assignment_id);
CREATE INDEX idx_document_uploads_status ON public.document_uploads(status);
CREATE INDEX idx_document_uploads_submitted_at ON public.document_uploads(submitted_at);
CREATE INDEX idx_document_versions_document_upload_id ON public.document_versions(document_upload_id);

-- RLS Policies for document_uploads
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- Students can view their own uploads
CREATE POLICY "Students can view own uploads" ON public.document_uploads
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

-- Students can insert their own uploads
CREATE POLICY "Students can insert own uploads" ON public.document_uploads
  FOR INSERT WITH CHECK (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

-- Students can update their own uploads (for revisions)
CREATE POLICY "Students can update own uploads" ON public.document_uploads
  FOR UPDATE USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

-- Faculty can view all uploads (for admin purposes - they can review any student documents)
CREATE POLICY "Faculty can view all uploads" ON public.document_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.faculty f
      WHERE f.user_id = auth.uid()
    )
  );

-- Faculty can update all uploads (for review)
CREATE POLICY "Faculty can update all uploads" ON public.document_uploads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.faculty f
      WHERE f.user_id = auth.uid()
    )
  );

-- RLS Policies for document_versions
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Students can view versions of their own documents
CREATE POLICY "Students can view own document versions" ON public.document_versions
  FOR SELECT USING (document_upload_id IN (
    SELECT du.id FROM public.document_uploads du
    WHERE du.student_id IN (
      SELECT s.id FROM public.students s WHERE s.user_id = auth.uid()
    )
  ));

-- Students can insert versions for their own documents
CREATE POLICY "Students can insert own document versions" ON public.document_versions
  FOR INSERT WITH CHECK (document_upload_id IN (
    SELECT du.id FROM public.document_uploads du
    WHERE du.student_id IN (
      SELECT s.id FROM public.students s WHERE s.user_id = auth.uid()
    )
  ));

-- Faculty can view versions for documents they can review
CREATE POLICY "Faculty can view course document versions" ON public.document_versions
  FOR SELECT USING (document_upload_id IN (
    SELECT du.id FROM public.document_uploads du
    WHERE du.course_section_id IN (
      SELECT cs.id FROM public.course_sections cs
      WHERE cs.faculty_id IN (
        SELECT f.id FROM public.faculty f WHERE f.user_id = auth.uid()
      )
    )
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_upload_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_document_upload_updated_at
  BEFORE UPDATE ON public.document_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_document_upload_updated_at();