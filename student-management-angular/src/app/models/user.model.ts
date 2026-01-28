import { Role } from "./roles.enum";

export interface User {
    username: string;
    role: Role;
    token?: string;
}