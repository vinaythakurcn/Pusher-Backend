import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as Pusher from 'pusher';

const pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: '',
  useTLS: true,
});

const CHANNEL = 'private-vinay-channel';
const EVENT = 'some-event';

import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('GET');

    return this.appService.getHello();
  }

  @Get('/todos')
  getTodos() {
    console.log('GET');

    return [
      {
        title: 'Todo 1',
      },
      {
        title: 'Todo 2',
      },
    ];
  }

  @Post()
  authorization(@Body() body) {
    const socketId = body.socket_id;
    const channel = body.channel_name;
    const authResponse = pusher.authorizeChannel(socketId, channel);
    return authResponse;
  }

  @Post('/triggerEvent')
  triggerEventFromClient(@Body() body) {
    const data = body.data;
    return pusher.trigger(CHANNEL, EVENT, data);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      message: 'file uploaded successfully',
      name: file.filename
    };
  }
}
