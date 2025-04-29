export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          category: string
          created_at: string | null
          crop_id: string | null
          date: string
          farm_location_id: string
          id: string
          is_read: boolean | null
          priority: number | null
          recommendation_text: string
        }
        Insert: {
          category: string
          created_at?: string | null
          crop_id?: string | null
          date: string
          farm_location_id: string
          id?: string
          is_read?: boolean | null
          priority?: number | null
          recommendation_text: string
        }
        Update: {
          category?: string
          created_at?: string | null
          crop_id?: string | null
          date?: string
          farm_location_id?: string
          id?: string
          is_read?: boolean | null
          priority?: number | null
          recommendation_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          created_at: string | null
          growing_season: string | null
          id: string
          ideal_rainfall_max: number | null
          ideal_rainfall_min: number | null
          ideal_temp_max: number | null
          ideal_temp_min: number | null
          name: string
          scientific_name: string | null
        }
        Insert: {
          created_at?: string | null
          growing_season?: string | null
          id?: string
          ideal_rainfall_max?: number | null
          ideal_rainfall_min?: number | null
          ideal_temp_max?: number | null
          ideal_temp_min?: number | null
          name: string
          scientific_name?: string | null
        }
        Update: {
          created_at?: string | null
          growing_season?: string | null
          id?: string
          ideal_rainfall_max?: number | null
          ideal_rainfall_min?: number | null
          ideal_temp_max?: number | null
          ideal_temp_min?: number | null
          name?: string
          scientific_name?: string | null
        }
        Relationships: []
      }
      farm_crops: {
        Row: {
          created_at: string | null
          crop_id: string
          expected_harvest_date: string | null
          farm_location_id: string
          id: string
          planting_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id: string
          expected_harvest_date?: string | null
          farm_location_id: string
          id?: string
          planting_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string
          expected_harvest_date?: string | null
          farm_location_id?: string
          id?: string
          planting_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_crops_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_locations: {
        Row: {
          area_hectares: number | null
          created_at: string | null
          elevation_meters: number | null
          id: string
          latitude: number
          location_name: string
          longitude: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_hectares?: number | null
          created_at?: string | null
          elevation_meters?: number | null
          id?: string
          latitude: number
          location_name: string
          longitude: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_hectares?: number | null
          created_at?: string | null
          elevation_meters?: number | null
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "farmer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_profiles: {
        Row: {
          created_at: string | null
          farm_name: string | null
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          farm_name?: string | null
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          farm_name?: string | null
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          end_date: string | null
          farm_location_id: string
          id: string
          is_active: boolean | null
          message: string
          severity: string
          start_date: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          end_date?: string | null
          farm_location_id: string
          id?: string
          is_active?: boolean | null
          message: string
          severity: string
          start_date: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          end_date?: string | null
          farm_location_id?: string
          id?: string
          is_active?: boolean | null
          message?: string
          severity?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weather_alerts_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          created_at: string | null
          data_source: string | null
          date: string
          farm_location_id: string
          humidity_percent: number | null
          id: string
          precipitation_mm: number | null
          soil_moisture_percent: number | null
          temp_high: number | null
          temp_low: number | null
          uv_index: number | null
          wind_speed_kmh: number | null
        }
        Insert: {
          created_at?: string | null
          data_source?: string | null
          date: string
          farm_location_id: string
          humidity_percent?: number | null
          id?: string
          precipitation_mm?: number | null
          soil_moisture_percent?: number | null
          temp_high?: number | null
          temp_low?: number | null
          uv_index?: number | null
          wind_speed_kmh?: number | null
        }
        Update: {
          created_at?: string | null
          data_source?: string | null
          date?: string
          farm_location_id?: string
          humidity_percent?: number | null
          id?: string
          precipitation_mm?: number | null
          soil_moisture_percent?: number | null
          temp_high?: number | null
          temp_low?: number | null
          uv_index?: number | null
          wind_speed_kmh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
