import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateCountyDto } from './dto/CreateCountryDto';
import { CreateCityDto } from './dto/CreateCityDto';

@Controller('locations')
export class LocationController {

  constructor(
    private locationService: LocationService
  ){}

  @Get('countries')
  async getCountries() {
    const countries = await this.locationService.getCountries()
    return countries
  }

  @Post('countries')
  async addCountry(@Body() country: CreateCountyDto ){
    const created = await this.locationService.createCountry(country.countries)
    return created
  }

  @Post('cities')
  async addCity(@Body() city: CreateCityDto) {
    let result: any = []
    for(const c of city.cities) {
       const createdCity = await this.locationService.createCity(city.country_id, c)
       result.push(createdCity)
    }
    return result
  }

  @Get()
  async getLocations(
    @Query('q') q: string
  ){
    return await this.locationService.getLocations(q)
  }

}
