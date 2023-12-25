export const getViewTransitionStyles = (name?: string) =>
  name
    ? {
        viewTransitionName: name,
        contain: "layout",
      }
    : {};
