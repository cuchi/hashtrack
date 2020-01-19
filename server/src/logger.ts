import winston from 'winston'
import config from './config'

const log = winston.createLogger({
    level: config.logLevel,
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console()
    ]
})

export default log
