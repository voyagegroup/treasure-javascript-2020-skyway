import * as React from "react";

declare module "react" {
  type FCX<P = unknown> = FunctionComponent<P & { className?: string }>;
}
