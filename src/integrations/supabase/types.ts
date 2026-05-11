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
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name_ar: string | null
          name_en: string
          name_ru: string | null
          name_tr: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar?: string | null
          name_en: string
          name_ru?: string | null
          name_tr?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string | null
          name_en?: string
          name_ru?: string | null
          name_tr?: string | null
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          id: string
          post_id: string
        }
        Insert: {
          category_id: string
          id?: string
          post_id: string
        }
        Update: {
          category_id?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          attachments: Json | null
          author_name: string | null
          content: Json | null
          cover_image: string | null
          created_at: string
          created_by: string | null
          excerpt_ar: string | null
          excerpt_en: string | null
          excerpt_ru: string | null
          excerpt_tr: string | null
          featured: boolean | null
          gallery: Json | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          publish_date: string | null
          scheduled_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title_ar: string | null
          title_en: string
          title_ru: string | null
          title_tr: string | null
          updated_at: string
          video_type: string | null
          video_url: string | null
        }
        Insert: {
          attachments?: Json | null
          author_name?: string | null
          content?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_ru?: string | null
          excerpt_tr?: string | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          publish_date?: string | null
          scheduled_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title_ar?: string | null
          title_en: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
        }
        Update: {
          attachments?: Json | null
          author_name?: string | null
          content?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_ru?: string | null
          excerpt_tr?: string | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          publish_date?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title_ar?: string | null
          title_en?: string
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
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
      cert_events: {
        Row: {
          certificate_description: string | null
          certificate_quantity: number | null
          certificate_title: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string | null
          event_code: string
          event_date: string | null
          event_name: string
          event_slug: string
          event_type: string | null
          id: string
          issued_by: string
          location: string | null
          organizer: string | null
          partners: string[] | null
          serial_prefix: string | null
          speaker_name: string | null
          start_time: string | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          certificate_description?: string | null
          certificate_quantity?: number | null
          certificate_title?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          event_code: string
          event_date?: string | null
          event_name: string
          event_slug: string
          event_type?: string | null
          id?: string
          issued_by?: string
          location?: string | null
          organizer?: string | null
          partners?: string[] | null
          serial_prefix?: string | null
          speaker_name?: string | null
          start_time?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          certificate_description?: string | null
          certificate_quantity?: number | null
          certificate_title?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          event_code?: string
          event_date?: string | null
          event_name?: string
          event_slug?: string
          event_type?: string | null
          id?: string
          issued_by?: string
          location?: string | null
          organizer?: string | null
          partners?: string[] | null
          serial_prefix?: string | null
          speaker_name?: string | null
          start_time?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cert_events_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cert_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cert_participants: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cert_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "cert_events"
            referencedColumns: ["id"]
          },
        ]
      }
      cert_records: {
        Row: {
          blockchain_tx_hash: string | null
          chain_id: number | null
          contract_address: string | null
          created_at: string
          event_hash: string
          event_id: string
          id: string
          issued_at: string | null
          issued_by_hash: string
          participant_id: string | null
          pdf_url: string | null
          qr_url: string | null
          revocation_reason: string | null
          revoked_at: string | null
          serial_hash: string
          serial_number: string
          status: string
          updated_at: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          chain_id?: number | null
          contract_address?: string | null
          created_at?: string
          event_hash: string
          event_id: string
          id?: string
          issued_at?: string | null
          issued_by_hash: string
          participant_id?: string | null
          pdf_url?: string | null
          qr_url?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          serial_hash: string
          serial_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          chain_id?: number | null
          contract_address?: string | null
          created_at?: string
          event_hash?: string
          event_id?: string
          id?: string
          issued_at?: string | null
          issued_by_hash?: string
          participant_id?: string | null
          pdf_url?: string | null
          qr_url?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          serial_hash?: string
          serial_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cert_records_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "cert_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cert_records_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "cert_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      cert_templates: {
        Row: {
          background_color: string | null
          body_text: string | null
          created_at: string
          footer_text: string | null
          id: string
          layout_json: Json | null
          primary_color: string | null
          secondary_color: string | null
          show_qr: boolean | null
          signature_text: string | null
          template_name: string
          title_text: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          body_text?: string | null
          created_at?: string
          footer_text?: string | null
          id?: string
          layout_json?: Json | null
          primary_color?: string | null
          secondary_color?: string | null
          show_qr?: boolean | null
          signature_text?: string | null
          template_name: string
          title_text?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          body_text?: string | null
          created_at?: string
          footer_text?: string | null
          id?: string
          layout_json?: Json | null
          primary_color?: string | null
          secondary_color?: string | null
          show_qr?: boolean | null
          signature_text?: string | null
          template_name?: string
          title_text?: string | null
          updated_at?: string
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
          {
            foreignKeyName: "community_admins_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities_public"
            referencedColumns: ["id"]
          },
        ]
      }
      community_applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          availability_hours: number
          city: string | null
          converted_user_id: string | null
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
          invite_expires_at: string | null
          invite_token: string | null
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
          status: string
          submission_count: number | null
          telegram: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          availability_hours: number
          city?: string | null
          converted_user_id?: string | null
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
          invite_expires_at?: string | null
          invite_token?: string | null
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
          status?: string
          submission_count?: number | null
          telegram?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          availability_hours?: number
          city?: string | null
          converted_user_id?: string | null
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
          invite_expires_at?: string | null
          invite_token?: string | null
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
          status?: string
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
      contributor_assessments: {
        Row: {
          ai_result: Json | null
          created_at: string
          email: string
          form_data: Json
          full_name: string
          id: string
        }
        Insert: {
          ai_result?: Json | null
          created_at?: string
          email: string
          form_data?: Json
          full_name: string
          id?: string
        }
        Update: {
          ai_result?: Json | null
          created_at?: string
          email?: string
          form_data?: Json
          full_name?: string
          id?: string
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "safe_lessons"
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
      login_history: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip_address: string | null
          provider: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          provider?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          provider?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "safe_quizzes"
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
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "safe_lessons"
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
      site_visits: {
        Row: {
          city: string | null
          country_code: string | null
          country_name: string | null
          created_at: string
          id: string
          is_bot: boolean
          path: string | null
          referrer: string | null
          user_agent: string | null
          visitor_hash: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          is_bot?: boolean
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visitor_hash?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          is_bot?: boolean
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visitor_hash?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio_ar: string | null
          bio_en: string | null
          bio_ru: string | null
          bio_tr: string | null
          created_at: string
          department: string
          display_order: number
          email: string | null
          full_name: string
          id: string
          image_url: string | null
          instagram_url: string | null
          is_featured: boolean
          is_published: boolean
          linkedin_url: string | null
          phone: string | null
          role_title: string
          telegram_url: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string
          department?: string
          display_order?: number
          email?: string | null
          full_name: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          linkedin_url?: string | null
          phone?: string | null
          role_title: string
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string
          department?: string
          display_order?: number
          email?: string | null
          full_name?: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          linkedin_url?: string | null
          phone?: string | null
          role_title?: string
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
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
      utaab_global_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number | null
          window_start?: string | null
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
          expires_at: string | null
          fingerprint_hash: string | null
          id: string
          ip_address: unknown
          pow_difficulty: number | null
          pow_solution: string | null
          risk_score: number | null
          session_id: string
          token: string | null
          used_at: string | null
          user_agent: string | null
          verdict: string
        }
        Insert: {
          behavior_data?: Json | null
          challenges_passed?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          fingerprint_hash?: string | null
          id?: string
          ip_address?: unknown
          pow_difficulty?: number | null
          pow_solution?: string | null
          risk_score?: number | null
          session_id: string
          token?: string | null
          used_at?: string | null
          user_agent?: string | null
          verdict: string
        }
        Update: {
          behavior_data?: Json | null
          challenges_passed?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          fingerprint_hash?: string | null
          id?: string
          ip_address?: unknown
          pow_difficulty?: number | null
          pow_solution?: string | null
          risk_score?: number | null
          session_id?: string
          token?: string | null
          used_at?: string | null
          user_agent?: string | null
          verdict?: string
        }
        Relationships: []
      }
    }
    Views: {
      communities_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          member_count: number | null
          name: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          member_count?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          member_count?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_reviews: {
        Row: {
          comment: string | null
          course_id: string | null
          created_at: string | null
          id: string | null
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: never
        }
        Update: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: never
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
      safe_lessons: {
        Row: {
          course_id: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          description_ru: string | null
          description_tr: string | null
          duration_minutes: number | null
          id: string | null
          is_free: boolean | null
          order_index: number | null
          title_ar: string | null
          title_en: string | null
          title_ru: string | null
          title_tr: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_free?: boolean | null
          order_index?: number | null
          title_ar?: string | null
          title_en?: string | null
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
          video_url?: never
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_tr?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_free?: boolean | null
          order_index?: number | null
          title_ar?: string | null
          title_en?: string | null
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
          video_url?: never
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
      safe_quizzes: {
        Row: {
          created_at: string | null
          id: string | null
          lesson_id: string | null
          passing_score: number | null
          questions: Json | null
          title_ar: string | null
          title_en: string | null
          title_ru: string | null
          title_tr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          lesson_id?: string | null
          passing_score?: number | null
          questions?: never
          title_ar?: string | null
          title_en?: string | null
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          lesson_id?: string | null
          passing_score?: number | null
          questions?: never
          title_ar?: string | null
          title_en?: string | null
          title_ru?: string | null
          title_tr?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "safe_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members_public: {
        Row: {
          bio_ar: string | null
          bio_en: string | null
          bio_ru: string | null
          bio_tr: string | null
          created_at: string | null
          department: string | null
          display_order: number | null
          full_name: string | null
          id: string | null
          image_url: string | null
          instagram_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          linkedin_url: string | null
          role_title: string | null
          telegram_url: string | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          linkedin_url?: string | null
          role_title?: string | null
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          bio_ar?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          bio_tr?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          linkedin_url?: string | null
          role_title?: string | null
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_admin_sessions: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_security_events: { Args: never; Returns: undefined }
      cleanup_old_utaab_records: { Args: never; Returns: undefined }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      provision_root_admin: { Args: never; Returns: undefined }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      verify_certificate_by_hash: {
        Args: { _serial_hash: string }
        Returns: {
          blockchain_tx_hash: string
          certificate_title: string
          chain_id: number
          contract_address: string
          event_date: string
          event_name: string
          issued_at: string
          issued_by: string
          location: string
          organizer: string
          participant_name: string
          partners: string[]
          pdf_url: string
          revocation_reason: string
          revoked_at: string
          serial_number: string
          speaker_name: string
          status: string
        }[]
      }
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
