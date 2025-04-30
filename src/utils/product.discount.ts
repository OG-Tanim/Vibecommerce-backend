type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice: number | null;
    discountValidTill: Date | null;
    category: string;
    images: string[];
    imageIds: string[];
    video?: string | null;
    videoId?: string | null;
    seller: {
        id: string;
        name: string;
        email: string;
    } | null;
};

// Update the applyDiscountLogic function to use the updated Product type
export const applyDiscountLogic = (product: Product): Product => {
    const now = new Date();

    if (!product.discountedPrice || !product.discountValidTill) {
        return { ...product, discountedPrice: null };
    }

    const isStillValid = product.discountValidTill > now;

    return {
        ...product,
        discountedPrice: isStillValid ? product.discountedPrice : null,
    };
};