import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const baseUrl = process.env.DEPLOYMENT_URL?.replace(/\/$/, '')
if (!baseUrl) {
  console.error('DEPLOYMENT_URL is missing')
  process.exit(1)
}

const routesDir = join(process.cwd(), 'src', 'routes')
const overrideFile = join(process.cwd(), 'lighthouse-urls.override.txt')

let overrideContents = ''
try {
  overrideContents = readFileSync(overrideFile, 'utf8')
} catch {
  overrideContents = ''
}

if (overrideContents.trim()) {
  const overrideUrls = overrideContents
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('http://') || line.startsWith('https://')) return line
      const normalized = line.startsWith('/') ? line : `/${line}`
      return `${baseUrl}${normalized}`
    })

  writeFileSync('lighthouse-urls.txt', overrideUrls.join('\n') + '\n')
  writeFileSync('lighthouse-skipped.txt', '', 'utf8')
  process.exit(0)
}

const paths = new Set()
const skipped = []

function walk(dir) {
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

const urls = [...paths]
  .sort()
  .map((path) => `${baseUrl}${path}`)

writeFileSync('lighthouse-urls.txt', urls.join('\n') + '\n')
writeFileSync('lighthouse-skipped.txt', skipped.sort().join('\n') + '\n')
