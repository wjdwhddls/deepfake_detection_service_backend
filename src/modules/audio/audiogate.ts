import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OfferData, AnswerData, IceCandidateData } from './audiointerface';

@WebSocketGateway({ cors: { origin: '*' } })
export class AudioGate implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private userSocketMap = new Map<string, string>();

  // 클라이언트 연결
  handleConnection(client: Socket) {
    console.log(`[CONNECT] 클라이언트 접속: 소켓ID = ${client.id}`);
  }

  // 클라이언트 연결 해제
  handleDisconnect(client: Socket) {
    let disconnectedPhone: string | null = null;
    for (const [phone, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(phone);
        disconnectedPhone = phone;
        console.log(`[DISCONNECT] 사용자 연결 해제: 전화번호 = ${phone}, 소켓ID = ${client.id}`);
        break;
      }
    }
    if (!disconnectedPhone) {
      console.log(`[DISCONNECT] 등록되지 않은 소켓 연결 해제: 소켓ID = ${client.id}`);
    }
  }

  // 사용자 등록
  @SubscribeMessage('register-user')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { phoneNumber: string }
  ): void {
    this.userSocketMap.set(data.phoneNumber, client.id);
    console.log(`[REGISTER] 사용자 등록됨: 전화번호 = ${data.phoneNumber}, 소켓ID = ${client.id}`);
    console.log(`[REGISTER] 현재 등록된 사용자 목록:`, Array.from(this.userSocketMap.entries()));
  }

  // 발신(call) 이벤트
  @SubscribeMessage('call')
  handleCall(@MessageBody() data: { to: string; from: string }, @ConnectedSocket() client: Socket): void {
    const toSocketId = this.userSocketMap.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('call', { from: data.from });
      console.log(`[CALL] 발신: from = ${data.from} (소켓ID: ${client.id}) → to = ${data.to} (소켓ID: ${toSocketId})`);
    } else {
      console.log(`[CALL_FAIL] 대상자 미접속: to = ${data.to} (from = ${data.from}), 현재 연결된 소켓ID 없음`);
    }
  }

  // offer 이벤트
  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: OfferData, @ConnectedSocket() client: Socket): void {
    const toSocketId = this.userSocketMap.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('offer', { offer: data.offer, from: data.from });
      console.log(`[OFFER] from = ${data.from} (소켓ID: ${client.id}) → to = ${data.to} (소켓ID: ${toSocketId})`);
    } else {
      console.log(`[OFFER_FAIL] 대상자 미접속: to = ${data.to} (from = ${data.from}), 현재 연결된 소켓ID 없음`);
    }
  }

  // answer 이벤트
  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: AnswerData, @ConnectedSocket() client: Socket): void {
    const toSocketId = this.userSocketMap.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('answer', { answer: data.answer, from: data.from });
      console.log(`[ANSWER] from = ${data.from} (소켓ID: ${client.id}) → to = ${data.to} (소켓ID: ${toSocketId})`);
    } else {
      console.log(`[ANSWER_FAIL] 대상자 미접속: to = ${data.to} (from = ${data.from}), 현재 연결된 소켓ID 없음`);
    }
  }

  // ice 이벤트
  @SubscribeMessage('ice')
  handleIce(@MessageBody() data: IceCandidateData, @ConnectedSocket() client: Socket): void {
    const toSocketId = this.userSocketMap.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('ice', { candidate: data.candidate, from: data.from });
      console.log(`[ICE] from = ${data.from} (소켓ID: ${client.id}) → to = ${data.to} (소켓ID: ${toSocketId})`);
    } else {
      console.log(`[ICE_FAIL] 대상자 미접속: to = ${data.to} (from = ${data.from}), 현재 연결된 소켓ID 없음`);
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