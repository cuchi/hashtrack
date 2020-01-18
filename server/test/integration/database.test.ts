import { describe, it } from "mocha"
import { expect } from 'chai'
import dbConnection from '../../src/database'

describe('Database', () => {
    it('Should connect to the database', async () => {
        await expect(dbConnection).to.be.fulfilled
    })
})
