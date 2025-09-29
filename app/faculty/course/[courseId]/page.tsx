import { CourseDetails } from "@/components/course-details"

interface PageProps {
  params: {
    courseId: string
  }
  searchParams: {
    sectionId?: string
  }
}

export default function FacultyCourseDetailsPage({ params, searchParams }: PageProps) {
  return (
    <CourseDetails
      courseId={params.courseId}
      sectionId={searchParams.sectionId}
      userType="faculty"
    />
  )
}