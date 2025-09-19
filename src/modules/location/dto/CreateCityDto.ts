import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationType } from 'generated/prisma';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  country_id: string;

  @ValidateNested()
  @Type(() => CityDto)
  cities: CityDto[];
}

export class CityDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(LocationType)
  type: LocationType;
}
