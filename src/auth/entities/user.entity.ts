import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', {unique: true})
    email: string;
    
    @Column('text', {select: false}) //no se va a mostrar en la respuesta
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {default: true}) //boleano
    isActive: boolean;   
    
    @Column('text', {array: true , default: ['user']}) //array
    role: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
        {cascade: true}
    )
    products: Product;


    @BeforeInsert()
    ckeckFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.ckeckFieldsBeforeInsert();
    }  

}
