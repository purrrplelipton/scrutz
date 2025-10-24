import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    route("new-campaign", "routes/new-campaign.tsx"),
    index("routes/overview.tsx"),
    route("campaign", "routes/campaign.tsx"),
    route("campaign/:id", "routes/campaign.$id.tsx"),
    route("campaign/:id/edit", "routes/campaign.$id.edit.tsx"),
  ]),
] satisfies RouteConfig;
