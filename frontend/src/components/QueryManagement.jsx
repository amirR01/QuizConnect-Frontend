import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function QueryManagement() {
    const navigate = useNavigate();
    const location = useLocation();

    const [newQuery, setNewQuery] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(1);
    const [category, setCategory] = useState('Category 1');
    const [difficulty, setDifficulty] = useState('EASY');
    const [similarQueries, setSimilarQueries] = useState([]);
    const [isNightMode, setIsNightMode] = useState(false);
    const [existingQueries, setExistingQueries] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [categories_id_map, setCategoriesIdMap] = useState({});

    const getExistingQueries = () => {
        const postData = {}
        const headers = {
            'userId': location.state.id
          };
      axios.post('http://localhost:4000/question/designer/all', {}, {headers: headers})
        .then (res =>  {
            setExistingQueries(res.data.data)
        }, [])
    }

    useEffect(() => {
        getExistingQueries();
    }, []);

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const addQuery = async() => {
        const postData = {
            question:newQuery,
            options:options,
            categoryId:categories_id_map[category],
            difficulty:difficulty,
            correctOption:correctAnswer
        }

        const headers = {
            'userId': location.state.id
        };

        const response = await axios.post('http://localhost:4000/question/designer/add', postData, {headers: headers})
        return response.data
    }

    const axiosGetCategories = () => {
        axios.get('http://localhost:4000/category/all')
        .then (res =>  {
            let categories = []
            let categories_map = {}
            for (let i = 0; i < res.data.data.length; i++) {
                categories_map[res.data.data[i].name] = res.data.data[i].id
                categories.push(res.data.data[i].name)
            }
            setCategoriesIdMap(categories_map)
            setCurrentCategories(categories)
            setCategory(categories[0])
        }, [])
    }

    useEffect(() => {
        axiosGetCategories();
    }, []);

    const handleCreateQuery = () => {
        if (!newQuery.trim() || options.some((opt) => !opt.trim())) {
            alert('Please fill all fields.');
        } else {
            alert('Query created successfully!');
            addQuery()
            const newQuestion = {
                question:newQuery,
                options:options,
                category:category,
                level:difficulty,
                correct_option:correctAnswer
            }
            setExistingQueries([...existingQueries, newQuestion]);
            // Reset form
            setNewQuery('');
            setOptions(['', '', '', '']);
            setDifficulty('EASY');
            setSimilarQueries([]);
        }
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Create New Query</h1>
            <div className="form-section">
                <label>Enter your question</label>
                <input
                    type="text"
                    placeholder="Enter your question"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                />
            </div>
            <div className="options-container">
    {options.map((option, index) => (
        <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
        />
    ))}
</div>

            <div className="form-section">
                <label>Select Correct Answer</label>
                <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                >
                    {options.map((_, index) => (
                        <option key={index} value={index + 1}>
                            Option {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-section">
                <label>Classify Question under Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {currentCategories.map((category, index) =>(
                        <option>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-section">
                <label>Select Difficulty Level</label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
            </div>
            <div className="form-section">
                <label>Select Similar Queries</label>
                <select
                    multiple
                    value={similarQueries}
                    onChange={(e) =>
                        setSimilarQueries([...e.target.selectedOptions].map((opt) => opt.value))
                    }
                >
                    <option value="1">cat stare at the wall for hours?</option>
                    <option value="2">How to apologize to a cat?</option>
                    <option value="3">cat plotting world domination?</option>
                    <option value="4">cat sitting on my keyboard?</option>
                    <option value="5">the fluff overlord?</option>
                    <option value="6">survive a cat ignoring you</option>
                </select>
            </div>
            <button onClick={handleCreateQuery}>Create Query</button>
            <h1 className="query-management">Query Management</h1>
            <div className="query-card-container">
                {existingQueries.map((query) => (
                    <div className="query-card" key={query.id}>
                        <h3>{query.question}</h3>
                        <select>
                            <option value="" disabled selected>
                                Show options
                            </option>
                            {query.options.map((option, index) => (
                                <option key={index} disabled value={option} >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
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

export default QueryManagement;
