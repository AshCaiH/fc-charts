import { Game, User } from "./models";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            gameNames?: string[];
            game?: Game;
            status?: Status;
        }
    }
}
