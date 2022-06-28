"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MessageGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const filter_1 = require("../filter/filter");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const message_1 = require("../model/message");
const change_group_state_1 = require("../model/change.group.state");
let MessageGateway = MessageGateway_1 = class MessageGateway {
    constructor() {
        this.logger = new common_2.Logger(MessageGateway_1.name);
        this.APPID = process.env.APPID || MessageGateway_1.name;
    }
    afterInit() {
        this.logger.log(`${this.APPID} Server Init Complete`);
    }
    handleConnection(client) {
        this.logger.log(`${client.handshake.address}(${client.handshake.query['userId']}) is connected!`);
    }
    handleDisconnect(client) {
        this.logger.log(`${client.handshake.address}(${client.handshake.query['userId']}) is disconnected`);
    }
    async messagePassing(message) {
        this.logger.log(message);
        this.server.to(message.groupId).emit('to-client', message);
    }
    changeState(client, changeGroupState) {
        if (changeGroupState.state === 'join') {
            client.join(changeGroupState.groupId);
            this.logger.log(`${client.handshake.address}(${changeGroupState.userId}) joined at room [${changeGroupState.groupId}]!`);
        }
        else if (changeGroupState.state === 'leave') {
            client.leave(changeGroupState.groupId);
            this.logger.log(`${client.handshake.address}(${changeGroupState.userId}) leaved from room [${changeGroupState.groupId}]!`);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseFilters)(new filter_1.AllExceptionsFilter()),
    (0, websockets_1.SubscribeMessage)('to-server'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "messagePassing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('change-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, change_group_state_1.ChangeGroupState]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "changeState", null);
MessageGateway = MessageGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=message.gateway.js.map