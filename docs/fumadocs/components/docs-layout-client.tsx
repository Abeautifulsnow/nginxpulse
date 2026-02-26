'use client';

import { baseOptions } from '@/lib/layout.shared';
import type { Root } from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type DocsLayoutClientProps = {
  children: ReactNode;
  treeZh: Root;
  treeEn: Root;
};

function isEnglishDocsPath(pathname: string): boolean {
  return /\/docs\/.*-EN(?:\/|$)/.test(pathname);
}

export function DocsLayoutClient({ children, treeZh, treeEn }: DocsLayoutClientProps) {
  const pathname = usePathname() ?? '';
  const tree = isEnglishDocsPath(pathname) ? treeEn : treeZh;

  return (
    <DocsLayout tree={tree} sidebar={{ tabs: {} }} {...baseOptions({ includeMainLinks: false })}>
      {children}
    </DocsLayout>
  );
}
