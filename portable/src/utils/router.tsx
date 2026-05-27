import { JSX } from "preact/jsx-runtime";

export interface PageProps {
  forwarded: string[];
}

export interface LayoutProps {
  forwarded?: string[];
  dynamic?: string;
  children?: JSX.Element;
}

type LayoutComponent = (props: LayoutProps) => JSX.Element;
type PageComponent = (props: PageProps) => JSX.Element;
type Routes = { [path: string]: PageComponent };

export function useRouter(
  forwarded: string[],
  Layout: LayoutComponent,
  routes: Routes
) {
  const path = forwarded[0];
  const Page = routes[path];
  
  if (!Page)
    return <Layout
      dynamic={path}
      forwarded={forwarded.slice(1)}
    />

  return <Layout>
    <Page forwarded={forwarded.slice(1)} />
  </Layout>
}

