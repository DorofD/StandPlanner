import React, { Component, useState, useEffect } from "react";
import Button from "../Button/Button";
import StandCard from "./StandCard/StandCard";
import "./Stands.css"
import { useNotificationContext } from "../../hooks/useNotificationContext";

export default function Stands() {
    const [stands, setStands] = useState([])
    const [loading, setLoading] = useState('loading')
    const [pickedStand, setPickedStand] = useState({id: 'default', name: '', description: ''})
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();
    const [clickCount, setClickCount] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);

    const changeStandName = (event) => {
        setPickedStand({id: pickedStand['id'], name: event.target.value, description: pickedStand['description']});
      };

    const changeStandDescription = (event) => {
        setPickedStand({id: pickedStand['id'], name: pickedStand['name'], description: event.target.value});
      };
    
    async function getStands() {
        try {
            setLoading('loading')
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'GET',
            })
            const stands = await response.json()
            setStands(stands)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }
    
    async function addStand() {
        const response = await fetch('http://127.0.0.1:5000/stands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add',
                name: pickedStand['name'],
                description: pickedStand['description']
            })

        })
        if (response.status == 200) {
            getStands()
            setPickedStand({id: '', name: '', description: ''})
            setNotificationData({message:'Стенд добавлен', type: 'success'})
            toggleNotificationFunc()

        } else {
            setNotificationData({message:'Не удалось добавить стенд', type: 'error'})
            toggleNotificationFunc()
        }
    }

    async function changeStand() {
        const response = await fetch('http://127.0.0.1:5000/stands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'change',
                id: pickedStand['id'],
                name: pickedStand['name'],
                description: pickedStand['description']
            })

        })
        if (response.status == 200) {
            getStands()
            setNotificationData({message:'Стенд изменён', type: 'success'})
            toggleNotificationFunc()

        } else {
            setNotificationData({message:'Не удалось изменить стенд', type: 'error'})
            toggleNotificationFunc()
        }
    }

    async function deleteStand() {
        const response = await fetch('http://127.0.0.1:5000/stands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                id: pickedStand['id']
            })

        })
        if (response.status == 200) {
            getStands()
            setPickedStand({id: '', name: '', description: ''})
            setNotificationData({message:'Стенд удалён', type: 'success'})
            toggleNotificationFunc()

        } else {
            setNotificationData({message:'Не удалось удалить стенд', type: 'error'})
            toggleNotificationFunc()
        }
    }

    const handleClick = () => {
        const maxDelayBetweenClicks = 400; // Максимальное время между кликами в миллисекундах
    
        // Увеличиваем счетчик кликов
        setClickCount(prevCount => prevCount + 1);
    
        // Если таймер уже был запущен, сбрасываем его
        if (clickTimer) clearTimeout(clickTimer);
    
        // Запускаем новый таймер
        setClickTimer(setTimeout(() => {
          // Проверяем количество кликов после истечения времени
          if (clickCount === 0) { // Однократное нажатие
            setNotificationData({message:'Нажмите "Удалить" 3 раза, если хотите удалить стенд', type: 'info'})
            toggleNotificationFunc()
          } else if (clickCount >= 2) { // Троекратное нажатие
            deleteStand();
          }
          // Сбрасываем счетчик кликов и таймер
          setClickCount(0);
          setClickTimer(null);
        }, maxDelayBetweenClicks));
      };

    useEffect(() => {
        getStands()
    }, [])

    return (
        <>
        <div className="stands-list">
            <>
            {
            <StandCard id={0} 
            name={'Добавить стенд'}
            picked={pickedStand['id'] === 0 && true || false}
            onClick={() => setPickedStand({id: 0, name: '',description: ''})}>
            </StandCard>
            } 

            </>
            {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && <>
                        {stands.map(stand =>
                            <StandCard id={stand.id} 
                            name={stand.name}
                            picked={pickedStand['id'] === stand.id && true || false}
                            onClick={() => setPickedStand(stand)}>
                            </StandCard>)}
                        </>}

        </div>
        <div className="stands-change-window">
            <input className="stands"
                disabled={pickedStand['id'] === 'default' && 'disabled' || ''}
                placeholder={pickedStand['id'] === 0 && "Новый стенд" || ''}
                value={pickedStand['id'] === 0 && '' || pickedStand['name']}
                onChange={changeStandName}></input>
            <textarea name="stand-description"
                disabled={pickedStand['id'] === 'default' && 'disabled' || ''}
                id={pickedStand['id']}
                placeholder={pickedStand['id'] === 0 && 'Описание стенда' || ''}
                className="stands"
                value={pickedStand['description']}
                onChange={changeStandDescription}></textarea>
            {pickedStand['id'] === 0 && <Button style={'userChange'} onClick={addStand}>Добавить</Button>}
            {(pickedStand['id'] != 0 && pickedStand['id'] != 'default') && <>
            <Button style={'userChange'} onClick={changeStand}>Изменить</Button>
            <Button style={'userDelete'} onClick={handleClick}>Удалить</Button>
            </>
            }
        </div>
        </>
    );
  
}
