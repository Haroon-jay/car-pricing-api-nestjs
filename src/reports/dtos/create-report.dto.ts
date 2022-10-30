import { IsNumber, IsString, Min, Max, IsLatitude,  IsLongitude } from "class-validator";


export class CreateReportDto {
    @IsNumber()
    price: number;
    
    @IsString()
    make: string;
    
    @IsString()
    model: string;
    
    @IsNumber()
    @Min(1900)
    @Max(2050)
    year: number;
    
    @IsLongitude()
    lng: number;
    
    @IsLatitude()
    lat: number;
    
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;
}