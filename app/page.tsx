'use client'

import { useRef, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileImage,
  Info,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'


type Status = 'match' | 'variation' | 'incorrect'

type Field = {
  label: string
  extracted: string
  application: string
  status: Status
}

const demoFields: Field[] = [
  { label: 'Brand Name', extracted: 'River Bend Reserve', application: 'River Bend Reserve', status: 'match' },
  { label: 'ABV', extracted: '13.5% alc. by vol.', application: '13.5% Alcohol by Volume', status: 'variation' },
  { label: 'Net Contents', extracted: '750 mL', application: '750 mL', status: 'match' },
  { label: 'Government Warning', extracted: 'GOVERNMENT WARNING: (1) According to the Surgeon General...', application: 'GOVERNMENT WARNING: (1) According to the Surgeon General...', status: 'match' },
]

const statusCopy: Record<Status, { label: string; className: string }> = {
  match: { label: 'Match', className: 'status-match' },
  variation: { label: 'Minor case variation', className: 'status-variation' },
  incorrect: { label: 'Missing / incorrect', className: 'status-incorrect' },
}

function StatusBadge({ status }: { status: Status }) {
  const copy = statusCopy[status]
  return (
    <span className={`status-badge ${copy.className}`}>
      {status === 'match' ? <Check data-icon="inline-start" /> : status === 'variation' ? <Info data-icon="inline-start" /> : <AlertCircle data-icon="inline-start" />}
      {copy.label}
    </span>
  )
}

export default function Page() {
  const [fields, setFields] = useState<Field[]>([])
  const [fileName, setFileName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const hasData = fields.length > 0

  function loadDemo() {
    setFields(demoFields)
    setFileName('river-bend-reserve-front.jpg')
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setFileName(files.length === 1 ? files[0].name : `${files.length} label images selected`)
    setFields(demoFields)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="brand-mark" aria-hidden="true"><ShieldCheck /></div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">TTB Treasury</p>
              <h1 className="text-xl font-bold tracking-tight">COLA Label Verification</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><span className="online-dot" /> Verification workspace</div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-9 max-w-3xl">
          <p className="eyebrow">Label review tool</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Verify a label against its COLA application.</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Upload a label image to compare the text on the label with the approved application. Results are organized by field for a quick, confident review.</p>
        </div>

        <section className="upload-panel" aria-labelledby="upload-heading">
          <div>
            <p className="eyebrow">Step 1</p>
            <h3 id="upload-heading" className="mt-1 text-2xl font-bold tracking-tight">Upload label images</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use one image for a single review or select multiple images for a batch review.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
            <button className="primary-button" onClick={() => inputRef.current?.click()}><Upload data-icon="inline-start" /> Choose label image(s)</button>
            <button className="secondary-button" onClick={loadDemo}><FileCheck2 data-icon="inline-start" /> Load sample demo data</button>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>{fileName ? <><strong className="text-foreground">Ready to review:</strong> {fileName}</> : 'Accepted formats: JPG, PNG, or TIFF. Maximum 20 MB per image.'}</span>
            {fileName && <button aria-label="Clear selected image" className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => { setFileName(''); setFields([]) }}><X /></button>}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="comparison-heading">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="eyebrow">Step 2</p><h3 id="comparison-heading" className="mt-1 text-2xl font-bold tracking-tight">Review comparison</h3></div>
            {hasData && <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><CheckCircle2 className="text-primary" /> 3 of 4 fields match</div>}
          </div>

          {!hasData ? (
            <div className="empty-panel"><div className="empty-icon"><FileImage /></div><h4 className="mt-4 text-lg font-bold">No label uploaded yet</h4><p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Upload a label image above or load the sample demo data to see a side-by-side comparison.</p><button className="secondary-button mt-5" onClick={loadDemo}>View sample comparison <ChevronRight data-icon="inline-end" /></button></div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="comparison-header grid grid-cols-[1.05fr_1fr_1fr_auto] gap-5 px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-7"><div>Field</div><div>Label image</div><div>COLA application</div><div className="text-right">Status</div></div>
              <div className="divide-y divide-border">
                {fields.map((field) => <div key={field.label} className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-[1.05fr_1fr_1fr_auto] sm:items-center sm:gap-5 sm:px-7"><div className="font-semibold">{field.label}</div><div className="text-sm leading-relaxed text-foreground">{field.extracted}</div><div className="text-sm leading-relaxed text-muted-foreground">{field.application}</div><div className="sm:text-right"><StatusBadge status={field.status} /></div></div>)}
              </div>
              <div className="flex items-start gap-3 border-t border-border bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-7"><Info className="mt-0.5 shrink-0 text-primary" /><span>Case-only differences are flagged for review but do not automatically indicate a labeling error.</span></div>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">For internal TTB Treasury use. Always use the official COLA application and applicable regulations for final determination.</footer>
      </div>
    </main>
  )
}
