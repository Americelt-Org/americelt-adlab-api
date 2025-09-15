import { Injectable } from '@nestjs/common';
import { Country, City } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { CityDto, CreateCityDto } from './dto/CreateCityDto';

@Injectable()
export class LocationService {

  constructor(
    private databaseService: DatabaseService
  ){}

  async getCountries(): Promise<Country[]> {
    const countries = await this.databaseService.country.findMany({
      include: { cities: true }
    })
    return countries
  }

  async getCities(countryId: string): Promise<City[]> {
    const cities = await this.databaseService.city.findMany({
      where: { country_id: countryId },
    })
    return cities
  }

  async createCountry(data: string[]): Promise<Country | Country[]> {
    let response: Country [] = []
    for (const name of data) {
      response.push(
        await this.databaseService.country.create({
         data: { name }
        })
      )
    }
    return response
  }

  async createCity(id: string, data: CityDto): Promise<City> {
    const city = await this.databaseService.city.create({
      data: {
        country_id: id,
        location: data.location,
        label: data.label,
        type: data.type,
      },
    });

  return city;
}
}
