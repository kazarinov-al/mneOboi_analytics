import React, {useState} from 'react';
import * as XLSX from 'xlsx';

function ExcelUploader() {
    const [data, setData] = useState([]); // Оригинальные данные
    const [groupedData, setGroupedData] = useState([]); // Сгруппированные и суммированные данные
    const [sortConfig, setSortConfig] = useState(null); // Конфигурация сортировки

    // Обработчик загрузки файла
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Получаем файл, который выбрал пользователь
            console.log(handleFileUpload)
        if (file) {
            const reader = new FileReader();
            console.log(reader)
            reader.onload = (e) => {
                const binaryStr = e.target.result; // Получаем содержимое файла в бинарной строке
                const workbook = XLSX.read(binaryStr, {type: 'binary'}); // Читаем книгу Excel

                const sheetName = workbook.SheetNames[0]; // Имя первого листа
                const sheet = workbook.Sheets[sheetName]; // Получаем объект листа

                const jsonData = XLSX.utils.sheet_to_json(sheet); // Преобразуем содержимое листа в JSON
                setData(jsonData); // Сохраняем оригинальные данные
                groupAndSummarizeData(jsonData); // Вызываем функцию для группировки и суммирования
            };

            reader.readAsBinaryString(file);
        }
    };

    // Функция для группировки данных и суммирования по первым 5 символам
    const groupAndSummarizeData = (data) => {
        const grouped = {};

        data.forEach((row) => {
            // Предполагаем, что столбец для группировки называется "Артикул продавца"
            const key = row['Артикул продавца']?.toString().substring(0, 5); // Первые 5 символов

            if (!key) return; // Пропускаем строки без значения

            if (!grouped[key]) {
                // Если ключ еще не создан, инициализируем с нулевыми суммами
                grouped[key] = {...row}; // Копируем первую строку как базу
                Object.keys(row).forEach((column) => {
                    if (typeof row[column] === 'number') {
                        grouped[key][column] = 0; // Устанавливаем 0 для всех числовых колонок
                    }
                });
                grouped[key]['Артикул продавца'] = key; // Устанавливаем ключ как "группу"
            }

            // Суммируем значения остальных столбцов
            Object.keys(row).forEach((column) => {
                if (typeof row[column] === 'number') {
                    grouped[key][column] += row[column];
                }
            });
        });

        // Конвертируем сгруппированные данные обратно в массив
        setGroupedData(Object.values(grouped));
    };

    // Обработчик сортировки
    const handleSort = (column) => {

        let direction = 'ascending';
        if (sortConfig && sortConfig.key === column && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        // Проверка, что есть данные для сортировки
        if (groupedData.length > 1) {
            // Заголовок (первая строка)
            const headerRow = groupedData[0];

            // Все строки (включая заголовок)
            const dataRows = [...groupedData]; // Копируем все данные, включая заголовок

            // Сортировка данных (включая заголовок)
            const sortedData = dataRows.sort((a, b) => {
                // Сравниваем по столбцу
                if (a[column] < b[column]) return direction === 'ascending' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });

            // Обновляем данные с отсортированным массивом
            setGroupedData(sortedData);

            // Обновляем конфигурацию сортировки
            setSortConfig({ key: column, direction });
        }
    };




    return (
        <div style={{padding: '20px'}}>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{marginBottom: '20px'}}
            />
            <div style={{overflowY: 'auto', maxHeight: '80vh', border: '1px solid #ccc'}}>
                <table border="1" style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1}}>
                    <tr>
                        {groupedData[0] &&
                            Object.keys(groupedData[0]).map((key, index) => (
                                <th
                                    key={key}
                                    style={{
                                        cursor: index > 1 ? 'pointer' : 'default',
                                        backgroundColor: sortConfig?.key === key ? '#f0f0f0' : '',
                                    }}
                                    onClick={() => index > 1 && handleSort(key)}
                                >
                                    {key}
                                    {sortConfig?.key === key && (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽')}
                                </th>
                            ))}
                    </tr>
                    </thead>
                    <tbody>
                    {groupedData.slice(0).map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, i) => (
                                <td key={i}>{value}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExcelUploader;
