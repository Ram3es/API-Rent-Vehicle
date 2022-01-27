import { ValidationExceptions } from './../exceptions/validation.exceptions';
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class ValidationPipes implements PipeTransform{
   async transform(value: any, metadata: ArgumentMetadata):Promise<any> {
      if(metadata.type !=="body"){
          return value }
       const obj = plainToClass(metadata.metatype, value)
       const errors = await validate(obj,{skipMissingProperties : true })
       if(errors.length){
         const messages =  errors.map(err => { 
               return `${err.property} - ${Object.values(err.constraints).join(", ")}`
           })
           throw new ValidationExceptions(messages)
       }
       return value
    }

}