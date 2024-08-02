import styles from './FilterPanel.module.css';
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiInstance from "@utils/axios.js";
import { FieldsGroup } from "@components/layout/fieldsGroup/FieldGroup.jsx";
import { OutlineInput } from "@components/common/input/Input.jsx";
import useInput from "@/hooks/useInput.js";

const FilterPanel = ({ setSelectedFilters, selectedFilters }) => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState([]);

    const fetchFilters = async () => {
        try {
            const response = await apiInstance.get(`products/category/2/filters`);
            setFilters(response.data.filters);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, [searchParams, setSelectedFilters]);

    const handleCategoryChange = (e) => {
        setSelectedFilters({ category: e.target.value, ...selectedFilters })
    };

    const handleMinPriceChange = (e) => {
        setSelectedFilters({ ...selectedFilters, minPrice: e.target.value })
    };

    const handleMaxPriceChange = (e) => {
        setSelectedFilters({ ...selectedFilters, maxPrice: e.target.value,  })
    };

    const handleAttributeChange = (attributeId, value) => {
        const updatedAttributes = selectedFilters.attributes.filter(attr => attr.id != attributeId);
        if (value) {
            updatedAttributes.push({ id: attributeId, value });
        }
        setSelectedFilters({ ...selectedFilters, attributes: updatedAttributes,  })
    };

    return (
        <div className={styles.filterPanel}>
            <h3>Фильтры</h3>
            <div className={styles.filterGroup}>
                <label>Цена</label>
                <FieldsGroup>
                    <OutlineInput placeholder={'от'} type={'number'} {...useInput('', handleMinPriceChange )} />
                    <OutlineInput placeholder={'до'} type={'number'} {...useInput('', handleMaxPriceChange )} />
                </FieldsGroup>
            </div>

            {filters.map((filter) => (
                <div key={filter.id} className={styles.filterGroup}>
                    <label>{filter.name}</label>
                    <select value={selectedFilters.attributes.find(attr => attr.id === filter.id)?.value || ''} onChange={(e) => handleAttributeChange(filter.id, e.target.value)}>
                        <option value="">Все</option>
                        {filter.values.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default FilterPanel;
