import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createUserDto;

      const user = this.userRepository.create({
        ...userDate,
        password: await bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {...user, token: this.getJwtToken( {id: user.id} )};
      //console.log('User created');
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
      throw new InternalServerErrorException('Error creating user');
    }
  }


  async login(loginUserDto: LoginUserDto) {
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({where: {email}, select:{password: true, email: true, id: true}});
    if (!user) {
      throw new UnauthorizedException('Invalid credentials(correo)');
    } 

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }  
    console.log("hiaaa")

    return { ...user, token: this.getJwtToken( {id: user.id} )};

  }

  async checkAuthStatus(user: User){
    return { ...user, token: this.getJwtToken( {id: user.id} )};
  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
    console.log(error);
    
    throw new InternalServerErrorException('Error creating user');
  }
     

}
