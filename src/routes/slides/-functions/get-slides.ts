import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import type { Slide } from '../-types/slide'

function buildR2Headers(): Headers {
  const headers = new Headers()
  headers.append('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID)
  headers.append('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET)
  return headers
}

async function fetchImageAsBase64(id: string): Promise<string> {
  const res = await fetch(`${env.R2_PUBLIC_URL}${id}/picture/1.png`, {
    headers: buildR2Headers(),
  })

  const blob = await res.blob()
  const buffer = await blob.arrayBuffer()
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

// R2からスライド一覧を取得し、公開・下書きスライドのメタデータとサムネイルを返す
export const getSlides = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
      headers: buildR2Headers(),
      cache: 'no-store',
    })

    const data = (await res.json()) as Array<{
      id: string
      title: string
      lastUpdated: string
      type: 'draft' | 'public' | 'private'
    }>

    const slides: Slide[] = []

    // private除外、UUIDでないIDのみ対象
    for (const v of data
      .filter((v) => v.type !== 'private')
      .filter((v) => v.id.length !== 36)) {
      const image = await fetchImageAsBase64(v.id)
      slides.push({
        id: v.id,
        title: v.title,
        image,
        lastUpdate: v.lastUpdated,
        link: `/slide/${v.id}`,
        type: v.type,
      })
    }

    return slides
  },
)
