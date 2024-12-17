import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'products_images'})
export class ProductImage{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text') 
    url: string;
    
    @ManyToOne( //muchas iamgenes le pertenen a un producto
        () => Product, (product) => product.images,
        {onDelete: 'CASCADE'} //si se elimina un producto se eliminan todas las imagenes
    )    
    product: Product
}