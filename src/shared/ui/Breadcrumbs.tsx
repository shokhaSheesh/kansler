import { Breadcrumb } from '@chakra-ui/react'
import { Fragment } from 'react'
import { Link as RouterLink } from 'react-router'

export const Breadcrumbs = ({ items }: { items: Array<{ label: string; to?: string }> }) => (
  <Breadcrumb.Root size="sm">
    <Breadcrumb.List flexWrap="wrap" rowGap="1">
      {items.map((it, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={`${it.label}-${i}`}>
            <Breadcrumb.Item>
              {last || !it.to ? (
                <Breadcrumb.CurrentLink color="fg.default">{it.label}</Breadcrumb.CurrentLink>
              ) : (
                <Breadcrumb.Link asChild color="fg.muted" _hover={{ color: 'fg.default' }}>
                  <RouterLink to={it.to}>{it.label}</RouterLink>
                </Breadcrumb.Link>
              )}
            </Breadcrumb.Item>
            {!last && <Breadcrumb.Separator color="fg.subtle" />}
          </Fragment>
        )
      })}
    </Breadcrumb.List>
  </Breadcrumb.Root>
)
