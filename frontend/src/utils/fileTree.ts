import type { GithubTreeItem } from '../types/github'

export type FileTreeNode = {
  name: string
  path: string
  type: 'folder' | 'file'
  children: FileTreeNode[]
  file?: GithubTreeItem
}

export function buildFileTree(files: GithubTreeItem[]) {
  const root: FileTreeNode = { name: '', path: '', type: 'folder', children: [] }

  files.forEach((file) => {
    const parts = file.path.split('/')
    let current = root

    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join('/')
      const isFile = index === parts.length - 1
      let node = current.children.find((child) => child.name === part)

      if (!node) {
        node = {
          name: part,
          path,
          type: isFile ? 'file' : 'folder',
          children: [],
          file: isFile ? file : undefined,
        }
        current.children.push(node)
      }

      current = node
    })
  })

  sortTree(root)
  return root.children
}

function sortTree(node: FileTreeNode) {
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  node.children.forEach(sortTree)
}
