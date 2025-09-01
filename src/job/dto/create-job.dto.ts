import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsOptional, IsString, Matches, Max, Min, ValidateNested } from "class-validator";


class LocationDto {
  @IsString()
  country: string;

  @IsArray()
  @IsString({ each: true })
  locations: string[]
}

class ScheduleDto {
  @IsIn(['hourly', 'daily', 'weekly', 'monthly'])
  type: string;

  @IsInt()
  @Min(1)
  interval: number;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/) // HH:mm format
  time?: string;

  @IsOptional()
  @IsIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  dayOfWeek?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minute?: number;
}

export class CreateJobDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsString({ each: true})
  keywords: string[];

  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;
}
