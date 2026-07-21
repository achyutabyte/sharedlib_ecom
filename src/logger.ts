import winston, { log, Logger } from "winston";

import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from "winston-elasticsearch";

const esTransformer = (logData: LogData): TransformedData => {
    return ElasticsearchTransformer(logData);

}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
    const options = {
        console: {
            level,
            handleExceptions: true,
            json: false,
            colorize: true
        },
        elasticsearch: {
            level,
            transformer: esTransformer,
            clientOptions: {
                node: elasticsearchNode,
                log: level,
                maxRetries: 2,
                requestTimeOut: 10000,
                sniffOnStart: false,
            }
        }
    };

    const eTransports: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);

    const logger: Logger = winston.createLogger({
        level,
        defaultMeta: { service: name },
        transports: [new winston.transports.Console(options.console), eTransports],
        exceptionHandlers: [new winston.transports.Console(options.console), eTransports],
        exitOnError: false,
    });

    return logger;

}
