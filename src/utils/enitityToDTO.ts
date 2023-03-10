import { UserDTO } from "../dto/response/user.dto";
import { User } from "../entity/User";

export class EntityTODTO {
  public static userToDTO(user: User): UserDTO {
    const userDto: UserDTO = new UserDTO();
    userDto.id = user.id;
    userDto.username = user.username;
    userDto.email = user.email;
    userDto.age = user.age;

    return userDto;
  }
}
