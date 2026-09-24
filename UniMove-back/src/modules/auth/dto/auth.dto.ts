import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty() @IsString() @MinLength(3) fullName!: string;
  @ApiProperty({ example: '00000000000' }) @IsString() @Length(11, 14) cpf!: string;
  @ApiProperty({ example: 'aluno@ucb.edu.br' }) @IsEmail() institutionalEmail!: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) password!: string;
}
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}
export class RefreshDto {
  @IsString() refreshToken!: string;
}
