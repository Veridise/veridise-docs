import React from "react";
import { useLocation } from "@docusaurus/router";
import NavBarItem from "@theme-original/NavbarItem";

export default function CustomNavbarItem(props) {
  const { docsPluginId, type } = props;
  const { pathname } = useLocation();

  // Skip rendering version dropdown if the declared component does not match
  // the current route
  if (
    type === "docsVersionDropdown" &&
    pathname.search(new RegExp(`^/${docsPluginId}/`, "g")) === -1
  ) {
    return null;
  }

  return (
    <>
      <NavBarItem {...props} />
    </>
  );
}
