export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
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
