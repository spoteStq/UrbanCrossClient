import Layout from "@/components/layout/Layout";
import CatalogPage from "@/components/templates/CatalogPage/CatalogPage";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { IQueryParams } from "@/types/catalog";
import Head from "next/head";

function Catalog({ query }: { query: IQueryParams}) {
  const { shouldLoadContent } = useRedirectByUserCheck()
  
  return (
    <>
      <Head>
        <title>UrbanCross | {shouldLoadContent ? 'Каталог' : ''}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      {shouldLoadContent && (
        <Layout>
        <main>
            <CatalogPage query={query} />
          <div className="overlay" />
        </main>
        </Layout>
      )}
    </>
  );
}

export async function getServerSideProps(context: { query: IQueryParams}) {
  return{
    props: { query: { ...context.query } },
  }
}

export default Catalog
