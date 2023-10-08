'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Category {
    id: string;
    name: string;
    parentId: string | null;
    children?: Category[];
}

interface CategoryDropdownProps {
    id: string;
}

export const CategoryDropdown = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = (id: string | null): Category[] => {
        const fetchedCategories = MOCK_DATA.filter((data) => data.parentId === id);
        console.log(fetchedCategories)
        return fetchedCategories.map((category) => ({
            ...category,
            children: fetchCategories(category.id),
        }));
    };

    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (id: string) => {
        setExpandedCategories((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        // Initialize categories with top-level categories (e.g., Men's Apparel, Women's Apparel)
        setCategories(fetchCategories(null));
    }, []);

    const renderCategories = (categories: Category[]) => {
        return categories.map((category) => (
            <div key={category.id}>
                <Button onClick={() => toggleCategory(category.id)}>
                    {category.name}
                </Button>
                {expandedCategories.includes(category.id) && category.children && (
                    <div style={{ marginLeft: "20px" }}>
                        {renderCategories(category.children)}
                    </div>
                )}
            </div>
        ));
    };

    return <div>{renderCategories(categories)}</div>;
};


const MOCK_DATA = [
    {
        "id": 1,
        "name": "Men's Apparel",
        "parentId": null
    },
    {
        "id": 101,
        "name": "T-Shirts",
        "parentId": 1
    },
    {
        "id": 102,
        "name": "Shirts",
        "parentId": 1
    },
    {
        "id": 1001,
        "name": "Round Neck",
        "parentId": 101
    },
    {
        "id": 1002,
        "name": "V-Neck",
        "parentId": 101
    },
    {
        "id": 1003,
        "name": "Casual Shirts",
        "parentId": 102
    },
    {
        "id": 1004,
        "name": "Formal Shirts",
        "parentId": 102
    },
    {
        "id": 2,
        "name": "Women's Apparel",
        "parentId": null
    },
    {
        "id": 201,
        "name": "Dresses",
        "parentId": 2
    },
    {
        "id": 202,
        "name": "Blouses",
        "parentId": 2
    },
    {
        "id": 2001,
        "name": "Summer Dresses",
        "parentId": 201
    },
    {
        "id": 2002,
        "name": "Evening Dresses",
        "parentId": 201
    },
    {
        "id": 2003,
        "name": "Sleeveless Blouses",
        "parentId": 202
    },
    {
        "id": 2004,
        "name": "Long Sleeve Blouses",
        "parentId": 202
    }
]
