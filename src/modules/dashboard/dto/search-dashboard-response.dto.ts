import { Dashboard } from "../entities/dashboard.entity";

export class SearchDashboardResponseDto {
    author: number;
    title: string;
    contents: string;

    constructor(dashboard: Dashboard) {
        this.author = dashboard.id;
        this.title = dashboard.TITLE;
        this.contents = dashboard.TEXT;

    }
}