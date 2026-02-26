import { source } from '@/lib/source';
import { filterPageTreeByLanguage } from '@/lib/page-tree';
import { DocsLayoutClient } from '@/components/docs-layout-client';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  const treeZh = filterPageTreeByLanguage(tree, 'zh');
  const treeEn = filterPageTreeByLanguage(tree, 'en');

  return (
    <DocsLayoutClient treeZh={treeZh} treeEn={treeEn}>
      {children}
    </DocsLayoutClient>
  );
}
