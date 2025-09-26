import { Injectable } from '@nestjs/common';
import { Country, City } from 'generated/prisma';
import { DatabaseService } from 'src/modules/database/database.service';
import { CityDto } from './dto/CreateCityDto';

import { getLocations } from 'serpapi';

@Injectable()
export class LocationService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  async getLocations(q: string) {
    const searchQuery = (q && q.trim()) ? q : 'United States';
    const results = await getLocations({
      q: searchQuery
    })
    return results
  }

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
    let response: Country[] = []
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
