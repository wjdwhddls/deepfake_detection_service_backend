import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Dashboard } from './entities/dashboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateDashboardRequestDto } from './dto/create-dashboard-request.dto';
import { UpdateDashboardRequestDto } from './dto/update-dashboard-request.dto';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectRepository(Dashboard)
        private dashboardRepository: Repository<Dashboard>
    ) { }

    // CREATE
    async createDashboard(createDashboardRequestDto: CreateDashboardRequestDto, loggedInUser: User): Promise<void> {
        this.logger.verbose(`User: ${loggedInUser.username} is creating a new dashboard with title: ${createDashboardRequestDto.title}`);

        const { title, contents } = createDashboardRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('Title and text must be provided');
        }

        const newDashboard = this.dashboardRepository.create({
            USER_ID: loggedInUser.id,
            TITLE: title,
            TEXT: contents,
            user: loggedInUser
        });

        await this.dashboardRepository.save(newDashboard);

        this.logger.verbose(`Dashboard with title ${newDashboard.TITLE} created successfully`);
    }

    // READ - all
    async getAllDashboard(): Promise<Dashboard[]> {
        this.logger.verbose(`Retrieving all dashboards`);

        const foundDashboards = await this.dashboardRepository.find();

        this.logger.verbose(`Retrieved all dashboards successfully`);
        return foundDashboards;
    }

    // READ - by logged-in user
    async getMyAllDashboard(loggedInUser: User): Promise<Dashboard[]> {
        this.logger.verbose(`Retrieving ${loggedInUser.username}'s all dashboards`);

        const foundDashboards = await this.dashboardRepository.createQueryBuilder('dashboard')
            .leftJoinAndSelect('dashboard.user', 'user')
            .where('dashboard.USER_ID = :userId', { userId: loggedInUser.id })
            .getMany();

        this.logger.verbose(`Retrieved ${loggedInUser.username}'s all dashboards successfully`);
        return foundDashboards;
    }

    // READ - by id
    async getDashboardDetailById(id: number): Promise<Dashboard> {
        this.logger.verbose(`Retrieving a dashboard by id: ${id}`);

        const foundDashboard = await this.dashboardRepository.createQueryBuilder('dashboard')
            .leftJoinAndSelect('dashboard.user', 'user')
            .where('dashboard.POST_ID = :id', { id })
            .getOne();

        if (!foundDashboard) {
            throw new NotFoundException(`Dashboard with ID ${id} not found`);
        }

        this.logger.verbose(`Retrieved dashboard by id ${id} successfully`);
        return foundDashboard;
    }

    // READ - by keyword (title)
    async getDashboardByKeyword(title: string): Promise<Dashboard[]> {
        this.logger.verbose(`Retrieving dashboards by title: ${title}`);

        if (!title) {
            throw new BadRequestException('Title keyword must be provided');
        }

        const foundDashboards = await this.dashboardRepository.findBy({ TITLE: title });
        if (foundDashboards.length === 0) {
            throw new NotFoundException(`No dashboards found for title: ${title}`);
        }

        this.logger.verbose(`Retrieved dashboards by title ${title} successfully`);
        return foundDashboards;
    }

    // UPDATE - by id
    async updateDashboardById(id: number, updateDashboardRequestDto: UpdateDashboardRequestDto): Promise<void> {
        this.logger.verbose(`Updating a dashboard by id: ${id}`);

        const foundDashboard = await this.getDashboardDetailById(id);
        const { title, contents } = updateDashboardRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('Title and text must be provided');
        }

        foundDashboard.TITLE = title;
        foundDashboard.TEXT = contents;
        await this.dashboardRepository.save(foundDashboard);

        this.logger.verbose(`Updated dashboard by id ${id} successfully`);
    }

    // DELETE - by id
    async deleteDashboardById(id: number, loggedInUser: User): Promise<void> {
        this.logger.verbose(`User: ${loggedInUser.username} is deleting a dashboard by id: ${id}`);

        const foundDashboard = await this.getDashboardDetailById(id);

        if (foundDashboard.user.id !== loggedInUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this dashboard');
        }

        await this.dashboardRepository.delete(foundDashboard);

        this.logger.verbose(`Deleted dashboard by id ${id} successfully`);
    }
}
