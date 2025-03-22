import { Injectable } from '@nestjs/common';  
import * as path from 'path';  
import * as fs from 'fs';  
import { exec } from 'child_process'; // 모델 실행을 위해 사용  

@Injectable()  
export class FilesService {  
  async processFile(file: Express.Multer.File) {  
    // 파일 저장 경로  
    const filePath = path.join(__dirname, '..', '..', '..', '..', 'deepfake_detection_service_deepvoice', 'data_example', file.originalname); 

    // 파일 저장  
    fs.writeFileSync(filePath, file.buffer);  

    // 알고리즘 모델 실행   
    const result = await this.runModel(filePath);  
    
    // 결과 반환  
    return result;  
  }  

  async runModel(filePath: string): Promise<any> {  
    return new Promise((resolve, reject) => {  
      // 가상환경의 Python 경로를 사용해 Python 스크립트 실행  
      exec(`/Users/jongin/deepfake_detection_service_deepvoice/myenv/bin/python /Users/jongin/deepfake_detection_service_deepvoice/result.py ${filePath}`, (error, stdout, stderr) => {  
        if (error) {  
          console.error(`Error: ${stderr}`);  
          reject(`Error: ${stderr}`);  
          return;  
        }  
        resolve(stdout);  
      });  
    });  
  }
}  