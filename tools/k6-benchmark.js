import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 }, // Ramp up to 50 users over 30 seconds
        { duration: '1m', target: 50 }, // Stay at 50 users for 1 minute
        { duration: '30s', target: 0 },  // Ramp down to 0 users over 30 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
        http_req_failed: ['rate<0.01'],   // Failure rate should be below 1%
    },
};

const endpoint = 'http://localhost:5173/';

export default function () {
    const res = http.get(endpoint);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is below 200ms': (r) => r.timings.duration < 200,
    });
    sleep(1);
}
