import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';   


@Injectable()
export class UsersService {
    constructor( @InjectRepository(User) private usersRepository: Repository<User>) {}
    // create a new user
    create(email:string, password:string){
       const user = this.usersRepository.create({email, password});
       return this.usersRepository.save(user);
    }
    async find(){
        return []
    }

    //find one by id
    findOne(id:number){
        if(!id)return null;
        return this.usersRepository.findOneBy({id});
    }

    //find by email
    async findByEmail(email:string){
        const user = await this.usersRepository.findOneBy({email});
        if(!user)throw new NotFoundException();
        return user;
    }
    
   async update(id:number, attrs:Partial<User>){
    //using ineffecient way to update the user to make sure that the afterUpdate hook is called
        const user = await this.findOne(id);
        if(!user)throw new NotFoundException();
        Object.assign(user, attrs);
        return this.usersRepository.save(user);
    }
   async remove(id:number){
    // using inefficien way to remove the user to make sure that the afterRemove hook is called
    const user = await this.findOne(id);
    if(!user)throw new NotFoundException();
    return this.usersRepository.remove(user);
   } 

}


// function (){
//     var dataLayer = window.dataLayer || [];
//    return dataLayer.reverse().find(function(item){
//         if(!item.event.includes('gtm')){
//             return true;
//         }
//     })
// }