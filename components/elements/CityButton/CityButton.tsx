import { useStore } from "effector-react"
import LocationSvg from "../LocationSvg/LocationSvg"
import { $mode } from "@/context/mode"
import styles from '@/styles/cityButton/index.module.scss'

const CityButton = () => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    
    return (
        <button className={styles.city}>
            <span className={`${styles.city__span} ${darkModeClass}`}>
                <LocationSvg />
            </span>
            <span className={`${styles.city__text} ${darkModeClass}`}>Moscow</span>
        </button>
    )
}

export default CityButton