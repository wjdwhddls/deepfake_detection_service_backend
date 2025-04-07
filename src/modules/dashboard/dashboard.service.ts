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
            throw new BadRequestException('제목과 내용을 반드시 제공해야 합니다.');
        }

        const newDashboard = this.dashboardRepository.create({
            TITLE: title,
            TEXT: contents,
            user: loggedInUser // USER_ID를 user로 대체
        });

        await this.dashboardRepository.save(newDashboard);

        this.logger.verbose(`제목이 ${newDashboard.TITLE}인 대시보드가 성공적으로 생성되었습니다.`);
    }

    // READ - all
    async getAllDashboard(): Promise<Dashboard[]> {
        this.logger.verbose(`모든 대시보드를 검색 중입니다.`);

        const foundDashboards = await this.dashboardRepository.find({ relations: ['user'] }); // user 관계를 포함하여 조회

        this.logger.verbose(`모든 대시보드를 성공적으로 검색하였습니다.`);
        return foundDashboards;
    }

    // READ - by logged-in user
    async getMyAllDashboard(loggedInUser: User): Promise<Dashboard[]> {
        this.logger.verbose(`사용자 ${loggedInUser.username}의 모든 대시보드를 검색 중입니다.`);

        const foundDashboards = await this.dashboardRepository.createQueryBuilder('dashboard')
            .leftJoinAndSelect('dashboard.user', 'user')
            .where('dashboard.user.id = :userId', { userId: loggedInUser.id }) // USER_ID 대신 user.id 사용
            .getMany();

        this.logger.verbose(`사용자 ${loggedInUser.username}의 모든 대시보드를 성공적으로 검색하였습니다.`);
        return foundDashboards;
    }

    // READ - by id
    async getDashboardDetailById(id: number): Promise<Dashboard> {
        this.logger.verbose(`ID로 대시보드 검색 중: ${id}`);

        const foundDashboard = await this.dashboardRepository.createQueryBuilder('dashboard')
            .leftJoinAndSelect('dashboard.user', 'user')
            .where('dashboard.id = :id', { id })
            .getOne();

        if (!foundDashboard) {
            throw new NotFoundException(`ID가 ${id}인 대시보드를 찾을 수 없습니다.`);
        }

        this.logger.verbose(`ID ${id}의 대시보드를 성공적으로 검색하였습니다.`);
        return foundDashboard;
    }

    // READ - by keyword (title)
    async getDashboardByKeyword(title: string): Promise<Dashboard[]> {
        this.logger.verbose(`제목으로 대시보드 검색 중: ${title}`);

        if (!title) {
            throw new BadRequestException('제목 키워드는 반드시 제공해야 합니다.');
        }

        const foundDashboards = await this.dashboardRepository.find({
            where: { TITLE: title },
            relations: ['user'], // user 관계를 추가하여 포함
        });

        if (foundDashboards.length === 0) {
            throw new NotFoundException(`제목으로 찾은 대시보드가 없습니다: ${title}`);
        }

        this.logger.verbose(`제목 ${title}으로 대시보드를 성공적으로 검색하였습니다.`);
        return foundDashboards;
    }

    // UPDATE - by id
    async updateDashboardById(id: number, updateDashboardRequestDto: UpdateDashboardRequestDto): Promise<void> {
        this.logger.verbose(`ID로 대시보드 업데이트 중: ${id}`);

        const foundDashboard = await this.getDashboardDetailById(id);
        const { title, contents } = updateDashboardRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('제목과 내용을 반드시 제공해야 합니다.');
        }

        foundDashboard.TITLE = title;
        foundDashboard.TEXT = contents;
        await this.dashboardRepository.save(foundDashboard);

        this.logger.verbose(`ID ${id}의 대시보드를 성공적으로 업데이트하였습니다.`);
    }

    // DELETE - by id
    async deleteDashboardById(id: number, loggedInUser: User): Promise<void> {
        this.logger.verbose(`사용자: ${loggedInUser.username}가 ID로 대시보드 삭제 중: ${id}`);

        const foundDashboard = await this.getDashboardDetailById(id);

        if (foundDashboard.user.id !== loggedInUser.id) {
            throw new UnauthorizedException('이 대시보드를 삭제할 권한이 없습니다.');
        }

        await this.dashboardRepository.delete(foundDashboard);

        this.logger.verbose(`ID ${id}의 대시보드를 성공적으로 삭제하였습니다.`);
    }
}
