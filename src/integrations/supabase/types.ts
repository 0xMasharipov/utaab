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
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student"
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
      app_role: ["admin", "instructor", "student"],
      course_language: ["en", "tr", "ru", "ar"],
      course_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
