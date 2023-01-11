import {Module} from '@nestjs/common';
import {MembersService} from './services/members.service';
import {ExpertsService} from "./services/experts.service";
import {MembersController} from './controllers/members.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Member} from './entities/member.entity';
import {Expert} from "./entities/expert.entity";
import {ExpertsController} from "./controllers/experts.controller";
import {Responder} from "../../core/response/responder.response";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Member,
            Expert
        ]),
    ],
    controllers: [
        MembersController,
        ExpertsController
    ],
    providers: [
        MembersService,
        ExpertsService,
        Responder
    ],
    exports: [
        MembersService,
        ExpertsService
    ]
})
export class ChatsModule {
}
