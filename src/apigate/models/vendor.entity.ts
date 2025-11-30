import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @Column({select: false})
    password!: string;

    @Column({select: false})
    permissionId!: number;

    @Column({select: false})
    phonenumber!: number;

    @Column({select: false})
    image!: string;

    @Column({select: false})
    userRole!: string;

    @Column({select: false})
    birthday!: string;

    @Column({select: false})
    address!: string;

    // ✅ Auto-created timestamp
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    // ✅ Auto-updated timestamp
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

}