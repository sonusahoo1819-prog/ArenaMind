import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @IsNotEmpty()
  zoneId: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  densityScore: number;

  @IsNumber()
  @Min(0)
  queueLength: number;

  @IsNumber()
  @Min(0)
  waitTimeMin: number;
}
