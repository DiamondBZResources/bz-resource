import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(scriptDirectory, '..')
const sourceRoot = path.resolve(clientRoot, 'image-sources')
const outputRoot = path.resolve(clientRoot, 'src/assets/generated')
const manifestPath = path.join(outputRoot, '.image-manifest.json')
const checkOnly = process.argv.includes('--check')

if (outputRoot !== path.resolve(clientRoot, 'src/assets/generated')) {
  throw new Error('Refusing to write outside the generated image directory.')
}

const jobs = [
  { id: 'brand-logo', input: 'BZ-Logo-transparent.png', kind: 'logo', widths: [64, 142, 203] },
  { id: 'hero-staffing', input: 'satisfyAllYourStaffing.jpg', kind: 'photo', widths: [480, 768, 1024, 1440, 1920] },
  { id: 'large-main', input: 'largeImageForMain.jpg', kind: 'photo', widths: [480, 768, 1024, 1440, 1920] },
  { id: 'recruitment', input: 'Recruitment.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'screening', input: 'screening.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'training', input: 'training.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'tracking', input: 'tracking.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'payroll', input: 'payroll.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'workers-comp', input: 'workersComp.jpg', kind: 'photo', widths: [480, 768, 1024, 1440] },
  { id: 'nwboc-certificate', input: 'NWBOCCertifwomenowned.jpg', kind: 'webp-graphic', widths: [480, 768, 1024, 1440] },
  { id: 'nwboc-logo', input: 'NWBOC-Logo-480x191.webp', kind: 'webp-graphic', widths: [240, 480] },
  { id: 'about-team', input: 'site/about-us-pg-sec-img.jpg', kind: 'photo', widths: [480, 750] },
  { id: 'brand-lockup', input: 'site/meet-owner-veronica-lake.png', kind: 'png', widths: [541] },
  { id: 'industry', input: 'site/industry-scaled.jpeg', kind: 'photo', widths: [480, 768, 1024, 1440, 1920] },
  { id: 'brochure-outside', input: 'site/BZR-Outside-Brochure_page-0001.jpg', kind: 'document', widths: [480, 768, 1024, 1440] },
  { id: 'brochure-inside', input: 'site/BZR-Inside-Brochure_page-0001.jpg', kind: 'document', widths: [480, 768, 1024, 1440] },
  { id: 'blog-mid-year', input: 'blog/mid-year-hiring-florida.webp', kind: 'photo', widths: [400] },
  { id: 'blog-florida-market', input: 'blog/florida-job-market-2026.png', kind: 'document', widths: [400] },
  { id: 'blog-connecting', input: 'blog/connecting-talent-opportunity.jpeg', kind: 'photo', widths: [400] },
  { id: 'blog-social-network', input: 'blog/social-network-talent-pool.jpeg', kind: 'photo', widths: [400] },
  { id: 'blog-navigating', input: 'blog/navigating-staffing.jpeg', kind: 'photo', widths: [400] },
  { id: 'blog-transitioning', input: 'blog/transitioning-success.png', kind: 'document', widths: [400] },
  { id: 'blog-job-ads', input: 'blog/create-job-ads.jpg', kind: 'photo', widths: [480, 768] },
  { id: 'blog-staffing-simple', input: 'blog/staffing-made-simple.jpg', kind: 'photo', widths: [400] },
]

const configSignature = crypto
  .createHash('sha256')
  .update(JSON.stringify({ jobs, sharp: sharp.versions.sharp, version: 2 }))
  .digest('hex')

async function sha256(filePath) {
  return crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')
}

async function getSourceState() {
  const sourceHashes = {}
  for (const job of jobs) {
    sourceHashes[job.input] = await sha256(path.join(sourceRoot, job.input))
  }
  return sourceHashes
}

async function checkGeneratedImages() {
  let manifest
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  } catch {
    throw new Error('Optimized images are missing. Run npm run images:optimize.')
  }

  const sourceHashes = await getSourceState()
  if (
    manifest.configSignature !== configSignature ||
    JSON.stringify(manifest.sourceHashes) !== JSON.stringify(sourceHashes)
  ) {
    throw new Error('Image sources or settings changed. Run npm run images:optimize.')
  }

  for (const relativePath of manifest.generatedFiles) {
    await fs.access(path.join(outputRoot, relativePath))
  }
  await fs.access(path.join(clientRoot, 'public/favicon.png'))
  console.log(`Verified ${manifest.generatedFiles.length} generated files and the public favicon.`)
}

function fallbackFormat(job, sourceFormat) {
  if (job.kind === 'logo' || job.kind === 'png') return 'png'
  if (job.kind === 'webp-graphic') return 'webp'
  if (job.kind === 'document' && sourceFormat === 'png') return 'png'
  return 'jpg'
}

function formatsFor(job, sourceFormat) {
  const fallback = fallbackFormat(job, sourceFormat)
  if (job.kind === 'logo') return ['webp', fallback]
  if (job.kind === 'png') return [fallback]
  if (job.kind === 'webp-graphic') return ['webp']
  return ['avif', 'webp', fallback]
}

function encoder(pipeline, format, kind) {
  if (format === 'avif') {
    return pipeline.avif({ effort: 5, quality: kind === 'document' ? 66 : 60 })
  }
  if (format === 'webp') {
    if (kind === 'logo') return pipeline.webp({ effort: 6, lossless: true })
    return pipeline.webp({ effort: 5, quality: kind === 'document' || kind === 'webp-graphic' ? 88 : 80 })
  }
  if (format === 'png') {
    return pipeline.png({ adaptiveFiltering: true, compressionLevel: 9 })
  }
  return pipeline.jpeg({ chromaSubsampling: '4:4:4', mozjpeg: true, quality: kind === 'document' ? 88 : 82 })
}

function variableName(format, width) {
  return `${format.replace(/[^a-z0-9]/gi, '')}${width}`
}

function moduleSource(job, metadata, variants, fallback) {
  const imports = variants
    .map((variant) => `import ${variableName(variant.format, variant.width)} from './${variant.file}'`)
    .join('\n')
  const arrayFor = (format) => variants
    .filter((variant) => variant.format === format)
    .map((variant) => `{ src: ${variableName(variant.format, variant.width)}, width: ${variant.width} }`)
    .join(', ')
  const fallbackVariants = variants.filter((variant) => variant.format === fallback)
  const fallbackSource = fallbackVariants.at(-1)

  return `${imports}\nimport type { ResponsiveImageSource } from '../../../components/ResponsiveImage'\n\nconst image = {\n  width: ${metadata.width},\n  height: ${metadata.height},\n  avif: [${arrayFor('avif')}],\n  webp: [${arrayFor('webp')}],\n  fallback: ${variableName(fallbackSource.format, fallbackSource.width)},\n  fallbackSrcSet: [${arrayFor(fallback)}],\n} satisfies ResponsiveImageSource\n\nexport default image\n`
}

async function optimize() {
  await fs.rm(outputRoot, { force: true, recursive: true })
  await fs.mkdir(outputRoot, { recursive: true })

  const generatedFiles = []
  let optimizedBytes = 0
  let sourceBytes = 0

  for (const job of jobs) {
    const inputPath = path.join(sourceRoot, job.input)
    const metadata = await sharp(inputPath).metadata()
    if (!metadata.width || !metadata.height || !metadata.format) {
      throw new Error(`Could not read image dimensions for ${job.input}.`)
    }

    sourceBytes += (await fs.stat(inputPath)).size
    const widths = [...new Set(job.widths.filter((width) => width <= metadata.width))]
    if (widths.length === 0) widths.push(metadata.width)
    const formats = [...new Set(formatsFor(job, metadata.format))]
    const outputDirectory = path.join(outputRoot, job.id)
    await fs.mkdir(outputDirectory, { recursive: true })
    const variants = []

    for (const width of widths) {
      for (const format of formats) {
        const extension = format === 'jpg' ? 'jpg' : format
        const file = `${job.id}-${width}.${extension}`
        const outputPath = path.join(outputDirectory, file)
        if ((job.kind === 'logo' || job.kind === 'png') && format === 'png' && width === metadata.width) {
          await fs.copyFile(inputPath, outputPath)
        } else {
          const pipeline = sharp(inputPath)
            .rotate()
            .resize({ fit: 'inside', withoutEnlargement: true, width })
          await encoder(pipeline, format, job.kind).toFile(outputPath)
        }
        optimizedBytes += (await fs.stat(outputPath)).size
        generatedFiles.push(`${job.id}/${file}`)
        variants.push({ file, format, width })
      }
    }

    const fallback = fallbackFormat(job, metadata.format)
    const modulePath = path.join(outputDirectory, 'index.ts')
    await fs.writeFile(modulePath, moduleSource(job, metadata, variants, fallback))
    generatedFiles.push(`${job.id}/index.ts`)
  }

  const logoSource = path.join(sourceRoot, 'BZ-Logo-transparent.png')
  await sharp(logoSource)
    .rotate()
    .resize(96, 96, { fit: 'contain' })
    .png({ adaptiveFiltering: true, compressionLevel: 9 })
    .toFile(path.join(clientRoot, 'public/favicon.png'))

  const sourceHashes = await getSourceState()
  const report = {
    configSignature,
    generatedFiles,
    optimizedBytes,
    sourceBytes,
    sourceHashes,
  }
  await fs.writeFile(manifestPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Optimized ${jobs.length} source images into ${generatedFiles.length - jobs.length} responsive files.`)
  console.log(`Source bytes: ${sourceBytes}; generated responsive bytes: ${optimizedBytes}.`)
}

if (checkOnly) await checkGeneratedImages()
else await optimize()
