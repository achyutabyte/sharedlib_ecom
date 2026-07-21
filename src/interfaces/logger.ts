import winston, { Logger } from 'winston';
import { ElasticsearchTransport, ElasticsearchTransportOptions, LogData, Transformer } from 'winston-elasticsearch';

const esTransformer: Transformer = (logData: LogData) => {
  return {
    '@timestamp': logData.timestamp ? logData.timestamp : new Date().toISOString(),
    severity: logData.level,
    message: logData.message,
    fields: logData.meta,
  };
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
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch as unknown as ElasticsearchTransportOptions);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}
