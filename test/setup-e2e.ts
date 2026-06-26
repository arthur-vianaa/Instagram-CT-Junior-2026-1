import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID, generateKeyPairSync } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// ✅ Generate a real RSA key pair — no placeholders, no mocks needed
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

// ✅ Store as base64 — matches what AuthModule does: Buffer.from(key, 'base64')
process.env.JWT_PRIVATE_KEY = Buffer.from(privateKey).toString('base64')
process.env.JWT_PUBLIC_KEY = Buffer.from(publicKey).toString('base64')

const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const databaseURL = generateUniqueDatabaseURL(schemaId)
process.env.DATABASE_URL = databaseURL

console.log('TEST DATABASE_URL:', databaseURL)

beforeAll(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`)
  await pool.end()
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  const pool = new Pool({ connectionString: databaseURL })
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool, { schema: schemaId }),
  })
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})