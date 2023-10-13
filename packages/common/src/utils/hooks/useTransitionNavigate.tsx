import { useCallback } from "react";
import { useNavigate, To, NavigateOptions } from "react-router-dom";
import { flushSync } from "react-dom";

export const useTransitionNavigate = () => {
  const navigate = useNavigate();

  const transitionNavigate = useCallback(
    (to: To, options?: NavigateOptions) => {
      // @ts-ignore
      if (!document.startViewTransition) {
        navigate(to, options);
      } else {
        // @ts-ignore
        document.startViewTransition(() => {
          flushSync(() => {
            navigate(to, options);
          });
        });
      }
    },
    [navigate]
  );

  return transitionNavigate;
};
