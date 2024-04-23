import React, { useState, useEffect, Component } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import './Planner.css'

function getCurrentDateString() {
    const now = new Date();
  
    const year = now.getFullYear();
    // getMonth() возвращает месяц от 0 до 11, поэтому добавляем 1 для корректного отображения
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
  
    return `${day}-${month}-${year}`;
  }
  

export default function Planner() {
    const [loading, setLoading] = useState('loading')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stands, setStands] = useState([])
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(startTime)
        console.log(currentDate)
        closeModal()
    }
    
    const currentDate = getCurrentDateString()

    const [stand, setStand] = useState('');
    const [date, setDate] = useState(currentDate);
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');


    function handleStand(e) {
        let inputValue = e.target.value;
        setStand(inputValue );
        // console.log(stand)
        console.log(inputValue )
    }


    function handleDate(e) {
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/\D/g, '');
        if (inputValue.length > 2) {
            inputValue = inputValue.slice(0, 2) + '-' + inputValue.slice(2);
          }
          if (inputValue.length > 5) {
            inputValue = inputValue.slice(0, 5) + '-' + inputValue.slice(5, 9);
          }
          
          // Ограничиваем длину строки до 10 символов (дд-мм-гггг)
          inputValue = inputValue.slice(0, 10);
        setDate(inputValue); 
    }

    function handleStartTime(e) {
        let inputValue = e.target.value;
    
        // Удаляем все нецифровые символы
        inputValue = inputValue.replace(/\D/g, '');
    
        // Добавляем двоеточие после первых двух цифр
        if (inputValue.length > 2) {
            inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
        }
    
        // Обрезаем строку до максимально допустимой длины "HH:MM"
        if (inputValue.length > 5) {
            inputValue = inputValue.substring(0, 5);
        }
        setStartTime(inputValue); 
    }

    function handleDuration(e) {
        let inputValue = e.target.value;
    
        // Удаляем все нецифровые символы
        inputValue = inputValue.replace(/\D/g, '');
    
        // Добавляем двоеточие после первых двух цифр
        if (inputValue.length > 2) {
            inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
        }
    
        // Обрезаем строку до максимально допустимой длины "HH:MM"
        if (inputValue.length > 5) {
            inputValue = inputValue.substring(0, 5);
        }
        setDuration(inputValue); 
    }
    
    async function getStands() {
        try {
            setLoading('loading')
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'GET',
            })
            const stands = await response.json()
            setStands(stands)
            setLoading('loaded')
            console.log(stands)
        } catch (err) {
            setLoading('error')
        }
    }


    useEffect(() => {
        getStands()
    }, [])
    return (
        <div>
        <button onClick={openModal}>Открыть модальное окно</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-row">
                    <label>Стенд</label>
                    <select className='reservationParam' onChange={handleStand}>
                                {<option value="defaultStand" selected>Стенд</option>}
                                {stands.map(stand =><option value={stand.id}>{stand.name}</option>)}
                    </select>
                </div>
                <div className="form-row">
                    <label>Дата</label>
                    <input type="text" name="date" className="reservationParam" placeholder={"dd-mm-yyyy"} onChange={handleDate} value={date}/>
                </div>
                <div className="form-row">
                    <label>Время начала</label>
                    <input type="text" id="timeInput" className="reservationParam" placeholder="hh:mm" onChange={handleStartTime} value={startTime} />
                </div>
                <div className="form-row">
                <label>Длительность</label>
                    <input type="text" name="duration" className="reservationParam" placeholder="hh:mm" onChange={handleDuration} value={duration}/>
                </div>
                <div className="form-row">
                <Button style={"reservationAdd"} type={"submit"}> Создать </Button>
                <Button style={"reservationExit"} onClick={closeModal}> Закрыть </Button>
                </div>
                <div className="form-row">
                </div>
            </form>
        </Modal>
      </div>
    );
  
}
