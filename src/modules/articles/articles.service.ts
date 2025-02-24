import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './entities/article-status.enum';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger(ArticlesService.name);

    constructor(
        @InjectRepository(Article)
        private articlesRepository : Repository<Article>
    ){}

    // CREATE
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is creating a new article with title: ${createArticleRequestDto.title}`);

        const { title, contents } = createArticleRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('Title, and contents must be provided');
        }
        const newArticle = this.articlesRepository.create({
            author: logginedUser.username, 
            title,
            contents,
            status: ArticleStatus.PUBLIC,
            user: logginedUser
        });

        await this.articlesRepository.save(newArticle);

        this.logger.verbose(`Article title with ${newArticle.title} created Successfully`);
    }

    // READ - all
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all Articles`);

        const foundArticles = await this.articlesRepository.find();

        this.logger.verbose(`Retrieved all articles list Successfully`);
        return foundArticles;
    }

    // READ - by Loggined User
    async getMyAllArticles(logginedUser: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`);

        const foundArticles = await this.articlesRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.userId = :userId', { userId : logginedUser.id })
            .getMany();

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`);
        return foundArticles;
    }

    // READ - by id
    async getArticleDetailById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving a article by id: ${id}`);

        const foundArticle = await this.articlesRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.id = :id', { id })
            .getOne();

        if (!foundArticle) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }

        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);
        return foundArticle;
    }

    // READ - by keyword
    async getArticlesByKeyword(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieving a article by author: ${author}`);

        if (!author) {
            throw new BadRequestException('Author keyword must be provided');
        }
        const foundArticles = await this.articlesRepository.findBy({ author: author })
        if (foundArticles.length === 0) {
            throw new NotFoundException(`No articles found for author: ${author}`);
        }

        this.logger.verbose(`Retrieved articles list by ${author} Successfully`);
        return foundArticles;
    }
    
    // UPDATE - by id
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto): Promise<void> {
        this.logger.verbose(`Updating a article by id: ${id} with updateArticleRequestDto`);

        const foundArticle = await this.getArticleDetailById(id);
        const { title, contents } = updateArticleRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided');
        }
        foundArticle.title = title;
        foundArticle.contents = contents;
        await this.articlesRepository.save(foundArticle)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
    }


    // DELETE - by id
    async deleteArticleById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is Deleting a article by id: ${id}`);

        const foundArticle = await this.getArticleDetailById(id);

        if (foundArticle.user.id !== logginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this article')
        }
        await this.articlesRepository.delete(foundArticle);

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`);
    }
}