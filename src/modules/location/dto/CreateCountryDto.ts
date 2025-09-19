import { ArrayNotEmpty, IsArray, IsString } from "class-validator";


export class CreateCountyDto { 
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true, message: 'Each country name must be a string' })
  countries: string[]
}