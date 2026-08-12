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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          avg_delivery: string
          category: string
          constitution_score: number
          created_at: string
          id: string
          jobs_completed: number
          name: string
          owner_id: string
          purpose: string
          rate_cents: number
          rating: number
          rep_accuracy: number
          rep_quality: number
          rep_reliability: number
          rep_speed: number
          rep_trust: number
          revenue_cents: number
          role_title: string
          skills: string[]
          slug: string
          status: Database["public"]["Enums"]["agent_status"]
          updated_at: string
        }
        Insert: {
          avg_delivery?: string
          category?: string
          constitution_score?: number
          created_at?: string
          id?: string
          jobs_completed?: number
          name: string
          owner_id: string
          purpose?: string
          rate_cents?: number
          rating?: number
          rep_accuracy?: number
          rep_quality?: number
          rep_reliability?: number
          rep_speed?: number
          rep_trust?: number
          revenue_cents?: number
          role_title?: string
          skills?: string[]
          slug: string
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Update: {
          avg_delivery?: string
          category?: string
          constitution_score?: number
          created_at?: string
          id?: string
          jobs_completed?: number
          name?: string
          owner_id?: string
          purpose?: string
          rate_cents?: number
          rating?: number
          rep_accuracy?: number
          rep_quality?: number
          rep_reliability?: number
          rep_speed?: number
          rep_trust?: number
          revenue_cents?: number
          role_title?: string
          skills?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Relationships: []
      }
      governance_events: {
        Row: {
          agent_id: string
          article: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["governance_kind"]
          note: string
          recorded_by: string | null
          score_delta: number
          severity: number
        }
        Insert: {
          agent_id: string
          article?: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["governance_kind"]
          note?: string
          recorded_by?: string | null
          score_delta?: number
          severity?: number
        }
        Update: {
          agent_id?: string
          article?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["governance_kind"]
          note?: string
          recorded_by?: string | null
          score_delta?: number
          severity?: number
        }
        Relationships: [
          {
            foreignKeyName: "governance_events_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          amount_cents: number
          approved_at: string | null
          created_at: string
          id: string
          position: number
          status: Database["public"]["Enums"]["milestone_status"]
          task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          approved_at?: string | null
          created_at?: string
          id?: string
          position?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          approved_at?: string | null
          created_at?: string
          id?: string
          position?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reputation_events: {
        Row: {
          agent_id: string
          created_at: string
          delta_accuracy: number
          delta_quality: number
          delta_reliability: number
          delta_speed: number
          delta_trust: number
          id: string
          milestone_id: string | null
          note: string
          rated_accuracy: number | null
          rated_quality: number | null
          rated_reliability: number | null
          rated_speed: number | null
          rated_trust: number | null
          task_id: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          delta_accuracy?: number
          delta_quality?: number
          delta_reliability?: number
          delta_speed?: number
          delta_trust?: number
          id?: string
          milestone_id?: string | null
          note?: string
          rated_accuracy?: number | null
          rated_quality?: number | null
          rated_reliability?: number | null
          rated_speed?: number | null
          rated_trust?: number | null
          task_id?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          delta_accuracy?: number
          delta_quality?: number
          delta_reliability?: number
          delta_speed?: number
          delta_trust?: number
          id?: string
          milestone_id?: string | null
          note?: string
          rated_accuracy?: number | null
          rated_quality?: number | null
          rated_reliability?: number | null
          rated_speed?: number | null
          rated_trust?: number | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_events_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_events_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          agent_id: string
          brief: string
          category: string
          created_at: string
          escrow: Database["public"]["Enums"]["escrow_status"]
          hirer_id: string
          id: string
          payment_ref: string | null
          released_cents: number
          status: Database["public"]["Enums"]["task_status"]
          title: string
          total_cents: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          brief?: string
          category?: string
          created_at?: string
          escrow?: Database["public"]["Enums"]["escrow_status"]
          hirer_id: string
          id?: string
          payment_ref?: string | null
          released_cents?: number
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          total_cents?: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          brief?: string
          category?: string
          created_at?: string
          escrow?: Database["public"]["Enums"]["escrow_status"]
          hirer_id?: string
          id?: string
          payment_ref?: string | null
          released_cents?: number
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
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
      approve_milestone: {
        Args: {
          p_accuracy?: number
          p_milestone_id: string
          p_note?: string
          p_quality?: number
          p_reliability?: number
          p_speed?: number
          p_trust?: number
        }
        Returns: {
          amount_cents: number
          approved_at: string | null
          created_at: string
          id: string
          position: number
          status: Database["public"]["Enums"]["milestone_status"]
          task_id: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "milestones"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      fund_escrow: {
        Args: { p_payment_ref?: string; p_task_id: string }
        Returns: {
          agent_id: string
          brief: string
          category: string
          created_at: string
          escrow: Database["public"]["Enums"]["escrow_status"]
          hirer_id: string
          id: string
          payment_ref: string | null
          released_cents: number
          status: Database["public"]["Enums"]["task_status"]
          title: string
          total_cents: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "tasks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_status: "active" | "warned" | "suspended" | "revoked"
      app_role: "admin" | "moderator" | "user"
      escrow_status: "unfunded" | "locked" | "released" | "refunded"
      governance_kind:
        | "violation"
        | "warning"
        | "suspension"
        | "clearance"
        | "note"
      milestone_status: "pending" | "submitted" | "approved" | "rejected"
      task_status: "draft" | "open" | "in_progress" | "completed" | "cancelled"
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
      agent_status: ["active", "warned", "suspended", "revoked"],
      app_role: ["admin", "moderator", "user"],
      escrow_status: ["unfunded", "locked", "released", "refunded"],
      governance_kind: [
        "violation",
        "warning",
        "suspension",
        "clearance",
        "note",
      ],
      milestone_status: ["pending", "submitted", "approved", "rejected"],
      task_status: ["draft", "open", "in_progress", "completed", "cancelled"],
    },
  },
} as const
