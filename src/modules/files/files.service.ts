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
    return { result };
  }

  async runModel(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Python 스크립트 경로와 가상환경 Python 경로
      const pythonPath = '/Users/gyubeom/Desktop/Final Project/deepfake_detection_service_deepvoice/deepvoice/bin/python3.9';
      const scriptPath = '/Users/gyubeom/Desktop/Final Project/deepfake_detection_service_deepvoice/result.py';
      // 본인 경로로 반드시 수정 후 해야함
      const cmd = `"${pythonPath}" "${scriptPath}" "${filePath}"`; // 경로를 따옴표로 감싸서 공백 문제 해결

      exec(cmd, (error, stdout, stderr) => {
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
