export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          last_activity: string
          session_token: string
          two_factor_verified: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown
          last_activity?: string
          session_token: string
          two_factor_verified?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_activity?: string
          session_token?: string
          two_factor_verified?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          attachments: Json | null
          audience_type: string
          body_ar: string | null
          body_en: string
          body_ru: string | null
          body_tr: string | null
          clicks: number | null
          created_at: string | null
          created_by: string | null
          cta_link: string | null
          cta_text: string | null
          delivery_channels: string[]
          email_opens: number | null
          end_time: string | null
          id: string
          impressions: number | null
          start_time: string | null
          target_courses: string[] | null
          target_locales: string[] | null
          target_tags: string[] | null
          title_ar: string | null
          title_en: string
          title_ru: string | null
          title_tr: string | null
          updated_at: string | null
          visibility: string
        }
        Insert: {
          attachments?: Json | null
          audience_type?: string
          body_ar?: string | null
          body_en: string
          body_ru?: string | null
          body_tr?: string | null
          clicks?: number | null
          created_at?: string | null
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          delivery_channels?: string[]
          email_opens?: number | null
          end_time?: string | null
          id?: string
          impressions?: number | null
          start_time?: string | null
          target_courses?: string[] | null
          target_locales?: string[] | null
          target_tags?: string[] | null
          title_ar?: string | null
          title_en: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          attachments?: Json | null
          audience_type?: string
          body_ar?: string | null
          body_en?: string
          body_ru?: string | null
          body_tr?: string | null
          clicks?: number | null
          created_at?: string | null
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          delivery_channels?: string[]
          email_opens?: number | null
          end_time?: string | null
          id?: string
          impressions?: number | null
          start_time?: string | null
          target_courses?: string[] | null
          target_locales?: string[] | null
          target_tags?: string[] | null
          title_ar?: string | null
          title_en?: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
          visibility?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name_ar: string
          name_en: string
          name_ru: string
          name_tr: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name_ar: string
          name_en: string
          name_ru: string
          name_tr: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          name_ru?: string
          name_tr?: string
          slug?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          created_at: string
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          created_at?: string
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          created_at?: string
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          course_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          slug: string
          updated_at: string | null
          whatsapp_invite_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          slug: string
          updated_at?: string | null
          whatsapp_invite_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          slug?: string
          updated_at?: string | null
          whatsapp_invite_url?: string | null
        }
        Relationships: []
      }
      community_admins: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          community_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          community_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          community_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_admins_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_applications: {
        Row: {
          availability_hours: number
          city: string | null
          country: string | null
          created_at: string
          department: string
          email: string
          experience_level: string
          full_name: string
          github_url: string | null
          honeypot: string | null
          id: string
          interests: string[]
          ip_address: unknown
          kvkk_consent: boolean
          kvkk_consent_timestamp: string
          kvkk_consent_version: string
          linkedin_url: string | null
          locale: string
          motivation: string
          portfolio_url: string | null
          preferred_tracks: string[]
          referrer: string | null
          submission_count: number | null
          telegram: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          availability_hours: number
          city?: string | null
          country?: string | null
          created_at?: string
          department: string
          email: string
          experience_level: string
          full_name: string
          github_url?: string | null
          honeypot?: string | null
          id?: string
          interests: string[]
          ip_address?: unknown
          kvkk_consent?: boolean
          kvkk_consent_timestamp?: string
          kvkk_consent_version?: string
          linkedin_url?: string | null
          locale?: string
          motivation: string
          portfolio_url?: string | null
          preferred_tracks: string[]
          referrer?: string | null
          submission_count?: number | null
          telegram?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          availability_hours?: number
          city?: string | null
          country?: string | null
          created_at?: string
          department?: string
          email?: string
          experience_level?: string
          full_name?: string
          github_url?: string | null
          honeypot?: string | null
          id?: string
          interests?: string[]
          ip_address?: unknown
          kvkk_consent?: boolean
          kvkk_consent_timestamp?: string
          kvkk_consent_version?: string
          linkedin_url?: string | null
          locale?: string
          motivation?: string
          portfolio_url?: string | null
          preferred_tracks?: string[]
          referrer?: string | null
          submission_count?: number | null
          telegram?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_ru: string | null
          description_tr: string | null
          duration_hours: number | null
          featured: boolean | null
          hero_image: string | null
          id: string
          instructor_id: string | null
          is_free: boolean | null
          is_published: boolean | null
          language: Database["public"]["Enums"]["course_language"]
          level: Database["public"]["Enums"]["course_level"]
          outcomes_ar: string[] | null
          outcomes_en: string[] | null
          outcomes_ru: string[] | null
          outcomes_tr: string[] | null
          prerequisites_ar: string[] | null
          prerequisites_en: string[] | null
          prerequisites_ru: string[] | null
          prerequisites_tr: string[] | null
          price: number | null
          promo_video: string | null
          rating: number | null
          slug: string
          subtitle_ar: string | null
          subtitle_en: string | null
          subtitle_ru: string | null
          subtitle_tr: string | null
          tags: string[] | null
          title_ar: string
          title_en: string
          title_ru: string
          title_tr: string
          total_enrollments: number | null
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_hours?: number | null
          featured?: boolean | null
          hero_image?: string | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          language?: Database["public"]["Enums"]["course_language"]
          level?: Database["public"]["Enums"]["course_level"]
          outcomes_ar?: string[] | null
          outcomes_en?: string[] | null
          outcomes_ru?: string[] | null
          outcomes_tr?: string[] | null
          prerequisites_ar?: string[] | null
          prerequisites_en?: string[] | null
          prerequisites_ru?: string[] | null
          prerequisites_tr?: string[] | null
          price?: number | null
          promo_video?: string | null
          rating?: number | null
          slug: string
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          tags?: string[] | null
          title_ar: string
          title_en: string
          title_ru: string
          title_tr: string
          total_enrollments?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_hours?: number | null
          featured?: boolean | null
          hero_image?: string | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          language?: Database["public"]["Enums"]["course_language"]
          level?: Database["public"]["Enums"]["course_level"]
          outcomes_ar?: string[] | null
          outcomes_en?: string[] | null
          outcomes_ru?: string[] | null
          outcomes_tr?: string[] | null
          prerequisites_ar?: string[] | null
          prerequisites_en?: string[] | null
          prerequisites_ru?: string[] | null
          prerequisites_tr?: string[] | null
          price?: number | null
          promo_video?: string | null
          rating?: number | null
          slug?: string
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          tags?: string[] | null
          title_ar?: string
          title_en?: string
          title_ru?: string
          title_tr?: string
          total_enrollments?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      education_profiles: {
        Row: {
          created_at: string
          department: string
          email_course_updates: boolean | null
          email_marketing: boolean | null
          email_newsletters: boolean | null
          focus_areas: string[]
          full_name: string
          id: string
          kvkk_consent: boolean
          kvkk_consent_timestamp: string
          kvkk_consent_version: string
          locale: string
          preferred_language: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department: string
          email_course_updates?: boolean | null
          email_marketing?: boolean | null
          email_newsletters?: boolean | null
          focus_areas: string[]
          full_name: string
          id?: string
          kvkk_consent?: boolean
          kvkk_consent_timestamp?: string
          kvkk_consent_version?: string
          locale?: string
          preferred_language?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string
          email_course_updates?: boolean | null
          email_marketing?: boolean | null
          email_newsletters?: boolean | null
          focus_areas?: string[]
          full_name?: string
          id?: string
          kvkk_consent?: boolean
          kvkk_consent_timestamp?: string
          kvkk_consent_version?: string
          locale?: string
          preferred_language?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          archive_at: string | null
          attachments: Json | null
          capacity: number | null
          cover_image: string | null
          created_at: string
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          description_ru: string | null
          description_tr: string | null
          end_date: string | null
          id: string
          language: string
          location_address: string | null
          location_online_link: string | null
          location_type: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          promo_video: string | null
          publish_at: string | null
          rsvp_link: string | null
          slug: string
          start_date: string
          subtitle_ar: string | null
          subtitle_en: string | null
          subtitle_ru: string | null
          subtitle_tr: string | null
          tags: string[] | null
          timezone: string
          title_ar: string | null
          title_en: string
          title_ru: string | null
          title_tr: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          archive_at?: string | null
          attachments?: Json | null
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          end_date?: string | null
          id?: string
          language?: string
          location_address?: string | null
          location_online_link?: string | null
          location_type?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          promo_video?: string | null
          publish_at?: string | null
          rsvp_link?: string | null
          slug: string
          start_date: string
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          tags?: string[] | null
          timezone?: string
          title_ar?: string | null
          title_en: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          archive_at?: string | null
          attachments?: Json | null
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          end_date?: string | null
          id?: string
          language?: string
          location_address?: string | null
          location_online_link?: string | null
          location_type?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          promo_video?: string | null
          publish_at?: string | null
          rsvp_link?: string | null
          slug?: string
          start_date?: string
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          tags?: string[] | null
          timezone?: string
          title_ar?: string | null
          title_en?: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          avatar_url: string | null
          bio_ar: string | null
          bio_en: string | null
          bio_ru: string | null
          bio_tr: string | null
          created_at: string
          id: string
          name: string
          rating: number | null
          title: string | null
          total_courses: number | null
          total_students: number | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string
          id?: string
          name: string
          rating?: number | null
          title?: string | null
          total_courses?: number | null
          total_students?: number | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string
          id?: string
          name?: string
          rating?: number | null
          title?: string | null
          total_courses?: number | null
          total_students?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ip_blacklist: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          reason: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
          is_active?: boolean | null
          reason: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          reason?: string
        }
        Relationships: []
      }
      kvkk_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          details: string
          email: string
          full_name: string
          id: string
          locale: string
          request_type: string
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          details: string
          email: string
          full_name: string
          id?: string
          locale?: string
          request_type: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          details?: string
          email?: string
          full_name?: string
          id?: string
          locale?: string
          request_type?: string
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lecture_subtitles: {
        Row: {
          id: string
          lecture_id: number
          subtitle_ar: string | null
          subtitle_en: string | null
          subtitle_ru: string | null
          subtitle_tr: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          lecture_id: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          lecture_id?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_ru?: string | null
          subtitle_tr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          last_watched_at: string | null
          lesson_id: string
          progress_percentage: number | null
          updated_at: string
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          lesson_id: string
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          lesson_id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_ru: string | null
          description_tr: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          order_index: number
          title_ar: string | null
          title_en: string
          title_ru: string | null
          title_tr: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index: number
          title_ar?: string | null
          title_en: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number
          title_ar?: string | null
          title_en?: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          duration_seconds: number | null
          file_hash: string | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          folder: string | null
          id: string
          is_public: boolean | null
          mime_type: string
          original_filename: string
          storage_bucket: string
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
          usage_count: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          duration_seconds?: number | null
          file_hash?: string | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          folder?: string | null
          id?: string
          is_public?: boolean | null
          mime_type: string
          original_filename: string
          storage_bucket: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          duration_seconds?: number | null
          file_hash?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          filename?: string
          folder?: string | null
          id?: string
          is_public?: boolean | null
          mime_type?: string
          original_filename?: string
          storage_bucket?: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          passed: boolean | null
          quiz_id: string
          score: number
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          id?: string
          passed?: boolean | null
          quiz_id: string
          score: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          passed?: boolean | null
          quiz_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          passing_score: number | null
          questions: Json
          title_ar: string | null
          title_en: string
          title_ru: string | null
          title_tr: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          passing_score?: number | null
          questions: Json
          title_ar?: string | null
          title_en: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          passing_score?: number | null
          questions?: Json
          title_ar?: string | null
          title_en?: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number
          updated_at: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          course_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          course_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          endpoint: string | null
          event_type: string
          id: string
          ip_address: unknown
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      site_messages: {
        Row: {
          broadcast_channels: string[] | null
          category: string | null
          content_ar: string | null
          content_en: string
          content_ru: string | null
          content_tr: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          message_key: string
          message_type: string
          schedule_end: string | null
          schedule_start: string | null
          target_audience: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          broadcast_channels?: string[] | null
          category?: string | null
          content_ar?: string | null
          content_en: string
          content_ru?: string | null
          content_tr?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          message_key: string
          message_type?: string
          schedule_end?: string | null
          schedule_start?: string | null
          target_audience?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          broadcast_channels?: string[] | null
          category?: string | null
          content_ar?: string | null
          content_en?: string
          content_ru?: string | null
          content_tr?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          message_key?: string
          message_type?: string
          schedule_end?: string | null
          schedule_start?: string | null
          target_audience?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      subtitle_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          generated_files: Json | null
          id: string
          lecture_id: number
          lecture_title: string
          metadata: Json | null
          progress: number | null
          started_at: string | null
          status: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          generated_files?: Json | null
          id?: string
          lecture_id: number
          lecture_title: string
          metadata?: Json | null
          progress?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          generated_files?: Json | null
          id?: string
          lecture_id?: number
          lecture_title?: string
          metadata?: Json | null
          progress?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      utaab_rate_limits: {
        Row: {
          banned_until: string | null
          created_at: string | null
          id: string
          identifier: string
          request_count: number | null
          tier: string
          updated_at: string | null
          violation_count: number | null
          window_start: string | null
        }
        Insert: {
          banned_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          request_count?: number | null
          tier: string
          updated_at?: string | null
          violation_count?: number | null
          window_start?: string | null
        }
        Update: {
          banned_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          request_count?: number | null
          tier?: string
          updated_at?: string | null
          violation_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      utaab_verifications: {
        Row: {
          behavior_data: Json | null
          challenges_passed: string[] | null
          created_at: string | null
          fingerprint_hash: string | null
          id: string
          ip_address: unknown
          pow_difficulty: number | null
          pow_solution: string | null
          risk_score: number | null
          session_id: string
          user_agent: string | null
          verdict: string
        }
        Insert: {
          behavior_data?: Json | null
          challenges_passed?: string[] | null
          created_at?: string | null
          fingerprint_hash?: string | null
          id?: string
          ip_address?: unknown
          pow_difficulty?: number | null
          pow_solution?: string | null
          risk_score?: number | null
          session_id: string
          user_agent?: string | null
          verdict: string
        }
        Update: {
          behavior_data?: Json | null
          challenges_passed?: string[] | null
          created_at?: string | null
          fingerprint_hash?: string | null
          id?: string
          ip_address?: unknown
          pow_difficulty?: number | null
          pow_solution?: string | null
          risk_score?: number | null
          session_id?: string
          user_agent?: string | null
          verdict?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_admin_sessions: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_security_events: { Args: never; Returns: undefined }
      cleanup_old_utaab_records: { Args: never; Returns: undefined }
      ensure_admin_role: { Args: { admin_email: string }; Returns: undefined }
      generate_certificate_number: { Args: never; Returns: string }
      get_security_metrics: {
        Args: { _hours?: number }
        Returns: {
          events_by_severity: Json
          events_by_type: Json
          recent_spikes: Json
          top_ips: Json
          total_events: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_ip_blacklisted: { Args: { _ip: unknown }; Returns: boolean }
      log_security_event: {
        Args: {
          _details?: Json
          _endpoint?: string
          _event_type: string
          _ip?: unknown
          _severity: string
          _user_agent?: string
          _user_id?: string
        }
        Returns: string
      }
      provision_root_admin: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "instructor"
        | "student"
        | "community_admin"
        | "moderator"
        | "user"
      course_language: "en" | "tr" | "ru" | "ar"
      course_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "instructor",
        "student",
        "community_admin",
        "moderator",
        "user",
      ],
      course_language: ["en", "tr", "ru", "ar"],
      course_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
