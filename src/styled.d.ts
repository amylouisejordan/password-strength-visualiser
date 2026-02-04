import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;

    accent: string;
    accentStrong: string;
    accentLight: string;

    radius: string;
    shadow: string;
    transition: string;
  }
}
