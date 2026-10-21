import { Box, Grid, Separator, Stack, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router";
import {
  Bell,
  Building2,
  CircleHelp,
  CreditCard,
  Landmark,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";
import { paths } from "@/app/router/paths";
import { authStore } from "@/stores/auth.store";
import { tintedPanel } from "@/shared/ui/surface";

/** Account area: sticky side nav on desktop, horizontal scroll tabs on mobile. Ref: Contra / Mercury settings. */
export const ProfileLayout = () => {
  const { t } = useTranslation();
  const p = paths.profile;
  // Same items and order as the live profile menu
  const items = [
    { to: p.user, icon: User, label: t("profile.personal_info_title") },
    { to: p.details, icon: Building2, label: t("profile.company_data") },
    { to: paths.orders, icon: Package, label: t("profile.orders") },
    { to: p.address, icon: MapPin, label: t("profile.address") },
    { to: p.cards, icon: CreditCard, label: t("profile.cards") },
    { to: p.recipient, icon: Users, label: t("profile.recipient") },
    { to: p.comments, icon: MessageSquare, label: t("profile.reviews") },
    {
      to: p.businessAccount,
      icon: Landmark,
      label: t("profile.business_account"),
    },
    { to: paths.notifications, icon: Bell, label: t("profile.notifications") },
    {
      to: p.settings,
      icon: Settings,
      label: t("profile.settings"),
      divider: true,
    },
    { to: p.info, icon: CircleHelp, label: t("profile.help_center") },
  ];

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "260px 1fr" }}
      gap={{ base: 4, lg: 6 }}
      alignItems="start"
    >
      <Box
        as="nav"
        {...tintedPanel}
        p="2"
        pos={{ lg: "sticky" }}
        top={{ lg: "128px" }}
        overflowX={{ base: "auto", lg: "visible" }}
      >
        <Stack direction={{ base: "row", lg: "column" }} gap="1">
          {items.map(({ to, icon: Icon, label, divider }) => (
            <Fragment key={to}>
              {divider && (
                <Separator
                  borderColor="border.default"
                  my="1"
                  mx="3"
                  hideBelow="lg"
                />
              )}
              <NavLink to={to}>
                {({ isActive }) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="3"
                    px="3"
                    py="2.5"
                    borderRadius="primary"
                    whiteSpace="nowrap"
                    fontSize="sm"
                    fontWeight={isActive ? "600" : "500"}
                    bg={isActive ? "bg.surface" : "transparent"}
                    boxShadow={isActive ? "panel" : undefined}
                    color={isActive ? "fg.default" : "fg.muted"}
                    _hover={{ bg: "bg.surface" }}
                  >
                    <Icon size={18} />
                    {label}
                  </Box>
                )}
              </NavLink>
            </Fragment>
          ))}
          <Box
            as="button"
            display="flex"
            alignItems="center"
            gap="3"
            px="3"
            py="2.5"
            borderRadius="primary"
            fontSize="sm"
            fontWeight="500"
            color="fg.discount"
            _hover={{ bg: "primary.50" }}
            onClick={() => authStore.logout()}
          >
            <LogOut size={18} />
            <Text>{t("auth.logout", "Выйти")}</Text>
          </Box>
        </Stack>
      </Box>
      <Box minW="0">
        <Outlet />
      </Box>
    </Grid>
  );
};
