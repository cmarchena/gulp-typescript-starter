export interface Restaurant {
    address: string;
    createdAt: string;
    cuisine_type: string;
    id: string;
    is_favorite: string;
    latlng: string;
    name: string;
    neighborhood: string;
    operating_hours: string;
    photograph: string;
    updatedAt: string;
    [key: string]: string;
};
export interface Review {
    comments: string;
    createdAt: Date;
    id: number;
    name: string;
    rating: number;
    restaurant_id: number;
    updatedAt: Date;
}
export interface Window { [key: string]: any }