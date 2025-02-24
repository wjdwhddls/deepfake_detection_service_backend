import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ArticleStatus } from '../../articles/entities/article-status.enum';

@Injectable()
export class ArticleStatusValidationPipe implements PipeTransform {

    private statusOptions = [
        ArticleStatus.PRIVATE,
        ArticleStatus.PUBLIC
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        console.log('Parameter Type: ', metadata.type);

        const status = this.normalizeValue(value);
        if (!this.isStatusValid(status)) {
            throw new BadRequestException(`${value} is not a valid status`);
        }
        return value;
    }

    private normalizeValue(value: any): string {
        return value.toUpperCase();
    }

    private isStatusValid(status: string): boolean {
        return this.statusOptions.includes(status as ArticleStatus);
    }
}