import { UserDTO } from "./user.dto";

export class AuthDTO {
    token: string;
    refreshToken: string;
    user: UserDTO
}