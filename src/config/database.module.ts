import { Module } from '@nestjs/common';
import AppDataSource from './data-source';

@Module({
    providers: [
        {
            provide: 'DATA_SOURCE',
            useValue: AppDataSource,
        },
    ],
    exports: ['DATA_SOURCE']
})
export class DatabaseModule { }
