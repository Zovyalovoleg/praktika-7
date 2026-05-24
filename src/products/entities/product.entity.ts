import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ name: "category_id" })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ name: "created_at", default: () => "NOW()" })
  createdAt: Date;

  @Column({ name: "updated_at", default: () => "NOW()" })
  updatedAt: Date;
}
