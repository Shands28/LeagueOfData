import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nbsp'
})
export class NbspPipe implements PipeTransform {

  transform(value: string, args?: string): string {
    return value.replace(' ', '');
  }

}
