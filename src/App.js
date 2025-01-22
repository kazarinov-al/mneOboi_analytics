import React from 'react';
import './App.css';  // Импорт стилей (если есть)
import ExcelUploader from './components/ExcelUploader';  // Импорт компонента ExcelUploader

function App() {
    return (
        <div className="App">
            <h1>Аналитика данных из Excel</h1>
            <ExcelUploader /> {/* Вставляем компонент ExcelUploader */}
        </div>
    );
}

export default App;
