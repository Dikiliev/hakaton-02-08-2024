import useAxios from '@utils/useAxios.js';

const useBasket = () => {
    const axiosInstance = useAxios();
    const middleURL = 'orders/basket/'

    const getBasket = async () => {
        try {
            const response = await axiosInstance.get(middleURL);
            return response.data;
        } catch (error) {
            console.error('Error fetching basket:', error);
            throw error;
        }
    };

    const addProductToBasket = async (productId, quantity = 1) => {
        try {
            const response = await axiosInstance.post(middleURL + 'add/', {
                product_id: productId,
                quantity: quantity,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding product to basket:', error);
            throw error;
        }
    };

    const updateBasketItem = async (itemId, quantity) => {
        try {
            const response = await axiosInstance.post(middleURL + 'update/', {
                item_id: itemId,
                quantity: quantity,
            });
            return response.data;
        } catch (error) {
            console.error('Error updating basket item:', error);
            throw error;
        }
    };

    const removeProductFromBasket = async (itemId) => {
        try {
            const response = await axiosInstance.post(middleURL + 'remove/', {
                item_id: itemId,
            });
            return response.data;
        } catch (error) {
            console.error('Error removing product from basket:', error);
            throw error;
        }
    };

    const clearBasket = async () => {
        try {
            const response = await axiosInstance.post(middleURL + 'lear/');
            return response.data;
        } catch (error) {
            console.error('Error clearing basket:', error);
            throw error;
        }
    };

    return { getBasket, addProductToBasket, updateBasketItem, removeProductFromBasket, clearBasket };
};

export default useBasket;
