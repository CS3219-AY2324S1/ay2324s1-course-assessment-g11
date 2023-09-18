
export function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-black tracking-tight lg:text-5xl leading-normal lg:leading-normal">
      {children}
    </h1>
  )
}

export function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 leading-normal lg:leading-normal">
      {children}
    </h2>
  )
}

export function TypographyH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight leading-normal lg:leading-normal">
      {children}
    </h3>
  )
}

export function TypographyBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-normal leading-snug">
      {children}
    </p>
  )
}

export function TypographyBodyHeavy({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-semibold leading-snug">
      {children}
    </p>
  )
}

export function TypographySmall({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-normal leading-tight">
      {children}
    </small>
  )
}

export function TypographySmallHeavy({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-semibold leading-tight">
      {children}
    </small>
  )
}

export function TypographyBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic leading-normal lg:leading-normal">
      {children}
    </blockquote>
  )
}

export function TypographyInlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold leading-normal lg:leading-normal">
      {children}
    </code>
  )
}

export function TypographyCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-base font-normal">
      {children}
    </code>
  )
}
