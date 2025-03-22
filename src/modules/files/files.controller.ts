// files.controller.ts  
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';  
import { FileInterceptor } from '@nestjs/platform-express';  
import { FilesService } from './files.service';  

@Controller('files')  
export class FilesController {  
  constructor(private readonly filesService: FilesService) {}  

  @Post('upload')  
  @UseInterceptors(FileInterceptor('file'))  
  async uploadFile(@UploadedFile() file: Express.Multer.File) {  
    console.log('파일 업로드 요청 수신');  // 로그 추가  
    return this.filesService.processFile(file);  
  }  
}  