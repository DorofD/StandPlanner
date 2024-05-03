import React, { useState, useEffect, Component } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import './Planner.css'
import filterLogo from './filter.png'
import ReservationCard from "./ReservationCard/ReservationCard";
import { apiGetReservations, apiAddReservation } from "../../sevices/apiReservations";
import { apiGetStands } from "../../sevices/apiStands";

function getCurrentDateString() {
    const now = new Date();
  
    const year = now.getFullYear();
    // getMonth() возвращает месяц от 0 до 11, поэтому добавляем 1 для корректного отображения
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
  
    return `${day}-${month}-${year}`;
  }
  

export default function Planner() {
    const {userId, userName} = useAuthContext()
    const [loadingStands, setLoadingStands] = useState('loading')
    const [loadingReservations, setLoadingReservations] = useState('loading')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stands, setStands] = useState([])
    const [reservations, setReservations] = useState([])
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();  
    const currentDate = getCurrentDateString()
    const [modalMode, setModalMode] = useState('new')

    
    const [standId, setStandId] = useState(0);
    const [date, setDate] = useState(currentDate);
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');

    const [filter, setFilter] = useState({ user: '', stand: '' });

    const openModal = () => setIsModalOpen(true);

    function openChangeModal (reservation) {
      setModalMode('change')
      console.log(stands)
      console.log(modalMode)
      console.log(reservation)
      const selectedStand = stands.find(stand => stand.name === reservation.name)
      setStandId(selectedStand.id)
      setDate(reservation.start_time.slice(0, 10))
      setStartTime(reservation.start_time.slice(11, 16))
      setDuration(reservation.duration)
      openModal()
    }

    function closeModal(){
      setStandId(0)
      setDate(currentDate)
      setStartTime('')
      setDuration('')
      setIsModalOpen(false);
      setModalMode('new')
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
          
          inputValue = inputValue.slice(0, 10);
        setDate(inputValue); 
    }


    function handleStartTime(e) {
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/\D/g, '');
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

        if (inputValue.length > 5) {
          inputValue = inputValue.slice(0, 5);
        }
        setStartTime(inputValue); 
    }

    function handleDuration(e) {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/\D/g, '');
      if (inputValue.length > 2) {
          inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
      }

      if (inputValue.length == 5) {
        if (Number(inputValue.slice(3, 5)) >= 60) {
          inputValue = inputValue.slice(0, 2) + ':59'
        }
      }
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5);
      }
      setDuration(inputValue); 
    }
    
    async function getStands() {
        try {
            setLoadingStands('loading')
            const stands = await apiGetStands()
            setStands(stands)
            setLoadingStands('loaded')
        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function getReservations() {
        try {
            setLoadingReservations('loading')
            const reservations = await apiGetReservations()
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
        const response = await apiAddReservation(userId, standId, date, startTime, duration)
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


    const filteredReservations = reservations.filter(item => {
      return (
        (filter.user === '' || item.login.includes(filter.user)) &&
        (filter.stand === '' || item.name.includes(filter.stand))
      );
    }
    )
    function func1 () {
      console.log(userName)
    }
    function func2 () {
      console.log('idi nahui')
    }
    
    return (
        <div className="reservations">
           <div className="newReservation">
              <button onClick={openModal} className="newReservation">Зарезервировать стенд</button>
           </div>
          <div className="plannerFilter">
            <img src={filterLogo} alt="" className="filterLogo"/>
            <input type="text" className="reservationFilter" placeholder="Пользователь" onChange={e => setFilter({...filter, user: e.target.value})} value={filter.user}/>
            <input type="text" className="reservationFilter" placeholder="Стенд" onChange={e => setFilter({...filter, stand: e.target.value})} value={filter.stand}/>
            <button onClick={() => setFilter({ user: '', stand: '' })} className="clearFilter">Очистить</button>
          </div>

          <div className="reservationList">

            {loadingReservations === 'loading' && <p> Loading ...</p>}
                    {loadingReservations === 'error' && <p> бекенд отвалился</p>}
                    {loadingReservations === 'loaded' && <ul>
                            {filteredReservations.map(reservation => <ReservationCard onClick={userName == reservation.login && (() => openChangeModal(reservation)) || (() => {})} reservation={reservation} currentUser={userName}></ReservationCard>)}
                        </ul>}
          </div>

          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {modalMode == 'new' && 
              <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-head">
                      Новое резервирование
                    </div>
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
            || 
            modalMode == 'change' && 
              <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-head">
                      Изменить резервирование
                    </div>
                  <div className="form-row">
                      <label className="reservationLabel">Стенд</label>
                      <select className='reservationParam' onChange={handleStand}>
                                  {loadingStands === 'loaded' && <>
                                    {stands.map(stand => standId == stand.id && <option value={stand.id} selected>{stand.name}</option> || <option value={stand.id}>{stand.name}</option>
                                  )}
                                  </>}
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
                    <Button style={"reservationAdd"} type={"submit"}> Изменить </Button>
                    <Button style={"reservationExit"} onClick={() => console.log('delete')}> Удалить </Button>
                    <Button style={"reservationExit"} onClick={closeModal}> Закрыть </Button>
                  </div>
                  <div className="form-row">
                </div>
            </form>
            }
        </Modal>
      </div>
    );
}
