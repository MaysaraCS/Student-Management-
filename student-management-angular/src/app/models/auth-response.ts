import { Role } from "./roles.enum";

export interface AuthResponse {
    token: string;
    username: string;
    role: Role;
    message?: string;
}