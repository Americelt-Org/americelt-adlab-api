import { 
  IsString, 
  IsOptional, 
  IsNotEmpty, 
  IsArray,
  IsBoolean,
  IsEnum,
  ArrayNotEmpty,
  Matches
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Device, SearchEngine } from 'generated/prisma';


export class CreateTaskDto {
  @ApiProperty({
    description: 'Job name',
    example: 'Frontend Developer Search'
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Job search location',
    example: 'San Francisco, CA'
  })
  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @ApiProperty({
    description: 'Search keywords',
    example: ['hvac', 'plumbing', 'contractor'],
    type: [String]
  })
  @IsArray({ message: 'Keywords must be an array' })
  @ArrayNotEmpty({ message: 'At least one keyword is required' })
  @IsString({ each: true, message: 'Each keyword must be a string' })
  keywords: string[];

  @ApiProperty({
    description: 'User ID who owns this job',
    example: 'user_123456789'
  })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    description: 'Search engine to use',
    enum: SearchEngine,
    example: SearchEngine.google
  })
  @IsEnum(SearchEngine, { message: 'Invalid search engine' })
  search_engine: SearchEngine;

  @ApiProperty({
    description: 'Device type for search',
    enum: Device,
    example: Device.desktop
  })
  @IsEnum(Device, { message: 'Invalid device type' })
  device: Device;

  @ApiProperty({
    description: 'Cron expression for job scheduling',
    example: '0 9 * * MON-FRI'
  })
  
  @IsString({ message: 'Cron must be a string' })
  @IsNotEmpty({ message: 'Cron expression is required' })
  @Matches(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/, 
    { message: 'Invalid cron expression format' })
  cron: string;

  @ApiPropertyOptional({
    description: 'Whether the job is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean' })
  @Transform(({ value }) => value ?? true)
  is_active?: boolean;
}

export class UpdateJobDto extends PartialType(CreateTaskDto) {}

export class JobResponseDto {
  @ApiProperty({
    description: 'Job unique identifier',
    example: 'job_123456789'
  })
  id: string;

  @ApiProperty({
    description: 'Job name',
    example: 'Frontend Developer Search'
  })
  name: string;

  @ApiProperty({
    description: 'Job search location',
    example: 'San Francisco, CA'
  })
  location: string;

  @ApiProperty({
    description: 'Search keywords',
    example: ['javascript', 'react', 'node.js'],
    type: [String]
  })
  keywords: string[];

  @ApiProperty({
    description: 'User ID who owns this job',
    example: 'user_123456789'
  })
  userId: string;

  @ApiProperty({
    description: 'Search engine to use',
    enum: SearchEngine,
    example: SearchEngine.google
  })
  search_engine: SearchEngine;

  @ApiProperty({
    description: 'Device type for search',
    enum: Device,
    example: Device.desktop
  })
  device: Device;

  @ApiProperty({
    description: 'Cron expression for job scheduling',
    example: '0 9 * * MON-FRI'
  })
  cron: string;

  @ApiProperty({
    description: 'Whether the job is active',
    example: true
  })
  is_active: boolean;

  @ApiPropertyOptional({
    description: 'Last time the job was executed',
    example: '2024-01-15T09:00:00Z',
    nullable: true
  })
  @Type(() => Date)
  last_run_at: Date | null;

  @ApiPropertyOptional({
    description: 'Next scheduled execution time',
    example: '2024-01-16T09:00:00Z',
    nullable: true
  })
  @Type(() => Date)
  next_run_at: Date | null;

  @ApiProperty({
    description: 'Job creation timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Job last update timestamp',
    example: '2024-01-15T08:30:00Z'
  })
  @Type(() => Date)
  updatedAt: Date;
}

// Query DTOs for filtering/searching
export class JobQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'user_123456789'
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by search engine',
    enum: SearchEngine
  })
  @IsOptional()
  @IsEnum(SearchEngine)
  search_engine?: SearchEngine;

  @ApiPropertyOptional({
    description: 'Search in job names',
    example: 'developer'
  })
  @IsOptional()
  @IsString()
  search?: string;
}