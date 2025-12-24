// wishlist.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('wishlist_items')
@Index(['userId', 'productId'], { unique: true })
export class WishlistEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    productId!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
