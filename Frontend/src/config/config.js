export const UPI_PROVIDERS = [
    "upi", "ybl", "oksbi", "axis", "icici", "hdfcbank",
    "sbi", "pnb", "bankofbaroda", "kotak", "ubio"
];

export const UPI_REGEX = new RegExp(`^[a-zA-Z0-9._%+-]+@(${UPI_PROVIDERS.join("|")})$`);

export const EARN_RATE=5;

export const PREMIUM_OFFER=3;

