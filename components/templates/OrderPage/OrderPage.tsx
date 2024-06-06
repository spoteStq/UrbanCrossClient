import { checkPaymentFx, makePaymentFx } from '@/app/api/payment'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import OrderAccordion from '@/components/modules/OrderPage/OrderAccordion'
import { $mode } from '@/context/mode'
import { $shoppingCart, $totalPrice, setShoppingCart } from '@/context/shopping-cart'
import { $user } from '@/context/user'
import styles from '@/styles/order/index.module.scss'
import { formatPrice } from '@/utils/common'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import spinnerStyles from '@/styles/spinner/index.module.scss';

const OrderPage = () => {
    const mode = useStore($mode)
    const user = useStore($user)
    const shoppingCart = useStore($shoppingCart)
    const totalPrice = useStore($totalPrice)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const [orderIsReady, setOrderIsReady] = useState(false)
    const [agreement, setAgreement] = useState(false)
    const spinner = useStore(makePaymentFx.pending)
    const router = useRouter()

    const handleAgreementChange = () => setAgreement(!agreement)

    useEffect(() => {
        const paymentId = sessionStorage.getItem('paymentId')

        if (paymentId) {
            checkPayment(paymentId)
        }
    }, [])

    const makePay = async () => {
        try {
            const data = await makePaymentFx({
                url: '/payment/info',
                amount: totalPrice
            })
            sessionStorage.setItem('paymentId', data.id)

            router.push(data.confirmation.confirmation_url)

            await removeFromCartFx(`/shopping-cart/all/${user.userId}`)
            setShoppingCart([])
        } catch (error) {
            toast.error((error as Error).message)
            sessionStorage.removeItem('paymentId')
        }
    }

    const checkPayment = async (paymentId: string) => {
        try {
            const data = await checkPaymentFx({
                url: '/payment',
                paymentId,
            })

            if (data.status === 'succeeded') {
                resetCart()
            }
        } catch (error) {
            console.log((error as Error).message)
            resetCart()
        }
    }

    const resetCart = async () => {
        sessionStorage.removeItem('paymentId')
        await removeFromCartFx(`/shopping-cart/all/${user.userId}`)
        setShoppingCart([])
    }

    return (
        <section className={styles.order}>
            <div className='container'>
                <h2 className={`${styles.order__title} ${darkModeClass}`}>
                    Оформление заказа
                </h2>
                <div className={styles.order__inner}>
                    <div className={styles.order__cart}>
                        <OrderAccordion setOrderIsReady={setOrderIsReady} showDoneIcon={orderIsReady} />
                    </div>
                    <div className={styles.order__pay}>
                        <h3 className={`${styles.order__pay__title} ${darkModeClass}`}>
                            Итого
                        </h3>
                        <div className={`${styles.order__pay__inner} ${darkModeClass}`}>
                            <div className={styles.order__pay__goods}>
                                <span>Товары (
                                    {shoppingCart.reduce(
                                        (defaultCount, item) => defaultCount + item.count,
                                        0
                                    )}
                                    )
                                </span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className={styles.order__pay__total}>
                                <span>На сумму</span>
                                <span className={darkModeClass}>
                                    {formatPrice(totalPrice)} P
                                </span>
                            </div>
                            <button
                                disabled={!(orderIsReady && agreement)}
                                className={styles.order__pay__btn}
                                onClick={makePay}
                            >
                                {spinner ? (
                                    <span
                                        className={spinnerStyles.spinner}
                                        style={{ top: '6px', left: '47%' }}
                                    />
                                ) : (
                                    'Подтвердить заказ'
                                )}
                            </button>
                            <label
                                className={`${styles.order__pay__rights} ${darkModeClass}`}
                            >
                                <input
                                    className={styles.order__pay__rights__input}
                                    type="checkbox"
                                    onChange={handleAgreementChange}
                                    checked={agreement}
                                />
                                <span className={styles.order__pay__rights__text}>
                                    <strong>Согласен с условиями</strong> Правил пользования
                                    торговой площадкой и правилами возврата
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrderPage