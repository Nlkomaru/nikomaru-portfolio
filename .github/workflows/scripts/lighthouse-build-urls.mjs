import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const baseUrl = process.env.DEPLOYMENT_URL?.replace(/\/$/, '')
if (!baseUrl) {
  console.error('DEPLOYMENT_URL is missing')
  process.exit(1)
}

const routesDir = join(process.cwd(), 'src', 'routes')
const extraPathsFile = join(
  process.cwd(),
  '.github',
  'workflows',
  'config',
  'lighthouse-extra-paths.txt',
)

const paths = new Set()
const skipped = []

function walk(dir) {
  const relDir = relative(routesDir, dir)
  const segments = relDir === '' ? [] : relDir.split(/[\\/]/)
  if (segments.some((segment) => segment.startsWith('-'))) {
    return
  }

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stats = statSync(full)
    if (stats.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.endsWith('.tsx')) continue
    if (entry.startsWith('__')) continue

    const rel = relative(routesDir, full)
    const routePath = rel
      .replace(/\\/g, '/')
      .replace(/\.tsx$/, '')
      .replace(/\/index$/, '/')

    if (routePath.includes('$') || routePath.includes('[')) {
      skipped.push(routePath)
      continue
    }

    const normalized =
      routePath === 'index' ? '/' : `/${routePath}`.replace(/\/{2,}/g, '/')
    paths.add(normalized)
  }
}

walk(routesDir)

let extraPathContents = ''
try {
  extraPathContents = readFileSync(extraPathsFile, 'utf8')
} catch {
  extraPathContents = ''
}

for (const line of extraPathContents.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  paths.add(normalized.replace(/\/{2,}/g, '/'))
}

const urls = [...paths]
  .sort()
  .map((path) => `${baseUrl}${path}`)

writeFileSync('lighthouse-urls.txt', urls.join('\n') + '\n')
writeFileSync('lighthouse-skipped.txt', skipped.sort().join('\n') + '\n')
