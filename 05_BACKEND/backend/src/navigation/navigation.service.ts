import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRouteDto) {
    return this.prisma.navigationRoute.create({
      data: {
        startPoint: dto.startPoint,
        endPoint: dto.endPoint,
        isAccessible: dto.isAccessible || false,
        isEmergency: dto.isEmergency || false,
        routeData: dto.routeData,
      },
    });
  }

  async findAll() {
    return this.prisma.navigationRoute.findMany();
  }

  async calculateRoute(startPoint: string, endPoint: string, isAccessible = false, isEmergency = false) {
    // 1. Look for pre-existing route in DB
    const route = await this.prisma.navigationRoute.findFirst({
      where: {
        startPoint,
        endPoint,
        isAccessible,
        isEmergency,
      },
    });

    if (route) {
      return route;
    }

    // 2. Generate dynamic route if not present
    return this.generateDynamicRoute(startPoint, endPoint, isAccessible, isEmergency);
  }

  private generateDynamicRoute(startPoint: string, endPoint: string, isAccessible: boolean, isEmergency: boolean) {
    // Mock coordinates: starting near stadium gate, routing to section/exit
    const startCoords = { lat: 34.0522, lng: -118.2437 };
    const endCoords = { lat: 34.0532, lng: -118.2447 };

    const coordinates = [
      { lat: startCoords.lat, lng: startCoords.lng },
      { lat: (startCoords.lat + endCoords.lat) / 2, lng: (startCoords.lng + endCoords.lng) / 2 },
      { lat: endCoords.lat, lng: endCoords.lng },
    ];

    const instructions = isEmergency 
      ? [
          'Emergency Evacuation Alert: Follow exit signs immediately.',
          'Head directly towards the nearest illuminated emergency exit door.',
          'Assemble outside at Assembly Area C.'
        ]
      : isAccessible 
        ? [
            `Start at ${startPoint} accessible entrance.`,
            'Take elevator A to Level 2.',
            'Follow the wheelchair ramp on the right.',
            `Arrive at ${endPoint} accessible seating.`
          ]
        : [
            `Start at ${startPoint}.`,
            'Go up stairs to Level 2.',
            'Turn left at Section 202.',
            `Arrive at ${endPoint}.`
          ];

    const queueTimeMin = isEmergency ? 0 : Math.floor(Math.random() * 5) + 1;
    const estTimeMin = isEmergency ? 2 : Math.floor(Math.random() * 8) + 3;

    return {
      startPoint,
      endPoint,
      isAccessible,
      isEmergency,
      routeData: {
        coordinates,
        instructions,
        estimatedTimeMin: estTimeMin,
        distanceMeters: 350,
      },
      crowdMetadata: {
        queueTimeMin,
        congestionLevel: isEmergency ? 'CRITICAL' : queueTimeMin > 4 ? 'HIGH' : 'LOW',
      },
    };
  }
}
