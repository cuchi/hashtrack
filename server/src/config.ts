import { env } from 'process'

export default {
    port: Number(env.PORT) || 8080
}
