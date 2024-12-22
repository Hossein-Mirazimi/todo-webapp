import { AxiosResponse } from 'axios';
import { fetchClient } from './../utils/client';

export interface EndpointOptions {
    fullResponse?: boolean;
}

export function endpoint<P, U>(
    fn: (
        client: typeof fetchClient,
        parameters: P,
        options?: EndpointOptions
    ) => | Promise<U>
) {
    return (parameters: P, options?: EndpointOptions) => {
        const allOptions: EndpointOptions = { fullResponse: false, ...options };
        return fn(fetchClient, parameters, options).then(res =>
            allOptions.fullResponse ? res : (res as AxiosResponse<U>).data
        );
    };
}
