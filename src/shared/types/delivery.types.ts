export interface DimensionsCm {
    length: number;
    width: number;
    height: number;
}

export interface CartData {
    weightKg: number;
    dimensionsCm?: DimensionsCm;
    totalPrice?: number;
}

export interface DestinationData {
    country: string;
    city: string;
    postalCode?: string;
}

export interface EstimatedDays {
    min: number;
    max: number;
}

export interface DeliveryOption {
    providerCode: string;
    serviceName: string;
    deliveryType: 'courier' | 'pickup' | 'post' | string;
    price: number;
    currency: string;
    estimatedDays: EstimatedDays;
}

export interface ProviderError {
    providerCode: string;
    message: string;
}
