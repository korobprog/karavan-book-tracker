export const routes = {
  root: "/",
  auth: "/auth",
  registration: "/registration",
  profile: "/profile",

  report: "/report",
  reportEdit: (id?: string) => `/report/${id || ":id"}`,

  statistic: "/statistic",
  team: "/team",
  teamEdit: "/team/edit",
};
