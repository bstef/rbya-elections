// Generated via Supabase MCP `generate_typescript_types` against the live
// rbya-elections project schema. Regenerate after any migration change --
// do not hand-edit.

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
      admins: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ballot_selections: {
        Row: {
          ballot_id: string
          candidate_id: string
          id: string
        }
        Insert: {
          ballot_id: string
          candidate_id: string
          id?: string
        }
        Update: {
          ballot_id?: string
          candidate_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ballot_selections_ballot_id_fkey"
            columns: ["ballot_id"]
            isOneToOne: false
            referencedRelation: "ballots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballot_selections_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      ballots: {
        Row: {
          delegate_id: string
          election_id: string
          id: string
          position: Database["public"]["Enums"]["position_enum"]
          submitted_at: string
        }
        Insert: {
          delegate_id: string
          election_id: string
          id?: string
          position: Database["public"]["Enums"]["position_enum"]
          submitted_at?: string
        }
        Update: {
          delegate_id?: string
          election_id?: string
          id?: string
          position?: Database["public"]["Enums"]["position_enum"]
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ballots_delegate_id_fkey"
            columns: ["delegate_id"]
            isOneToOne: false
            referencedRelation: "delegates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballots_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          accepted: boolean | null
          background: string
          church: string
          confirm_token: string
          confirmed_at: string | null
          created_at: string
          election_id: string
          email: string
          id: string
          ignored: boolean
          image_url: string | null
          location: string
          name: string
          pastor_approval_token: string
          pastor_approved: boolean | null
          pastor_contact: string | null
          pastor_requested_at: string | null
          pastor_responded_at: string | null
          position: Database["public"]["Enums"]["position_enum"]
          ready: boolean
          reasons: string
          submitter_email: string
          submitter_name: string
        }
        Insert: {
          accepted?: boolean | null
          background: string
          church: string
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          election_id: string
          email: string
          id?: string
          ignored?: boolean
          image_url?: string | null
          location: string
          name: string
          pastor_approval_token?: string
          pastor_approved?: boolean | null
          pastor_contact?: string | null
          pastor_requested_at?: string | null
          pastor_responded_at?: string | null
          position: Database["public"]["Enums"]["position_enum"]
          ready?: boolean
          reasons: string
          submitter_email: string
          submitter_name: string
        }
        Update: {
          accepted?: boolean | null
          background?: string
          church?: string
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          election_id?: string
          email?: string
          id?: string
          ignored?: boolean
          image_url?: string | null
          location?: string
          name?: string
          pastor_approval_token?: string
          pastor_approved?: boolean | null
          pastor_contact?: string | null
          pastor_requested_at?: string | null
          pastor_responded_at?: string | null
          position?: Database["public"]["Enums"]["position_enum"]
          ready?: boolean
          reasons?: string
          submitter_email?: string
          submitter_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      church_youth_counts: {
        Row: {
          church_id: string
          election_id: string
          youth_count: number
        }
        Insert: {
          church_id: string
          election_id: string
          youth_count: number
        }
        Update: {
          church_id?: string
          election_id?: string
          youth_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "church_youth_counts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_youth_counts_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          city_state: string | null
          created_at: string
          id: string
          name: string
          pastor_name: string | null
          youth_leader_name: string | null
        }
        Insert: {
          city_state?: string | null
          created_at?: string
          id?: string
          name: string
          pastor_name?: string | null
          youth_leader_name?: string | null
        }
        Update: {
          city_state?: string | null
          created_at?: string
          id?: string
          name?: string
          pastor_name?: string | null
          youth_leader_name?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          candidate_id: string
          content: string
          created_at: string
          id: string
          submitter_email: string
          submitter_name: string
          type: Database["public"]["Enums"]["comment_type"]
        }
        Insert: {
          candidate_id: string
          content: string
          created_at?: string
          id?: string
          submitter_email: string
          submitter_name: string
          type?: Database["public"]["Enums"]["comment_type"]
        }
        Update: {
          candidate_id?: string
          content?: string
          created_at?: string
          id?: string
          submitter_email?: string
          submitter_name?: string
          type?: Database["public"]["Enums"]["comment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "comments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      delegates: {
        Row: {
          auth_user_id: string | null
          church_id: string
          created_at: string
          delegate_type: Database["public"]["Enums"]["delegate_type"]
          election_id: string
          email: string
          id: string
          name: string
          registered_by_email: string | null
          registered_by_name: string | null
          verified: boolean
        }
        Insert: {
          auth_user_id?: string | null
          church_id: string
          created_at?: string
          delegate_type?: Database["public"]["Enums"]["delegate_type"]
          election_id: string
          email: string
          id?: string
          name: string
          registered_by_email?: string | null
          registered_by_name?: string | null
          verified?: boolean
        }
        Update: {
          auth_user_id?: string | null
          church_id?: string
          created_at?: string
          delegate_type?: Database["public"]["Enums"]["delegate_type"]
          election_id?: string
          email?: string
          id?: string
          name?: string
          registered_by_email?: string | null
          registered_by_name?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "delegates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delegates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_positions: {
        Row: {
          election_id: string
          position: Database["public"]["Enums"]["position_enum"]
          seats: number
        }
        Insert: {
          election_id: string
          position: Database["public"]["Enums"]["position_enum"]
          seats?: number
        }
        Update: {
          election_id?: string
          position?: Database["public"]["Enums"]["position_enum"]
          seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "election_positions_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          absentee_ballot_deadline: string
          confirmation_cutoff_at: string
          created_at: string
          election_day: string
          id: string
          is_current: boolean
          nomination_cutoff_at: string
          nomination_opens_at: string
          results_published: boolean
          status: Database["public"]["Enums"]["election_status"]
          voting_closes_at: string
          voting_opens_at: string
          year: number
        }
        Insert: {
          absentee_ballot_deadline: string
          confirmation_cutoff_at: string
          created_at?: string
          election_day: string
          id?: string
          is_current?: boolean
          nomination_cutoff_at: string
          nomination_opens_at: string
          results_published?: boolean
          status?: Database["public"]["Enums"]["election_status"]
          voting_closes_at: string
          voting_opens_at: string
          year: number
        }
        Update: {
          absentee_ballot_deadline?: string
          confirmation_cutoff_at?: string
          created_at?: string
          election_day?: string
          id?: string
          is_current?: boolean
          nomination_cutoff_at?: string
          nomination_opens_at?: string
          results_published?: boolean
          status?: Database["public"]["Enums"]["election_status"]
          voting_closes_at?: string
          voting_opens_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      candidate_state: {
        Args: { c: Database["public"]["Tables"]["candidates"]["Row"] }
        Returns: string
      }
      compute_position_results: {
        Args: {
          p_election_id: string
          p_position: Database["public"]["Enums"]["position_enum"]
        }
        Returns: {
          candidate_id: string
          candidate_name: string
          elected: boolean
          rank_by_votes: number
          seats: number
          total_ballots: number
          vote_count: number
          vote_share: number
        }[]
      }
      confirm_candidate: {
        Args: { p_accept: boolean; p_pastor_contact?: string; p_token: string }
        Returns: Database["public"]["Tables"]["candidates"]["Row"]
      }
      current_election: {
        Args: never
        Returns: Database["public"]["Tables"]["elections"]["Row"]
      }
      current_election_id: { Args: never; Returns: string }
      get_candidate_by_token: {
        Args: { p_token: string }
        Returns: {
          accepted: boolean
          church: string
          confirmed_at: string
          image_url: string
          location: string
          name: string
          position: Database["public"]["Enums"]["position_enum"]
          submitter_name: string
        }[]
      }
      get_candidate_status: {
        Args: { p_token: string }
        Returns: {
          accepted: boolean
          church: string
          confirmed_at: string
          ignored: boolean
          image_url: string
          location: string
          name: string
          pastor_approved: boolean
          pastor_requested_at: string
          pastor_responded_at: string
          position: Database["public"]["Enums"]["position_enum"]
          positive_comment_count: number
          ready: boolean
        }[]
      }
      get_pastor_vetting_candidate: {
        Args: { p_token: string }
        Returns: {
          church: string
          location: string
          name: string
          pastor_approved: boolean
          pastor_responded_at: string
          position: Database["public"]["Enums"]["position_enum"]
          submitter_name: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_verified_delegate: { Args: { p_email: string }; Returns: boolean }
      register_delegates: {
        Args: {
          p_church_name: string
          p_city_state: string
          p_delegates: Json
          p_pastor_name: string
          p_registered_by_email: string
          p_registered_by_name: string
          p_youth_leader_name: string
        }
        Returns: Database["public"]["Tables"]["delegates"]["Row"][]
      }
      request_pastor_vetting: {
        Args: { p_candidate_id: string }
        Returns: Database["public"]["Tables"]["candidates"]["Row"]
      }
      respond_pastor_vetting: {
        Args: { p_approved: boolean; p_token: string }
        Returns: Database["public"]["Tables"]["candidates"]["Row"]
      }
      set_candidate_photo: {
        Args: { p_image_url: string; p_token: string }
        Returns: Database["public"]["Tables"]["candidates"]["Row"]
      }
      set_current_election: {
        Args: { p_election_id: string }
        Returns: Database["public"]["Tables"]["elections"]["Row"]
      }
      submit_ballot: {
        Args: {
          p_candidate_ids: string[]
          p_position: Database["public"]["Enums"]["position_enum"]
        }
        Returns: Database["public"]["Tables"]["ballots"]["Row"]
      }
      submit_comment: {
        Args: {
          p_candidate_id: string
          p_content: string
          p_submitter_email: string
          p_submitter_name: string
          p_type: Database["public"]["Enums"]["comment_type"]
        }
        Returns: Database["public"]["Tables"]["comments"]["Row"]
      }
      submit_nomination: {
        Args: {
          p_background: string
          p_church: string
          p_email: string
          p_image_url?: string
          p_location: string
          p_name: string
          p_pastor_contact?: string
          p_position: Database["public"]["Enums"]["position_enum"]
          p_reasons: string
          p_submitter_email: string
          p_submitter_name: string
        }
        Returns: Database["public"]["Tables"]["candidates"]["Row"]
      }
    }
    Enums: {
      comment_type: "positive" | "negative"
      delegate_type: "present" | "absentee"
      election_status:
        | "draft"
        | "nominations_open"
        | "nominations_closed"
        | "voting_open"
        | "voting_closed"
        | "completed"
      position_enum:
        | "president"
        | "vice_president_east"
        | "vice_president_west"
        | "treasurer"
        | "controller"
        | "committee"
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
      comment_type: ["positive", "negative"],
      delegate_type: ["present", "absentee"],
      election_status: [
        "draft",
        "nominations_open",
        "nominations_closed",
        "voting_open",
        "voting_closed",
        "completed",
      ],
      position_enum: [
        "president",
        "vice_president_east",
        "vice_president_west",
        "treasurer",
        "controller",
        "committee",
      ],
    },
  },
} as const
