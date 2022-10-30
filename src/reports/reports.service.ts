import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';

import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo:Repository<Report> ){

    }


    async getEstimate({make, mileage, model, lat, lng, year}:GetEstimateDto){
       return this.repo.createQueryBuilder().select('AVG(price)', 'price').where('make = :make', {make})
       .andWhere('model = :model', {model})
       .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
       .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
       .andWhere('year - :year BETWEEN -3 AND 3', {year})
       .andWhere('approved = true')
       .orderBy('ABS(mileage - :mileage)', 'DESC')
       .setParameters({mileage})
       .limit(3)
       .getRawOne();
    }
   async changeApproval(id:number, approved:boolean) {
        const report = await this.repo.findOne({
            where: {
                id
            },
            relations: ['user']
        })
    

        if(!report) {
            throw new NotFoundException('Could not find report');
        }
        report.approved = approved;
        return this.repo.save(report);
    }


    createReport(report:CreateReportDto, user:User) {
        const newReport = this.repo.create(report);
        newReport.user = user;
        return this.repo.save(newReport);
    }
}



