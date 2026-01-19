export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

export interface MenuItem {
    title: string;
    value: string;
    icon?: string;
    color?: string;
    disabled?: boolean;
}