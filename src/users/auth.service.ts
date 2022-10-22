import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';

const script = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    // see if email is in use
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new NotAcceptableException('Email is already in use');
    }
    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await script(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // create user and save to db
    const userRes = await this.userService.create(email, result);
    return userRes;
  }
  async signIn(email: string, password: string) {
    // check if email exists
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email is not registered');
    }

    // check if password is correct
    const [salt, storedHash] = user.password.split('.');
    const hash = (await script(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new ForbiddenException('Invalid password');
    }
    return user;
    // generate jwt
  }
}

const obj = {
  event: 'Event1',
  product: 'abc',
  category: 'xyz',
  color: {
    name: 'red',
    code: '123',
  },
  color2: [
    {
      width: '123',
      legth: '456',
    },
    {
      width: 'asd',
      length: 'xcq',
    },
  ],
};
// function () {
//     var color2 = {{CJS - window.dataLayer array - last item}}
    // var output = {};
    // var keys = Object.keys(input).filter(function(key){
    //   return key !== 'event';
    // });
    // for (var i = 0; i < keys.length; i++) {
    //   var key = keys[i];
    //   if (Array.isArray(input[key])) {
    //     output["parameter" + (i + 1)] = "ARRAY";
    //   } else {
    //     output["parameter" + (i + 1)] = key;
    //   }
    // }
    // return {
    //   event: input.event,
    //   parameters: output
    // }
//   }

	
// {
//     event: "productImpression",
//     ecommerce: {
//       currencyCode: "USD",
//       impressions: [
//         {
//           name: "Director of Content and SEO at AgencyAnalytics",
//           id: "15832",
//           price: "1",
//           brand: "AgencyAnalytics",
//           category: "content marketing,marketing manager,SEO",
//           variant: "Full time",
//           list: "home",
//           position: 1,
//           age: "15",
//           locationscope: "Anywhere"
//         }
//       ]
//     },
//     gtm.uniqueEventId: 3
//   }
// function (){
//   var input = {{CJS - window.dataLayer array - last item}}
//   var output = {};
//   function getNextParamNumber(){
//       var keys = Object.keys(output);
//       if(keys.length === 0)return 1;
//       var lastKey = keys[keys.length - 1];
//       var lastNumber = parseInt(lastKey.replace('parameter', ''));
//       return lastNumber + 1;
//   }
//   function dealWithObject(obj, key){
//          var objKeys = Object.keys(obj);
//           for(var k = 0; k < objKeys.length; k++){
//               if(Array.isArray(obj[objKeys[k]])){
//                   dealWithArray(obj[objKeys[k]], key + '.' + objKeys[k]);
//               }else if(isObject(obj[objKeys[k]])){
//                   dealWithObject(obj[objKeys[k]], key + '.' + objKeys[k]);
//               }
              
//               else {
//                   var paramNum = getNextParamNumber();
//                   output["parameter" + paramNum] = key + '.' + objKeys[k];
//               }
             
//           }
//   }
//   function dealWithArray(arr, key){
//       for(var j = 0; j < arr.length; j++){
//           if(isObject(arr[j])){
//               dealWithObject(arr[j], key);
//           }else if(Array.isArray(arr[j])){
//               dealWithArray(arr[j], key);
//           }
//       }
//   }
//   function isObject(obj){
//   return typeof obj === 'object' &&
//   !Array.isArray(obj) &&
//   obj !== null
//   }

//   var keys = Object.keys(input).filter(function(key){
//     return key !== 'event' && key!=='gtm.uniqueEventId' && key!=='eventCallback' && key!=='eventTimeout';
//   });
//   for (var i = 0; i < keys.length; i++) {
//     var key = keys[i];
//     if (Array.isArray(input[key])) {
//       dealWithArray(input[key], key);
//     }else if(isObject(input[key])){
//       dealWithObject(input[key], key);
//     }
    
//     else {
//       output["parameter" + getNextParamNumber() ] = key;
//     }
//   }
//   return output;
// }

