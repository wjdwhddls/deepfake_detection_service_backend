import { Article } from "../entities/article.entity";

export class SearchArticleResponseDto {
    author: string;
    title: string;
    contents: string;

    constructor(article: Article) {
        this.author = article.author;
        this.title = article.title;
        this.contents = article.contents;

    }
}