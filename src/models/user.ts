import { AppRole } from "./appRole";

export class User {

    id: number;
	email: string;
	name: string;
	mobile: string;
	 
	user_token: string;
	userRole: AppRole;
	school_id: number;
    url: string;
}