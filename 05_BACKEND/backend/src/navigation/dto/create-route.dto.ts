import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  startPoint: string;

  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsBoolean()
  @IsOptional()
  isAccessible?: boolean;

  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @IsObject()
  routeData: any;
}
