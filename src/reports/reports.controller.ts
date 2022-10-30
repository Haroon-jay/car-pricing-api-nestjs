import { Controller, Post, Body, Patch, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UseGuards, Param } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}


  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.getEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.createReport(body, user);
  }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    @Serialize(ReportDTO)
    approveReport(@Param('id') id: number, @Body() body:ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }

    
    
}
