import { IGeolocation } from '@/types/common'
import { createEffect } from 'effector-next'
import api from '../axiosClient'

export const getGeolocationFx = createEffect(
  async ({ latitude, longitude }: IGeolocation) => {
    const data = await api.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}
      &lon=${longitude}&lang=ru&apikey=${process.env.NEXT_PUBLIC_SERVER_URL}`,
      { withCredentials: false }
    )
    return data
  }
)
