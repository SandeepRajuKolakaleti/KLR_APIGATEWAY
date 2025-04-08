import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("usertoken")
export class UserTokenEntity {

    @PrimaryColumn({ 
        name: 'phoneNo',
        default: 0
    })
    phoneNo!: number;

    @Column()
    localtoken!: string;

    @PrimaryColumn({ 
        name: 'email',
        default: 'raja@test.com'
    })
    email!: string;

    @Column()
    apitoken!: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}