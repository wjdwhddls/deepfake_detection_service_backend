import { DashboardStatus } from "../entities/dashboard-status.enum";
import { Dashboard } from "../entities/dashboard.entity";

export class DashboardResponseDto {
    id: number;
    author: number;
    title: string;
    contents: string;
    date: Date;
    like_num: number;
    // user: UserResponseDto;

    constructor(dashboard: Dashboard) {
        this.id = dashboard.POST_ID;
        this.author = dashboard.USER_ID;
        this.title = dashboard.TITLE;
        this.contents = dashboard.TEXT;
        this.like_num = dashboard.LIKE_NUM;
        // this.user = new UserResponseDto(dashboard.user);
    }
}