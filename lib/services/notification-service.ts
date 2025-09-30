import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/lib/types/database"

export class NotificationService {
  private supabase = createClient()

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching notifications:", error)
      return []
    }

    return data || []
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error fetching unread count:", error)
      return 0
    }

    return count || 0
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createNotification(notification: {
    user_id: string
    title: string
    message: string
    type: string
    related_id?: string
  }): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("notifications")
      .insert(notification)

    if (error) {
      console.error("Error creating notification:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createDocumentUploadNotification(documentId: string, uploaderName: string, documentName: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.rpc('notify_faculty_document_upload', {
      p_document_id: documentId,
      p_uploader_name: uploaderName,
      p_document_title: documentName
    })

    if (error) {
      console.error("Error creating document upload notifications:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createStatusChangeNotification(userId: string, documentName: string, oldStatus: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.rpc('notify_student_status_change', {
      p_student_user_id: userId,
      p_document_title: documentName,
      p_old_status: oldStatus,
      p_new_status: newStatus
    })

    if (error) {
      console.error("Error creating status change notification:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createAnnouncementNotification(announcementId: string, title: string, content: string, targetAudience: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.rpc('notify_users_announcement', {
      p_announcement_id: announcementId,
      p_title: title,
      p_content: content,
      p_target_audience: targetAudience
    })

    if (error) {
      console.error("Error creating announcement notifications:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)

    if (error) {
      console.error("Error deleting notification:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}