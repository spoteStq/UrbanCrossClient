import { getBestsellersOrNewPartsFx } from '@/app/api/boilerParts'
import BrandsSlider from '@/components/modules/DashboardPage/BrandsSlider'
import CartAlert from '@/components/modules/DashboardPage/CartAlert'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { $mode } from '@/context/mode'
import { $shoppingCart } from '@/context/shopping-cart'
import styles from '@/styles/dashboard/index.module.scss'
import { IBoilerParts } from '@/types/boilerparts'
import { useStore } from 'effector-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const DashboardPage = () => {
  const [newParts, setNewParts] = useState<IBoilerParts>({} as IBoilerParts)
  const [bestsellers, setBestsellers] = useState<IBoilerParts>(
    {} as IBoilerParts
  )
  const [spinner, setSpinner] = useState(false)
  const shoppingCart = useStore($shoppingCart)
  const [showAlert, setShowAlert] = useState(!!shoppingCart.length)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  useEffect(() => {
    loadBoilerParts()
  }, [])

  useEffect(() => {
    if (shoppingCart.length) {
      setShowAlert(true)
      return
    }

    setShowAlert(false)
  }, [shoppingCart.length])

  const loadBoilerParts = async () => {
    try {
      setSpinner(true)
      const bestsellers = await getBestsellersOrNewPartsFx(
        '/boiler-parts/bestsellers'
      )
      const newParts = await getBestsellersOrNewPartsFx('/boiler-parts/new')

      setBestsellers(bestsellers)
      setNewParts(newParts)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  const closeAlert = () => setShowAlert(false)

  return (
    <section className={styles.dashboard}>
      <div className={`container ${styles.dashboard__container}`}>
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${styles.dashboard__alert} ${darkModeClass}`}
            >
              <CartAlert
                count={shoppingCart.reduce(
                  (defaultCount, item) => defaultCount + item.count,
                  0
                )}
                closeAlert={closeAlert}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.dashboard__brands}>
          <BrandsSlider />
        </div>
        <h2 className={`${styles.dashboard__title} ${darkModeClass}`}>
          Кроссовки
        </h2>
        <div className={styles.dashboard__parts}>
          <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
            Хиты продаж
          </h3>
          <DashboardSlider items={bestsellers.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__parts}>
          <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
            Новинки
          </h3>
          <DashboardSlider items={newParts.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__about}>
          <h3
            className={`${styles.dashboard__parts__title} ${styles.dashboard__about__title} ${darkModeClass}`}
          >
            О компании
          </h3>
          <p className={`${styles.dashboard__about__text} ${darkModeClass}`}>
            Мы - команда энтузиастов, которые разделяют страсть к кроссовкам и
            моде. Наша компания начала свой путь с целью предоставить нашим
            клиентам лучший выбор качественной обуви для спорта, активного
            отдыха и повседневной носки. Мы работаем над тем, чтобы наш
            ассортимент был всегда свежим и разнообразным, чтобы удовлетворить
            запросы каждого нашего клиента. Мы тщательно отбираем бренды и
            модели, уделяя особое внимание качеству материалов, дизайну и
            инновационным технологиям.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
