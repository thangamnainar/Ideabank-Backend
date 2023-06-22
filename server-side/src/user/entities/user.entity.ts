import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SignUp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column({unique:true})
    email: string;

    @Column()  
    password: string;

    @Column({nullable:true})
    verification_code: string;
    
    @Column({default:false})
    isVerified: number;

    @Column({default:false})
    attempt_Count:number

    @Column({nullable:true})
    attempt_Time:string

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable:true})
    createBy: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable:true})
    updateBy: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({nullable:true})
    deleteBy: number;
}
