import exp from "constants";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

@Entity()   
export class FormFileds {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

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

@Entity()
export class Gender {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    genderName: string;

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

@Entity()
export class GenderMapping {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FormFileds, (FormFileds) => FormFileds.id)
    @JoinColumn({ name: "userId" })
    userId: number;

    @ManyToOne(() => Gender, (gender) =>gender.id)  
    @JoinColumn({ name: "genderId" })
    genderId: number;

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

@Entity()
export class District {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    districtName: string;

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

@Entity()
export class DistrictMapping {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FormFileds, (FormFileds) => FormFileds.id)
    @JoinColumn({ name: "userId" })
    userId: number;

    @ManyToOne(() => District, (district) =>district.id)
    @JoinColumn({ name: "districtId" }) 
    districtId: number;


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