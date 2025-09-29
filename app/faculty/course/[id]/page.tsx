import { FacultyCourseDetail } from "@/components/faculty-course-detail"

interface PageProps {
  params: {
    id: string
  }
}

export default function FacultyCoursePage({ params }: PageProps) {
  return <FacultyCourseDetail sectionId={params.id} />
}