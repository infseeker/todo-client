import { helpers } from '@vuelidate/validators'

export const email = helpers.regex(/(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/);
export const password = helpers.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@\-$!%*#?&]{8,15}$/);