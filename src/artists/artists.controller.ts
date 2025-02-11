import { Controller, Get } from '@nestjs/common';

@Controller('artists')
export class ArtistsController {

  @Get()
  getAll(){
    return "all artists";
  }

}
