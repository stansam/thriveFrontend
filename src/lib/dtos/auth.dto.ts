export interface UserDTO {
  email: string;
  name: string;
  is_admin: boolean;
}

export interface LoginRequestDTO {
  email: string;
  password?: string;
}

export interface RegisterRequestDTO {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    confirm_password: string;
}
