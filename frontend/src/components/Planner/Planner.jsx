import React, { useState, useEffect, Component } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotificationContext } from "../../hooks/useNotificationContext";
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
    const {userId} = useAuthContext()
    const [loadingStands, setLoadingStands] = useState('loading')
    const [loadingReservations, setLoadingReservations] = useState('loading')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stands, setStands] = useState([])
    const [reservations, setReservations] = useState([])
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();  
    const currentDate = getCurrentDateString()


    
    const [standId, setStandId] = useState(0);
    const [date, setDate] = useState(currentDate);
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    
    const [filter, setFilter] = useState({ user: '', stand: '' });

    const openModal = () => setIsModalOpen(true);
    function closeModal(){
      setStandId(0)
      setDate(currentDate)
      setStartTime('')
      setDuration('')
      setIsModalOpen(false);
    } 


    function handleStand(e) {
        let inputValue = e.target.value;
        setStandId(inputValue);
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
          if (Number(inputValue.slice(0, 2)) >= 24) {
            inputValue = '23:' + inputValue.slice(2);
          } else {
            inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
          }
        }

        if (inputValue.length == 5) {
          if (Number(inputValue.slice(3, 5)) >= 60) {
            inputValue = inputValue.slice(0, 2) + ':59'
          }
        }
        
        // Обрезаем строку до максимально допустимой длины "HH:MM"
        if (inputValue.length > 5) {
          inputValue = inputValue.slice(0, 5);
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

      if (inputValue.length == 5) {
        if (Number(inputValue.slice(3, 5)) >= 60) {
          inputValue = inputValue.slice(0, 2) + ':59'
        }
      }
      
      // Обрезаем строку до максимально допустимой длины "HH:MM"
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5);
      }
      setDuration(inputValue); 
    }
    
    async function getStands() {
        try {
            setLoadingStands('loading')
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'GET',
            })
            const stands = await response.json()
            setStands(stands)
            setLoadingStands('loaded')
        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function getReservations() {
        try {
            setLoadingReservations('loading')
            const response = await fetch('http://127.0.0.1:5000/reservations', {
                method: 'GET',
            })
            const reservations = await response.json()
            setReservations(reservations)
            setLoadingReservations('loaded')
        } catch (err) {
            setLoadingReservations('error')
        }
    }


    useEffect(() => {
        getStands()
        getReservations()
    }, [])


    async function handleSubmit(event) {
      event.preventDefault();

      if (standId == 0) {
        setNotificationData({message:'Стенд не выбран', type: 'error'})
        toggleNotificationFunc()
        return 0
      }

      if (startTime.length < 5) {
        setNotificationData({message:'Время начала введено некорректно', type: 'error'})
        toggleNotificationFunc()
        return 0
      }

      if (duration.length < 5) {
        setNotificationData({message:'Длительность введена некорректно', type: 'error'})
        toggleNotificationFunc()
        return 0
      }
      try {
        const response = await fetch('http://127.0.0.1:5000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add',
                user_id: userId,
                stand_id: standId,
                start_time: date + ' ' + startTime,
                duration: duration
            })
        })
        if (response.status == 200) {
            setNotificationData({message: 'Стенд зарезервирован', type: 'success'})
            toggleNotificationFunc()
            closeModal()
            getReservations()
        } else {
            const responseData = await response.json()
            setNotificationData({message: responseData.error, type: 'error long'})
            toggleNotificationFunc()
        }
        
        
    } catch (err) {
        console.log(err)
    }
    }   

    function handleFilter() {
      
    }

    const filteredReservations = reservations.filter(item => {
      return (
        (filter.user === '' || item.login.includes(filter.user)) &&
        (filter.stand === '' || item.name.includes(filter.stand))
      );
    }
    )


    return (
        <div className="reservations">
        <button onClick={openModal}>Создать резервирование</button>
        <input type="text" className="reservationParam" placeholder="user" onChange={e => setFilter({...filter, user: e.target.value})} value={filter.user}/>
        <input type="text" className="reservationParam" placeholder="stand" onChange={e => setFilter({...filter, stand: e.target.value})} value={filter.stand}/>
        {loadingReservations === 'loading' && <p> Loading ...</p>}
                {loadingReservations === 'error' && <p> бекенд отвалился</p>}
                {loadingReservations === 'loaded' && <ul>
                        {filteredReservations.map(reservation => <li key={reservation.id}> Пользователь {reservation.login} | Стенд {reservation.name} | Время начала {reservation.start_time} | Длительность {reservation.duration} | Статус {reservation.status} </li>)}
                    </ul>}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-row">
                    <label className="reservationLabel">Стенд</label>
                    <select className='reservationParam' onChange={handleStand}>
                                {loadingStands === 'loaded' && <>{<option value="defaultStand" selected>Стенд</option>}
                                  {stands.map(stand =><option value={stand.id}>{stand.name}</option>)}</>}
                                {loadingStands === 'error' && <>{<option value="defaultStand" selected>Бекенд отвалился</option>}</>}
                    </select>
                </div>
                <div className="form-row">
                    <label className="reservationLabel">Дата</label>
                    <input type="text" name="date" className="reservationParam" placeholder={"dd-mm-yyyy"} onChange={handleDate} value={date}/>
                </div>
                <div className="form-row">
                    <label className="reservationLabel">Время начала</label>
                    <input type="text" id="timeInput" className="reservationParam" placeholder="hh:mm" onChange={handleStartTime} value={startTime} />
                </div>
                <div className="form-row">
                <label className="reservationLabel">Длительность</label>
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
