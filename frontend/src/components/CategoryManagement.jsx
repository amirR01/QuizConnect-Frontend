import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function CategoryManagement() {
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);

    const [newCategory, setNewCategory] = useState('');
    const [isNightMode, setIsNightMode] = useState(false);

    const addCategory = async() => {
        const postData = {
            name:newCategory
        }

        const response = await axios.post('http://localhost:4000/category/add', postData)
        return response.data
    }

    const axiosGetCategories = () => {
        axios.get('http://localhost:4000/category/all')
        .then (res =>  {
            let categories = []
            for (let i = 0; i < res.data.data.length; i++) {
                categories.push(res.data.data[i].name)
            }
            setCategories(categories)
        }, [])
    }

    useEffect(() => {
        axiosGetCategories();
    }, []);


    const handleCreateCategory = () => {
        if (newCategory.trim()) {
            addCategory()
            setCategories([...categories, newCategory]);
            setNewCategory('');
        } else {
            alert('Please enter a valid category name.');
        }
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Category Management</h1>
            <div className="list-section">
                <h2>Current Categories</h2>
                <ul className="category-list">
                    {categories.map((category, index) => (
                        <li key={index}>{category}</li>
                    ))}
                </ul>
                <div className="new-item">
                    <h3>Create New Category</h3>
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button onClick={handleCreateCategory}>Create Category</button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate('/designer', {state: location.state})}>
                Back to Designer
            </button>
            <div className="toggle-container">
                <input
                    type="checkbox"
                    id="night-mode-toggle"
                    className="toggle-checkbox"
                    checked={isNightMode}
                    onChange={toggleNightMode}
                />
                <label htmlFor="night-mode-toggle" className="toggle-label"></label>
            </div>
        </div>
    );
}

export default CategoryManagement;
