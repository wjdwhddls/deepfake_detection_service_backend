import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Dashboard } from './entities/dashboard.entity';
import { CreateDashboardRequestDto } from './dto/create-dashboard-request.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { SearchDashboardResponseDto } from './dto/search-dashboard-response.dto';
import { UpdateDashboardRequestDto } from './dto/update-dashboard-request.dto';
import { DashboardStatus } from './entities/dashboard-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/custom-guards-decorators/custom-role.guard';
import { UserRole } from 'src/modules/users/entities/user-role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { GetUser } from 'src/modules/auth/custom-guards-decorators/get-user.decorator';
import { Roles } from 'src/modules/auth/custom-guards-decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
@UseGuards(AuthGuard(), RolesGuard)
export class DashboardsController {
    private readonly logger = new Logger(DashboardsController.name);

    constructor(private dashboardService: DashboardService) { }

    // CREATE
    @Post('/')
    async createDashboard(
        @Body() createDashboardRequestDto: CreateDashboardRequestDto,
        @GetUser() logginedUser: User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new article with title: ${createDashboardRequestDto.title}`);

        await this.dashboardService.createDashboard(createDashboardRequestDto, logginedUser)

        this.logger.verbose(`Dashboard created Successfully`);
        return new ApiResponseDto(true, HttpStatus.CREATED, 'Dashboard created Successfully');
    }

    // READ - 전체 게시글 보기
    @Get('/')
    @Roles(UserRole.USER)
    async getAllDashboards(): Promise<ApiResponseDto<DashboardResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving all Dashboards`);

        const dashboard: Dashboard[] = await this.dashboardService.getAllDashboard();
        const dashboardResponseDto = dashboard.map(article => new DashboardResponseDto(article));

        this.logger.verbose(`Retrieved all dashboard list Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Dashboard list retrive Successfully', dashboardResponseDto);
    }

    // READ - 내가 작성한 글 보기
    @Get('/mydashboard')
    async getMyAllDashboards(@GetUser() logginedUser: User): Promise<ApiResponseDto<DashboardResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Dashboards`);

        const dashboard: Dashboard[] = await this.dashboardService.getMyAllDashboard(logginedUser);
        const dashboardResponseDto = dashboard.map(article => new DashboardResponseDto(article));

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Dashboards list Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Dashboard list retrive Successfully', dashboardResponseDto);
    }

    // READ - 특정 게시물 보기
    @Get('/:id/detail')
    async getDashboardDetailById(@Param('id') id: number): Promise<ApiResponseDto<DashboardResponseDto>> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`);

        const articleResponseDto = new DashboardResponseDto(await this.dashboardService.getDashboardDetailById(id));

        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Dashboard retrive Successfully', articleResponseDto);
    }

    // READ - 게시글 검색
    @Get('/search')
    async getDashboardsByKeyword(@Query('keyword') author: string): Promise<ApiResponseDto<SearchDashboardResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`);

        const dashboard: Dashboard[] = await this.dashboardService.getDashboardByKeyword(author);
        const dashboardResponseDto = dashboard.map(article => new SearchDashboardResponseDto(article));

        this.logger.verbose(`Retrieved dashboard list by ${author} Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Dashboard list retrive Successfully', dashboardResponseDto);
    }

    // UPDATE - by id
    @Put('/:id')
    async updateDashboardById(
        @Param('id') id: number,
        @Body() updateDashboardRequestDto: UpdateDashboardRequestDto): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`Try to Updating a article by id: ${id} with updateDashboardRequestDto`);

        await this.dashboardService.updateDashboardById(id, updateDashboardRequestDto)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Dashboard update Successfully');
    }

    // DELETE - by id
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteDashboardById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is trying to Deleting a article by id: ${id}`);

        await this.dashboardService.deleteDashboardById(id, logginedUser);

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Dashboard delete Successfully');
    }
}