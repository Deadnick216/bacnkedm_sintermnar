import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed() {  
    try {
      await this.deleteTables();
      const adminUser = await this.insertUsers();
      await this.insertNewProducts(adminUser);
      return 'Seed executed';
    } catch (error) {
      console.error('Error running seed:', error);
      throw new InternalServerErrorException('Error running seed');
    }
  }

  private async deleteTables() {
    // Elimina todos los productos primero
    await this.productsService.deleteAllProducts();
  
    // Luego elimina todos los usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    
    const users: User[] = seedUsers.map(user => this.userRepository.create(user));
    await this.userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User) {
    try {
      await this.productsService.deleteAllProducts();
  
      const products = initialData.products;
      const insertPromises = products.map(product => this.productsService.create(product, user));
  
      await Promise.all(insertPromises);
      return true;
    } catch (error) {
      console.error('Error inserting new products:', error);
      throw new InternalServerErrorException('Error inserting new products');
    }
  }
}