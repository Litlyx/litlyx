

export function createRequestOptions(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', sign: boolean, body?: Record<string, any>, headers: Record<string, string> = {}) {


    const requestHeaders = sign ? signHeaders(headers) : headers;
    let requestBody;

    if (method === 'POST' || method == 'PUT' || method == 'PATCH') {
        requestBody = body ? JSON.stringify(body) : undefined;
    }

    return {
        method,
        headers: requestHeaders,
        body: requestBody
    }

}
