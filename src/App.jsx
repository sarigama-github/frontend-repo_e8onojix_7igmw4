import CatalogPage from './pages/Catalog'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout showHero>
      <section id="catalog" className="relative z-10 -mt-12 md:-mt-24">
        <CatalogPage />
      </section>
    </Layout>
  )
}
