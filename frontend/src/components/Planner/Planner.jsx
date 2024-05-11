import React, { useState, useEffect, Component } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import './Planner.css'
import filterLogo from './filter.png'
import ReservationCard from "./ReservationCard/ReservationCard";
import { apiGetReservations, apiAddReservation, apiChangeReservation, apiDeleteReservation } from "../../sevices/apiReservations";
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

    
    const [pickedReservationId, setPickedReservationId] = useState(0);
    const [pickedReservationStatus, setPickedReservationStatus] = useState('');
    const [standId, setStandId] = useState(0);
    const [date, setDate] = useState(currentDate);
    const [startTime, setStartTime] = useState('');
    const [selectedStart, setSelectedStart] = useState('startNow');
    const [duration, setDuration] = useState('');
    let selectedStartTime = ''
    const [filter, setFilter] = useState({ user: '', stand: '' });

    const openModal = () => setIsModalOpen(true);

    function openChangeModal (reservation) {
      setModalMode('change')
      setPickedReservationId(reservation.id)
      setPickedReservationStatus(reservation.status)
      const selectedStand = stands.find(stand => stand.name === reservation.name)
      setStandId(selectedStand.id)
      setDate(reservation.start_time.slice(0, 10))
      setStartTime(reservation.start_time.slice(11, 16))
      setDuration(reservation.duration)
      openModal()
    }

    function closeModal(){
      setPickedReservationId(0)
      setPickedReservationStatus('')
      setStandId(0)
      setDate(currentDate)
      setStartTime('')
      setDuration('')
      setIsModalOpen(false);
      setSelectedStart('startNow')
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

    const handleCheckboxChange = (event) => {
      const { name } = event.target;
      setDate(currentDate)
      setStartTime('')
      setSelectedStart(name);
    };

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
            console.log(reservations)
            setReservations(reservations)
            setLoadingReservations('loaded')
        } catch (error) {
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            setLoadingReservations('error')
          }
        }
    }

    async function deleteReservation () {
      try {
        const response = await apiDeleteReservation(pickedReservationId)
        if (response.status == 200) {
          closeModal()
          setNotificationData({message: 'Резервирование удалено', type: 'success'})
          toggleNotificationFunc()
          getReservations()
        }else {
          const responseData = await response.json()
          setNotificationData({message: responseData.error, type: 'error'})
          toggleNotificationFunc()
        }
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setNotificationData({message: 'бекенд отвалился', type: 'error'})
          toggleNotificationFunc()
        } else {}
      }
    }


    useEffect(() => {
        getStands()
        getReservations()
        const interval = setInterval(getReservations, 60000);
        return () => clearInterval(interval);
    }, [])


    async function addReservation() {
      if (standId == 0) {
        setNotificationData({message:'Стенд не выбран', type: 'error'})
        toggleNotificationFunc()
        return 0
      }

      if (startTime.length < 5 && selectedStart !== 'startNow') {
        setNotificationData({message:'Время начала введено некорректно', type: 'error'})
        toggleNotificationFunc()
        return 0
      }

      if (duration.length < 5) {
        setNotificationData({message:'Длительность введена некорректно', type: 'error'})
        toggleNotificationFunc()
        return 0
      }
      
      if (selectedStart == 'startNow') {
        selectedStartTime = 'startNow'
      } else {
        selectedStartTime = startTime
      }

      try {
        const response = await apiAddReservation(userId, standId, date, selectedStartTime, duration)
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
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setNotificationData({message: 'бекенд отвалился', type: 'error'})
          toggleNotificationFunc()
        } else {}
      }
    }   
    async function changeReservation() {
      
      if (startTime.length < 5 && selectedStart !== 'startNow') {
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
        const response = await apiChangeReservation(pickedReservationId, standId, date, startTime, duration)
        if (response.status == 200) {
            setNotificationData({message: 'Резервирование изменено', type: 'success'})
            toggleNotificationFunc()
            closeModal()
            getReservations()
        } else {
            const responseData = await response.json()
            setNotificationData({message: responseData.error, type: 'error long'})
            toggleNotificationFunc()
        }
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setNotificationData({message: 'бекенд отвалился', type: 'error'})
          toggleNotificationFunc()
        } else {}
      }
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
                <div>
                    <div className="form-head">
                      Новое резервирование
                    </div>
                  <div className="form-row">
                      <label className="reservationLabel">Стенд</label>
                      <select className='reservationSelect' onChange={handleStand}>
                                  {loadingStands === 'loaded' && <>{<option value="defaultStand" selected>Стенд</option>}
                                    {stands.map(stand =><option value={stand.id}>{stand.name}</option>)}</>}
                                  {loadingStands === 'error' && <>{<option value="defaultStand" selected>Бекенд отвалился</option>}</>}
                      </select>
                  </div>
                  <div className="form-row">
                      <label className="reservationLabel">Дата</label>
                      <input type="text" name="date" className="reservationParam" placeholder="dd-mm-yyyy" onChange={handleDate} value={date} disabled={selectedStart !== 'startLater'}/>
                  </div>
                  <div className="form-row">
                      <label className="reservationLabel">Время начала</label>
                        <div className="form-row">
                          <input
                            type="checkbox"
                            id="startNow"
                            name="startNow"
                            checked={selectedStart === 'startNow'}
                            onChange={handleCheckboxChange}
                            style={{display: 'none'}}
                          />
                          <label className={selectedStart === 'startNow' && 'startTime selectedStartTime' || 'startTime'} htmlFor="startNow">Сейчас</label>
                        </div>

                        <div className="form-row">
                          <input
                            type="checkbox"
                            id="startLater"
                            name="startLater"
                            checked={selectedStart === 'startLater'}
                            onChange={handleCheckboxChange}
                            style={{display: 'none'}}
                          />
                          <label className={selectedStart === 'startLater' && 'startTime selectedStartTime' || 'startTime'} htmlFor="startLater">Позже</label>
                        </div>
                      <input type="text" id="timeInput" className="reservationParam" placeholder="hh:mm" onChange={handleStartTime} value={startTime} disabled={selectedStart !== 'startLater'}/>
                  </div>
                  <div className="form-row">
                  <label className="reservationLabel">Длительность</label>
                      <input type="text" name="duration" className="reservationParam" placeholder="hh:mm" onChange={handleDuration} value={duration}/>
                  </div>
                  <div className="empty"></div>
                  <div className="form-row">
                    <div className="empty"></div>
                    <Button style={"reservationAdd"} onClick={addReservation}> Создать </Button>
                    <Button style={"reservationExit"} onClick={closeModal}> Закрыть </Button>
                    <div className="empty"></div>
                  </div>
                  <div className="form-row">
                </div>
                </div>
            || 
            modalMode == 'change' && 
              <div>
                    <div className="form-head">
                      Изменить резервирование
                    </div>
                  <div className="form-row">
                      <label className="reservationLabel">Стенд</label>
                      <select className='reservationSelect' onChange={handleStand} disabled={pickedReservationStatus == 'active' && true || false}>
                                  {loadingStands === 'loaded' && <>
                                    {stands.map(stand => standId == stand.id && <option value={stand.id} selected>{stand.name}</option> || <option value={stand.id}>{stand.name}</option>
                                  )}
                                  </>}
                                  {loadingStands === 'error' && <>{<option value="defaultStand" selected>Бекенд отвалился</option>}</>}
                      </select>
                  </div>
                  <div className="form-row">
                      <label className="reservationLabel">Дата</label>
                      <input type="text" name="date" className="reservationParam" placeholder="dd-mm-yyyy" onChange={handleDate} value={date} disabled={pickedReservationStatus == 'active' && true || false}/>
                  </div>
                  <div className="form-row">
                      <label className="reservationLabel">Время начала</label>
                      <input type="text" id="timeInput" className="reservationParam" placeholder="hh:mm" onChange={handleStartTime} value={startTime} disabled={pickedReservationStatus == 'active' && true || false}/>
                  </div>
                  <div className="form-row">
                  <label className="reservationLabel">Длительность</label>
                      <input type="text" name="duration" className="reservationParam" placeholder="hh:mm" onChange={handleDuration} value={duration}/>
                  </div>
                  <div className="form-row">
                    <Button style={"reservationAdd"} onClick={changeReservation}> Изменить </Button>
                    <div className="empty"></div>
                    <Button style={"reservationExit"} onClick={deleteReservation}> Удалить </Button>
                    <div className="empty"></div>
                    <Button style={"reservationExit"} onClick={closeModal}> Закрыть </Button>
                  </div>
                  <div className="form-row">
                </div>
                </div>
            }
        </Modal>
      </div>
    );
}
