import { type TextProps, type ViewProps } from "react-native";
import type { PropsWithChildren, ReactElement } from "react";

export interface GlassCardProps extends ViewProps {
  intensity?: number;
  className?: string;
  variant?: "light" | "dark";
}

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export type ParallaxScrollViewProps = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export interface FeatureCardProps {
  icon?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  meta?: string[];
  delay?: number;
}

export type ExternalLinkProps = Omit<
  import("react").ComponentProps<typeof import("expo-router").Link>,
  "href"
> & { href: import("expo-router").Href & string };
