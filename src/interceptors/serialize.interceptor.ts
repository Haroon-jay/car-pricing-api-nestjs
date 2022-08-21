import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable }  from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";



interface ClassConstructor {
    new(...args: any[]): {}
}
export function Serialize(DTO:ClassConstructor){
  return UseInterceptors(new SerializeInterceptor(DTO))
}
export class SerializeInterceptor implements NestInterceptor {
    constructor(private DTO:ClassConstructor){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

       return next.handle().pipe(map((data) => {
        return plainToInstance(this.DTO, data, {excludeExtraneousValues: true});
       }));

    }
}