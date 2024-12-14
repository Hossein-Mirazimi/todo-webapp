import axios from 'axios';
import { performance } from 'perf_hooks';

const endpoint: string = 'http://localhost:5173/isr';
const totalRequests: number = 1000;

async function benchmark(): Promise<void> {
    const startTime: number = performance.now();

    // Create an array of promises for the requests
    const requests: Promise<any>[] = Array.from({ length: totalRequests }, () => axios.get(endpoint));

    // Await all requests to finish
    await Promise.all(requests);

    const endTime: number = performance.now();

    // Calculate and log results
    console.log(`Completed ${totalRequests} requests in ${(endTime - startTime) / 1000} seconds`);
    console.log(`Requests per second: ${totalRequests / ((endTime - startTime) / 1000)}`);
}

benchmark().catch((error: Error) => console.error(error));