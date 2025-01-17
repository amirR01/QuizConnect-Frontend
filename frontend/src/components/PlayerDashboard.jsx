import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function PlayerDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username
    const [isNightMode, setIsNightMode] = useState(false);
    const [scoreBoard, setScoreBoard] = useState([]);
    const [designers, setDesigners] = useState([]);
    const [recentQueries, setRecentQueries] = useState([]);

    const getQueries = () => {

        const headers = {
            'userId': location.state.id
          };
        axios.post('http://localhost:4000/question/player/all',{}, {headers: headers})
        .then (res =>  {
            let q = []
            for (let i = 0; i < res.data.data.length; i++) {
                q.push(res.data.data[i].question)
            }
            setRecentQueries(q)
        }, [])
    }

    useEffect(() => {
        getQueries();
    }, []);

    function compareNumbers(a, b) {
        return -a.score + b.score
    }

    const getDesigners = () => {
        axios.get('http://localhost:4000/user/designer/all')
        .then (res =>  {
            const designers = res.data.data
            let recentDesigners = []

            for (let i = 0; i<designers.length; i++) {
                recentDesigners.push(designers[i].name)
            }
            setDesigners(recentDesigners)
        }, [])
    }

    useEffect(() => {
        getDesigners();
    }, []);

    const getScores = () => {
        axios.get('http://localhost:4000/user/player/all')
        .then (res =>  {
            const scores = res.data.data
            scores.sort(compareNumbers)
            setScoreBoard(scores)
        }, [])
    }

    useEffect(() => {
        getScores();
    }, []);

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    const renderCard = (title, items, buttonLabel, navigateTo) => (
        <div className="card">
            <h2>{title}</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button onClick={() => navigate(navigateTo, {state: location.state})}>{buttonLabel}</button>
        </div>
    );

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Player Dashboard</h1>
            <div className="card-container">
                {renderCard(
                    'Scoreboard',
                    scoreBoard.map((score) => `${score.name} - ${score.score} Points`),
                    'Go to Scoreboard',
                    '/scoreboard'
                )}
                {renderCard('Answer Queries', recentQueries, 'Go to Answer Queries', '/answer-queries')}
                {
                    <div className="card">
                    <h2>{'Show Designers'}</h2>
                    <ul>
                        {designers.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    </div>
                }
            </div>
            <button className="back-button" onClick={() => navigate('/')}>Logout</button>
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

export default PlayerDashboard;
