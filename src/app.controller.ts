import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import * as Pusher from "pusher"

const pusher = new Pusher({
  appId: "",
  key: "",
  secret: "",
  cluster: "",
  useTLS: true,
});


const CHANNEL = 'private-vinay-channel'
const EVENT = 'some-event'


import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('GET');
    
    return this.appService.getHello();
  }
  
  @Post()
  authorization(@Body() body) {
    const socketId = body.socket_id;
    const channel = body.channel_name;
    const authResponse = pusher.authorizeChannel(socketId, channel);
    return authResponse
  }
  
  @Post('/triggerEvent')
  triggerEventFromClient(@Body() body) {
    const data = body.data;
    return pusher.trigger(CHANNEL, EVENT, data)
  }
  
}
