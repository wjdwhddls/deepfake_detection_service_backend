import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserRequestDto {
    @IsNotEmpty({message: '필수입력칸입니다'})
    @IsString({message: '양식을 따라주세요'})
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: '비밀번호가 너무 쉽습니다', })  // 대문자, 소문자, 숫자, 특수문자 포함
    user_pw: string;
    
    @IsNotEmpty({message: '필수입력칸입니다'})
    @IsString({message: '양식을 따라주세요'})
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[0-9a-zA-Z가-힣]+$/, { message: '유효하지 않은 닉네임입니다' })
    username: string;
    
    @IsNotEmpty({message: '필수입력칸입니다'})
    @IsString({message: '양식을 따라주세요'})
    @Matches(/^010-\d{4}-\d{4}$/, { message: '핸드폰 번호는 \'010-xxxx-xxxx\' 이런 형태로 적어주세요' })
    tel: string;
}