export const routeAccess = [
  {
    path: "/admin",
    roles: ["admin"],
    redirect: "/",
  },
  {
    path: "/auth",
    guestOnly: true,
    redirect: "/",
  },
]
