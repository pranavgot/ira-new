import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'searchFilter'
})
export class SearchPipe implements PipeTransform {

    transform(value: any, args?: any, type?: any, subtype?: any): any {
        console.log('value', value, 'args', args, 'type', type, 'subtype', subtype)
        if(type == 'join'){
            if (subtype == 'pt' || subtype == 'ft') {
                if (!args.tableNameUI) {
                    return value;
                }
                return value.filter((val: any) => val.tableNameUI?.toLocaleLowerCase()?.trim().includes(args.tableNameUI?.toLocaleLowerCase()?.trim()));
            }
            else if(subtype == 'pk' || subtype == 'fk'){
                if (!args.fieldName) {
                    return value;
                }
                return value.filter((val: any) => val.fieldName?.toLocaleLowerCase()?.trim().includes(args.fieldName?.toLocaleLowerCase()?.trim()));
            }
        }
        else if(type == 'tf'){
            if (!args.tableNameUI) {
                return value;
            }
            return value.filter((val: any) => val.fieldName?.toLocaleLowerCase()?.trim().includes(args.tableNameUI?.toLocaleLowerCase()?.trim()));
        }
        else if (type == 'dataset') {
            console.log(value,'right');         
            if (subtype == 'pt' || subtype == 'ft') {
                if (!args.tableNameUI) {
                    return value;
                }
                return value.filter((val: any) => val.tableNameUI?.toLocaleLowerCase()?.trim().includes(args.tableNameUI?.toLocaleLowerCase()?.trim()));
            }
            else if(subtype == 'pk' || subtype == 'fk'){
                if (!args.fieldName) {
                    return value;
                }
                return value.filter((val: any) => val.fieldName?.toLocaleLowerCase()?.trim().includes(args.fieldName?.toLocaleLowerCase()?.trim()));
            }
        }
        else if(type == 'createDSpopup'){
            console.log(value,'left');
            if(subtype == 'append' || subtype == 'join' || subtype == 'files' || subtype == 'dataset'){
                if (!args.tableNameUI) {
                    return value;
                }
                return value.filter((val: any) => val.fieldName?.toLocaleLowerCase()?.trim().includes(args.tableNameUI?.toLocaleLowerCase()?.trim()));
            }

        }
        else if( type == 'Where'){
            if(subtype == 'columnSearch' || subtype == 'groupBy' || subtype == 'orderBy'){         
                if (!args.tableNameUI) {
                    return value;
                }
               return value.filter((val:any) => val.filefieldName?.toLocaleLowerCase()?.trim().includes(args.tableNameUI?.toLocaleLowerCase()?.trim()));
            }
        }
    }
}

