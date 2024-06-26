import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';


@WebSocketGateway({
  cors:{
    origin: '*', // Allow all origins
  }
})
export class MessagesGateway {
  @WebSocketServer() 
  server:Server;


  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client:Socket,
    ) {
    const message = await this.messagesService.create(createMessageDto,client.id); // await the result of the create method
    this.server.emit('message', message); // Emit the message to all clients
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client:Socket,
  ) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client:Socket) {
    const name = this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', {name, isTyping}); // inform the clients that a user is typing
  }
}
