import dbConnection from '../../../src/database'

export async function getDatabaseDate() {
    const connection = await dbConnection
    const [{ now }] = await connection.query('SELECT now()')

    return new Date(now)
}

export async function resetDatabase() {
    await (await dbConnection).synchronize(true)
}


export async function count(tableName: string)  {
    const connection = await dbConnection
    const [{ count }] = await connection
        .query(`SELECT count(*) :: integer FROM ${tableName}`)

    return count
}

export async function getAll(tableName: string) {
    const connection = await dbConnection
    return connection.query(`SELECT * FROM ${tableName}`)
}
