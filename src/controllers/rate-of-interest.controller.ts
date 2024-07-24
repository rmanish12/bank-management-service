import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { User } from 'src/decorators/user.decorator';
import { createRoIDto } from 'src/dtos/request/create-roi.dto';
import { PermissionGaurd } from 'src/gaurds/permission.gaurd';
import { RateOfInterestService } from 'src/services/rate-of-interest.service';
import { PERMISSIONS } from 'src/utils/permissions.enum';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@Controller('rate-of-interest')
@ApiTags('ROI Controller')
@UseGuards(PermissionGaurd)
export class RoIController {
  constructor(private readonly roiService: RateOfInterestService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.MANAGE_PERMISSION)
  async createRoI(@User() user, @Body() createRoIDto: createRoIDto) {
    await this.roiService.createRoI(user, createRoIDto);

    return getSuccessResponse('Rate of interest created successfully');
  }
}
