import type { Item, Node, Root } from 'fumadocs-core/page-tree';

export type DocLanguage = 'zh' | 'en';

function isEnglishPage(url: string): boolean {
  return /(?:^|\/)[^/]*-EN(?:\/|$)/.test(url);
}

function keepPageByLanguage(url: string, language: DocLanguage): boolean {
  const english = isEnglishPage(url);
  return language === 'en' ? english : !english;
}

function compactSeparators(nodes: Node[]): Node[] {
  const result: Node[] = [];

  for (const node of nodes) {
    const previous = result[result.length - 1];
    if (node.type === 'separator' && (!previous || previous.type === 'separator')) continue;
    result.push(node);
  }

  while (result.length > 0 && result[result.length - 1]?.type === 'separator') {
    result.pop();
  }

  return result;
}

function filterItem(item: Item, language: DocLanguage): Item | null {
  return keepPageByLanguage(item.url, language) ? item : null;
}

function filterNode(node: Node, language: DocLanguage): Node | null {
  if (node.type === 'page') {
    return filterItem(node, language);
  }

  if (node.type === 'separator') {
    return node;
  }

  const index = node.index ? filterItem(node.index, language) : null;
  const children = compactSeparators(
    node.children
      .map((child) => filterNode(child, language))
      .filter((child): child is Node => child !== null),
  );

  if (!index && children.length === 0) {
    return null;
  }

  return {
    ...node,
    index: index ?? undefined,
    children,
  };
}

export function filterPageTreeByLanguage(tree: Root, language: DocLanguage): Root {
  const children = compactSeparators(
    tree.children
      .map((child) => filterNode(child, language))
      .filter((child): child is Node => child !== null),
  );

  return {
    ...tree,
    children,
  };
}
