import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@guards/auth.guards';
import { CurrentUser } from '@users/decorators/current-user.decorator';
import { User } from '@users/user.entity';
import { Serialize } from '@interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(
    @Body() requestBody: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.create(requestBody, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
