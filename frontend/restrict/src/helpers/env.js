import {APP_ENV} from "config/constants"

export const is_dev = () => APP_ENV === "development"
export const is_prod = () => APP_ENV === "production"