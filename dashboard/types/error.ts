


export type FetchResponseError = GenericError & {
    name: string,
    data: {
        error: boolean,
        message: string,
        stack: string[],
        statusCode: number,
        statusMessage: string,
        url: string
    },
    statusCode: number,
    statusMessage: string,
    statusText: string
}

export type GenericError = {
    name?: string,
    message: string,
    stack: string,
}