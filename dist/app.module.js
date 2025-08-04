"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const murmur_entity_1 = require("./entities/murmur.entity");
const like_entity_1 = require("./entities/like.entity");
const follow_entity_1 = require("./entities/follow.entity");
const typeorm_2 = require("typeorm");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 3306),
                    username: config.get('DB_USERNAME', 'docker'),
                    password: config.get('DB_PASSWORD', 'docker'),
                    database: config.get('DB_NAME', 'test'),
                    entities: [user_entity_1.User, murmur_entity_1.Murmur, like_entity_1.Like, follow_entity_1.Follow],
                    synchronize: config.get('NODE_ENV') !== 'production',
                    retryAttempts: 5,
                    retryDelay: 3000,
                    logging: config.get('NODE_ENV') === 'development',
                    namingStrategy: new typeorm_2.DefaultNamingStrategy(),
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, murmur_entity_1.Murmur, like_entity_1.Like, follow_entity_1.Follow]),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map