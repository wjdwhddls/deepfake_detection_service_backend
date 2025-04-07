import { Dashboard } from "../entities/dashboard.entity";

export class SearchDashboardResponseDto {
    authorId: number; // 작성자 ID
    authorName: string; // 작성자 이름
    title: string;
    contents: string;

    constructor(dashboard: Dashboard) {
        this.authorId = dashboard.user.id; // 작성자 ID
        this.authorName = dashboard.user.username; // 작성자 이름
        this.title = dashboard.TITLE;
        this.contents = dashboard.TEXT;
    }
}
