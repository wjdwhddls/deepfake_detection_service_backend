import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OfferData, AnswerData, IceCandidateData } from './audiointerface';

@WebSocketGateway({ cors: { origin: '*' } })
export class AudioGate implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private userSocketMap = new Map<string, string>(); // phoneNumber -> socketId
  private socketPhoneMap = new Map<string, string>(); // socketId -> phoneNumber

  handleConnection(client: Socket) {
    console.log(`[CONNECT] 클라이언트 접속: 소켓ID = ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const phone = this.socketPhoneMap.get(client.id);
    if (phone) {
      this.userSocketMap.delete(phone);
      this.socketPhoneMap.delete(client.id);
      console.log(`[DISCONNECT] 사용자 연결 해제: 전화번호 = ${phone}, 소켓ID = ${client.id}`);
    } else {
      console.log(`[DISCONNECT] 등록되지 않은 소켓 연결 해제: 소켓ID = ${client.id}`);
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { phoneNumber: string }
  ): void {
    this.userSocketMap.set(data.phoneNumber, client.id);
    this.socketPhoneMap.set(client.id, data.phoneNumber);
    console.log(`[REGISTER] 사용자 등록됨: 전화번호 = ${data.phoneNumber}, 소켓ID = ${client.id}`);
    console.log(`[REGISTER] 현재 등록된 사용자 목록:`, Array.from(this.userSocketMap.entries()));
  }

  @SubscribeMessage('call')
  handleCall(
    @MessageBody() data: { to: string; from: string; number: string; name: string },
    @ConnectedSocket() client: Socket
  ): void {
    const toSocketId = this.userSocketMap.get(data.to);
    const fromSocketId = client.id;
    if (toSocketId) {
      // 수신자에게 통화 요청 전송
      this.server.to(toSocketId).emit('call', {
        from: fromSocketId,
        number: data.number,
        name: data.name,
      });
      console.log(`[CALL] 발신: from = ${data.from} (소켓ID: ${fromSocketId}) → to = ${data.to} (소켓ID: ${toSocketId})`);

      // 발신자에게 수신자의 socketId 전달
      this.server.to(fromSocketId).emit('call-ack', {
        toSocketId,
      });
      console.log(`[CALL-ACK] 수신자 socketId 전달: toSocketId = ${toSocketId} → from = ${data.from}`);
    } else {
      console.log(`[CALL_FAIL] 대상자 미접속: to = ${data.to} (from = ${data.from}), 현재 연결된 소켓ID 없음`);
    }
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: OfferData, @ConnectedSocket() client: Socket): void {
    const toSocketId = data.to;
    const fromSocketId = client.id;
    if (toSocketId) {
      this.server.to(toSocketId).emit('offer', { offer: data.offer, from: fromSocketId });
      console.log(`[OFFER] from = ${fromSocketId} → to = ${toSocketId}`);
    } else {
      console.log(`[OFFER_FAIL] 대상자 소켓ID 없음: to = ${data.to}`);
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: AnswerData, @ConnectedSocket() client: Socket): void {
    const toSocketId = data.to;
    const fromSocketId = client.id;
    if (toSocketId) {
      this.server.to(toSocketId).emit('answer', { answer: data.answer, from: fromSocketId });
      console.log(`[ANSWER] from = ${fromSocketId} → to = ${toSocketId}`);
    } else {
      console.log(`[ANSWER_FAIL] 대상자 소켓ID 없음: to = ${data.to}`);
    }
  }

  @SubscribeMessage('ice')
  handleIce(@MessageBody() data: IceCandidateData, @ConnectedSocket() client: Socket): void {
    const toSocketId = data.to;
    const fromSocketId = client.id;
    if (toSocketId) {
      this.server.to(toSocketId).emit('ice', { candidate: data.candidate, from: fromSocketId });
      console.log(`[ICE] from = ${fromSocketId} → to = ${toSocketId}`);
    } else {
      console.log(`[ICE_FAIL] 대상자 소켓ID 없음: to = ${data.to}`);
    }
  }

  @SubscribeMessage('hangup')
  handleHangup(@MessageBody() data: { to: string; from: string }, @ConnectedSocket() client: Socket): void {
    const toSocketId = this.userSocketMap.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('call-ended');
      this.server.to(client.id).emit('call-ended'); // ← 발신자도 처리되도록 추가
      console.log(`[HANGUP] from=${data.from} → to=${data.to}`);
    } else {
      console.log(`[HANGUP_FAIL] 대상 미접속: to=${data.to}`);
    }
  }
}