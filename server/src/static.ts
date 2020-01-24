import { resolve } from 'path'
import Koa from 'koa'
import serve from 'koa-static'

export async function initStaticFiles(app: Koa) {
    app.use(serve(resolve(__dirname, '..', '..', 'client', 'public')))
}
