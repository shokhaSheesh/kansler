import { Breadcrumb, Flex, Separator } from '@chakra-ui/react'
import { Fragment } from 'react'
import { Link as RouterLink } from 'react-router'
import { BackButton } from './BackButton'

interface BreadcrumbsProps {
  items: Array<{ label: string; to?: string }>
  /** Shows "Назад" before the trail; the value is where it goes when there is no in-site history. */
  back?: string
}

export const Breadcrumbs = ({ items, back }: BreadcrumbsProps) =>
  back ? (
    <Flex align="center" gap="3" minH="32px">
      <BackButton fallback={back} />
      {/* Phones: the back button replaces the trail */}
      <Separator orientation="vertical" h="16px" borderColor="border.default" hideBelow="md" />
      <Flex hideBelow="md" minW="0">
        <Trail items={items} />
      </Flex>
    </Flex>
  ) : (
    <Trail items={items} />
  )

const Trail = ({ items }: Pick<BreadcrumbsProps, 'items'>) => (
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
