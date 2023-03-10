import * as bcrypt from 'bcrypt';

export class PasswordHash{
    /**
     * 
     * @param plainPassword 
     * @returns hashPassword 
     */
    public static async hasPassword(plainPassword: string){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(plainPassword, salt);
        return hashPassword;
    }
}