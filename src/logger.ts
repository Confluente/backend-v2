import bunyan from 'bunyan';

function reqSerializer(req: { connection: any; method: any; url: any; headers: any; }): any {
    if (!req || !req.connection) {
        return req;
    }

    return {
        method: req.method,
        url: req.url,
        headers: req.headers
        // remoteAddress: req.connection.remoteAddress,
        // remotePort: req.connection.remotePort
    };
}

export let log = bunyan.createLogger({
    name: 'gb24Backend',
    serializers: {
        err: bunyan.stdSerializers.err,
        req: reqSerializer
    },
    env: process.env.NODE_ENV
});
