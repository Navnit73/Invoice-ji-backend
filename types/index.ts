export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    business_name: string;
    plan: 'free' | 'premium';
    template_id: string | null;
    is_premium: boolean;
    subscription?: {
      plan_name: string;
      start_date: Date;
      end_date: Date;
      active: boolean;
    };
    created_at: Date;
    last_login: Date;
  }
  
  export interface AuthResponse {
    status: string;
    message: string;
    user?: {
      id: string;
      name: string;
      email: string;
      business_name: string;
      plan: 'free' | 'premium';
      template_id: string | null;
      is_premium: boolean;
      created_at: string;
    };
    auth?: {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
  }
  
  export interface ApiResponse<T = any> {
    status: string;
    message: string;
    data?: T;
  }