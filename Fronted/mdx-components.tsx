import { type MDXComponents } from 'mdx/types'

import * as mdxComponents from '@/components/login/mdx'

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents,
  }
}
