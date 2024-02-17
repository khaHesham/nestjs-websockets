import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  messages: Message[] = [{name: 'John', text: 'Hello World!'}];
  clientToUser = {};
  
  create(createMessageDto: CreateMessageDto, id: string) {
    const message = { name: this.clientToUser[id], text: createMessageDto.text};
    this.messages.push(message);
    return message; 
  }
  
  findAll() {
    return this.messages;
  }

  identify(name: string, id: string) {
    this.clientToUser[id] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(id: string) {
    return this.clientToUser[id];
  }

}
