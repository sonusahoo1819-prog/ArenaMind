import { IsString, IsNotEmpty, IsEnum, IsObject } from 'class-validator';
import { IncidentType } from '../../types/enums';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(IncidentType)
  type: IncidentType;

  @IsObject()
  location: any; // { lat, lng, zoneId, level }
}
