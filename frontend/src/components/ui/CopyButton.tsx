import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'

type CopyButtonProps = {
  text: string
  label?: string
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-8 px-2.5 text-xs"
      icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      onClick={handleCopy}
    >
      {copied ? 'Copied' : label}
    </Button>
  )
}
