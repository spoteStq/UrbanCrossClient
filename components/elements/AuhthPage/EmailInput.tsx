import { IAuthPageInput } from '@/types/auth'
import styles from '@/styles/auth/index.module.scss'


const EmailInput = ({ register, errors }: IAuthPageInput) => (
        <label className={styles.form__label}>
            <input {...register('email', {
                required: 'Введите email!',
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Неправильный Email!'
                }
            })} className={styles.form__input} type="email" placeholder="Email" />
            {errors.email && (
                <span className={styles.error_alert}>{errors.name?.message}</span>
            )}
        </label>
)

export default EmailInput