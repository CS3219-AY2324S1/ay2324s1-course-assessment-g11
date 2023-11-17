import React from "react";

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`scroll-m-20 text-4xl font-black tracking-tight lg:text-5xl leading-normal lg:leading-normal ${className}`}
    >
      {children}
    </div>
  );
}

export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`scroll-m-20 text-3xl font-semibold tracking-tight leading-normal lg:leading-normal ${className}`}
    >
      {children}
    </div>
  );
}

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`scroll-m-20 text-2xl font-semibold tracking-tight leading-normal lg:leading-normal ${className}`}
    >
      {children}
    </div>
  );
}

export function TypographyBody({ children }: { children: React.ReactNode }) {
  return <div className="text-base font-normal leading-snug">{children}</div>;
}

export function TypographyBodyHeavy({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-base font-semibold leading-snug">{children}</div>;
}

export function TypographySmall({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm font-normal leading-tight ${className}`}>
      {children}
    </div>
  );
}

export function TypographySmallHeavy({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-sm font-semibold leading-tight">{children}</div>;
}

export function TypographyBlockquote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic leading-normal lg:leading-normal">
      {children}
    </blockquote>
  );
}

export function TypographyInlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold leading-normal lg:leading-normal">
      {children}
    </code>
  );
}

export function TypographyCode({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-base font-normal">{children}</code>;
}

export function TypographyLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group text-primary text-sm font-semibold leading-tight"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 delay-300 group-hover:delay-0 h-0.5 bg-primary"></span>
    </a>
  );
}
