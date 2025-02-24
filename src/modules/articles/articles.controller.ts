import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { SearchArticleResponseDto } from './dto/search-article-response.dto';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from 'src/common/pipes/article-status-validation.pipe';
import { ArticleStatus } from './entities/article-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/custom-guards-decorators/custom-role.guard';
import { UserRole } from 'src/modules/users/entities/user-role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { GetUser } from 'src/modules/auth/custom-guards-decorators/get-user.decorator';
import { Roles } from 'src/modules/auth/custom-guards-decorators/roles.decorator';

@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticlesController {
    private readonly logger = new Logger(ArticlesController.name);

    constructor(private articlesService: ArticlesService){}

    // CREATE
    @Post('/')
    async createArticle(
        @Body() createArticleRequestDto: CreateArticleRequestDto,
        @GetUser() logginedUser: User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new article with title: ${createArticleRequestDto.title}`);

        await this.articlesService.createArticle(createArticleRequestDto, logginedUser)

        this.logger.verbose(`Article created Successfully`);
        return new ApiResponseDto(true, HttpStatus.CREATED, 'Article created Successfully');
    }

    // READ - 전체 게시글 보기
    @Get('/')
    @Roles(UserRole.USER)
    async getAllArticles(): Promise<ApiResponseDto<ArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving all Articles`);

	    const articles: Article[] = await this.articlesService.getAllArticles();
        const articlesResponseDto = articles.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieved all articles list Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDto);
    }

    // READ - 내가 작성한 글 보기
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ApiResponseDto<ArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles`);

        const articles: Article[] = await this.articlesService.getMyAllArticles(logginedUser);
        const articlesResponseDto = articles.map(article => new ArticleResponseDto(article));

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDto);
    }

    // READ - 특정 게시물 보기
    @Get('/:id/detail')
    async getArticleDetailById(@Param('id') id: number): Promise<ApiResponseDto<ArticleResponseDto>> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`);

        const articleResponseDto = new ArticleResponseDto(await this.articlesService.getArticleDetailById(id));

        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article retrive Successfully', articleResponseDto);
    }

    // READ - 게시글 검색
    @Get('/search')
    async getArticlesByKeyword(@Query('keyword') author: string): Promise<ApiResponseDto<SearchArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`);

        const articles: Article[] = await this.articlesService.getArticlesByKeyword(author);
        const articlesResponseDto = articles.map(article => new SearchArticleResponseDto(article));

        this.logger.verbose(`Retrieved articles list by ${author} Successfully`);
        return new ApiResponseDto(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDto);
    }

    // UPDATE - by id
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleRequestDto: UpdateArticleRequestDto): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`Try to Updating a article by id: ${id} with updateArticleRequestDto`);

        await this.articlesService.updateArticleById(id, updateArticleRequestDto)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Article update Successfully');
    }

    // DELETE - by id
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is trying to Deleting a article by id: ${id}`);

        await this.articlesService.deleteArticleById(id, logginedUser);

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, 'Article delete Successfully');
    }
}