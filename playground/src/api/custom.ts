import { Api, Body, Delete, Get, Post, Query } from 'fashion-axios'

export interface CustomListModel {
    id: string
    name: string
}

export interface CustomCreateBody {
    name: string
}

export interface CustomDeleteParams {
    id: string
}

@Api('/custom')
class Custom {
    @Get('/list')
    list(): Promise<CustomListModel> { }

    @Post('/create')
    create<T>(
        @Body() body: CustomCreateBody
    ): Promise<T> { }

    @Delete('/delete')
    delete<T>(
        @Query() params: CustomDeleteParams
    ): Promise<T> { }
}

export const CustomApi = new Custom()
